// Based on Dice UI file-upload (https://github.com/sadmann7/diceui/blob/ea7c91f8c17689f84b928f513de4404784e89792/docs/registry/bases/radix/ui/file-upload.tsx)
// Copyright (c) 2024 Sadman Sakib. Licensed under MIT. Modified for Blank.
"use client"

import * as React from "react"
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  XIcon,
} from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

type FileUploadStatus = "idle" | "uploading" | "success" | "error"

type FileState = {
  status: FileUploadStatus
  progress: number
  error?: string
}

type FileUploadUploadOptions = {
  onProgress: (file: File, progress: number) => void
  onSuccess: (file: File) => void
  onError: (file: File, error: Error) => void
}

type FileUploadContextValue = {
  files: File[]
  states: Map<File, FileState>
  addFiles: (files: File[]) => void
  removeFile: (file: File) => void
  clear: () => void
  openPicker: () => void
  disabled: boolean
  dragging: boolean
  setDragging: (dragging: boolean) => void
  invalid: boolean
  previewUrl: (file: File) => string
  inputId: string
  listId: string
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(
  null
)

function useFileUpload(part: string) {
  const context = React.useContext(FileUploadContext)
  if (!context) throw new Error(`${part} must be used within <FileUpload>`)
  return context
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(exponent === 0 || value >= 10 ? 0 : 1)} ${units[exponent]}`
}

function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`
  return accept
    .split(",")
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean)
    .some((type) =>
      type.startsWith(".")
        ? extension === type
        : type.endsWith("/*")
          ? file.type.startsWith(type.slice(0, -1))
          : file.type === type
    )
}

type FileUploadProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: File[]
  defaultValue?: File[]
  onValueChange?: (files: File[]) => void
  /** Same syntax as the input's accept attribute: `image/*,.pdf`. */
  accept?: string
  /** Largest accepted file, in bytes. */
  maxSize?: number
  /** Most files the list will hold. */
  maxFiles?: number
  multiple?: boolean
  disabled?: boolean
  required?: boolean
  /** Name of the underlying file input, for native form posts. */
  name?: string
  /** Return a message to reject a file, or nothing to accept it. */
  onFileValidate?: (file: File) => string | null | undefined
  /** Called once per rejected file, with the reason in plain words. */
  onFileReject?: (file: File, message: string) => void
  /** Called with the files that passed validation. */
  onAccept?: (files: File[]) => void
  /** Upload accepted files and report back; drives each item's progress. */
  onUpload?: (
    files: File[],
    options: FileUploadUploadOptions
  ) => Promise<void> | void
}

function FileUpload({
  value: valueProp,
  defaultValue,
  onValueChange,
  accept,
  maxSize,
  maxFiles,
  multiple = false,
  disabled = false,
  required = false,
  name,
  onFileValidate,
  onFileReject,
  onAccept,
  onUpload,
  className,
  children,
  ...props
}: FileUploadProps) {
  const [uncontrolled, setUncontrolled] = React.useState<File[]>(
    defaultValue ?? []
  )
  const files = valueProp ?? uncontrolled
  const filesRef = React.useRef(files)
  filesRef.current = files

  const [states, setStates] = React.useState(() => new Map<File, FileState>())
  const [dragging, setDragging] = React.useState(false)
  const [invalid, setInvalid] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const urls = React.useRef(new Map<File, string>())
  const inputId = React.useId()
  const listId = React.useId()

  const setFiles = React.useCallback(
    (next: File[]) => {
      filesRef.current = next
      if (valueProp === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const patchState = React.useCallback((file: File, patch: Partial<FileState>) => {
    setStates((current) => {
      const next = new Map(current)
      next.set(file, {
        ...(current.get(file) ?? { status: "idle", progress: 0 }),
        ...patch,
      })
      return next
    })
  }, [])

  const revoke = (file: File) => {
    const url = urls.current.get(file)
    if (url) URL.revokeObjectURL(url)
    urls.current.delete(file)
  }

  React.useEffect(() => {
    const cache = urls.current
    return () => {
      for (const url of cache.values()) URL.revokeObjectURL(url)
      cache.clear()
    }
  }, [])

  const invalidTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => () => clearTimeout(invalidTimer.current), [])

  const upload = React.useCallback(
    async (accepted: File[]) => {
      if (!onUpload) return
      for (const file of accepted) patchState(file, { status: "uploading", progress: 0 })
      try {
        await onUpload(accepted, {
          onProgress: (file, progress) =>
            patchState(file, {
              status: "uploading",
              progress: Math.min(Math.max(progress, 0), 100),
            }),
          onSuccess: (file) => patchState(file, { status: "success", progress: 100 }),
          onError: (file, error) =>
            patchState(file, {
              status: "error",
              error: error.message || "Upload failed",
            }),
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : "Upload failed"
        for (const file of accepted) patchState(file, { status: "error", error: message })
      }
    },
    [onUpload, patchState]
  )

  const addFiles = React.useCallback(
    (incoming: File[]) => {
      if (disabled || incoming.length === 0) return
      const current = filesRef.current
      const candidates = multiple ? incoming : incoming.slice(0, 1)
      const accepted: File[] = []
      const rejected: string[] = []

      const reject = (file: File, message: string) => {
        rejected.push(file.name)
        onFileReject?.(file, message)
      }

      for (const file of candidates) {
        const count = (multiple ? current.length : 0) + accepted.length
        const custom = onFileValidate?.(file)
        if (custom) reject(file, custom)
        else if (!matchesAccept(file, accept)) reject(file, "File type not accepted")
        else if (maxSize !== undefined && file.size > maxSize)
          reject(file, `File is larger than ${formatBytes(maxSize)}`)
        else if (maxFiles !== undefined && count >= maxFiles)
          reject(file, `No more than ${maxFiles} ${maxFiles === 1 ? "file" : "files"}`)
        else accepted.push(file)
      }

      if (rejected.length > 0) {
        setInvalid(true)
        clearTimeout(invalidTimer.current)
        invalidTimer.current = setTimeout(() => setInvalid(false), 2000)
      }

      if (accepted.length > 0) {
        if (!multiple) current.forEach(revoke)
        setFiles(multiple ? [...current, ...accepted] : accepted)
        onAccept?.(accepted)
        void upload(accepted)
      }

      setAnnouncement(
        [
          accepted.length > 0 &&
            `Added ${accepted.length} ${accepted.length === 1 ? "file" : "files"}.`,
          rejected.length > 0 && `Rejected ${rejected.join(", ")}.`,
        ]
          .filter(Boolean)
          .join(" ")
      )
    },
    [
      disabled,
      multiple,
      accept,
      maxSize,
      maxFiles,
      onFileValidate,
      onFileReject,
      onAccept,
      setFiles,
      upload,
    ]
  )

  const removeFile = React.useCallback(
    (file: File) => {
      if (disabled) return
      revoke(file)
      setFiles(filesRef.current.filter((item) => item !== file))
      setStates((current) => {
        const next = new Map(current)
        next.delete(file)
        return next
      })
      setAnnouncement(`Removed ${file.name}.`)
    },
    [disabled, setFiles]
  )

  const clear = React.useCallback(() => {
    if (disabled) return
    filesRef.current.forEach(revoke)
    setFiles([])
    setStates(new Map())
    setAnnouncement("Removed all files.")
  }, [disabled, setFiles])

  const previewUrl = React.useCallback((file: File) => {
    let url = urls.current.get(file)
    if (!url) {
      url = URL.createObjectURL(file)
      urls.current.set(file, url)
    }
    return url
  }, [])

  // Keep the native input's FileList in step, so a plain form post sends the files.
  React.useEffect(() => {
    const input = inputRef.current
    if (!input || !name || typeof DataTransfer === "undefined") return
    const transfer = new DataTransfer()
    for (const file of files) transfer.items.add(file)
    input.files = transfer.files
  }, [files, name])

  const context = React.useMemo<FileUploadContextValue>(
    () => ({
      files,
      states,
      addFiles,
      removeFile,
      clear,
      openPicker: () => {
        if (!disabled) inputRef.current?.click()
      },
      disabled,
      dragging,
      setDragging,
      invalid,
      previewUrl,
      inputId,
      listId,
    }),
    [
      files,
      states,
      addFiles,
      removeFile,
      clear,
      disabled,
      dragging,
      invalid,
      previewUrl,
      inputId,
      listId,
    ]
  )

  return (
    <FileUploadContext.Provider value={context}>
      <div
        data-slot="file-upload"
        data-disabled={disabled || undefined}
        className={cn("gap-3 relative flex w-full flex-col", className)}
        {...props}
      >
        {children}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required && files.length === 0}
          onChange={(event) => {
            addFiles(Array.from(event.target.files ?? []))
            // Without a name the input is only a picker; reset it so the same
            // file can be picked again after it was removed.
            if (!name) event.target.value = ""
          }}
        />
        <span aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </div>
    </FileUploadContext.Provider>
  )
}

function FileUploadDropzone({
  className,
  onClick,
  onKeyDown,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onPaste,
  ...props
}: React.ComponentProps<"div">) {
  const {
    addFiles,
    openPicker,
    disabled,
    dragging,
    setDragging,
    invalid,
    listId,
  } = useFileUpload("FileUploadDropzone")

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-controls={listId}
      data-slot="file-upload-dropzone"
      data-dragging={dragging || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "gap-2 p-6 text-sm flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input bg-input-field text-center text-muted-foreground transition-colors outline-none select-none",
        "hover:border-input-hover hover:bg-item-outline-hover",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring",
        "data-dragging:border-brand data-dragging:bg-item-selected data-dragging:text-brand",
        "data-invalid:border-destructive data-invalid:bg-item-destructive-subtle",
        "data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:bg-input-disabled data-disabled:opacity-60",
        "[&_svg:not([class*='size-'])]:size-6",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const target = event.target as HTMLElement
        if (target.closest("[data-slot=file-upload-trigger]")) return
        openPicker()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || event.target !== event.currentTarget) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          openPicker()
        }
      }}
      onDragEnter={(event) => {
        onDragEnter?.(event)
        if (disabled) return
        event.preventDefault()
        setDragging(true)
      }}
      onDragOver={(event) => {
        onDragOver?.(event)
        if (disabled) return
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event)
        const related = event.relatedTarget as Node | null
        if (related && event.currentTarget.contains(related)) return
        setDragging(false)
      }}
      onDrop={(event) => {
        onDrop?.(event)
        event.preventDefault()
        setDragging(false)
        if (!disabled) addFiles(Array.from(event.dataTransfer.files))
      }}
      onPaste={(event) => {
        onPaste?.(event)
        const pasted = Array.from(event.clipboardData.files)
        if (pasted.length === 0) return
        event.preventDefault()
        addFiles(pasted)
      }}
      {...props}
    />
  )
}

function FileUploadTrigger({
  asChild = false,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { openPicker, disabled, inputId } = useFileUpload("FileUploadTrigger")
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      type="button"
      data-slot="file-upload-trigger"
      aria-controls={inputId}
      disabled={disabled}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) openPicker()
      }}
      {...props}
    />
  )
}

function FileUploadList({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"ul">, "children"> & {
  /** Render each file yourself; defaults to a complete item. */
  children?: (file: File) => React.ReactNode
}) {
  const { files, listId } = useFileUpload("FileUploadList")
  if (files.length === 0) return null

  return (
    <ul
      id={listId}
      data-slot="file-upload-list"
      className={cn("gap-2 flex flex-col", className)}
      {...props}
    >
      {files.map((file, index) => (
        <React.Fragment key={`${file.name}-${file.lastModified}-${index}`}>
          {children ? (
            children(file)
          ) : (
            <FileUploadItem file={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete />
              <FileUploadItemProgress />
            </FileUploadItem>
          )}
        </React.Fragment>
      ))}
    </ul>
  )
}

const FileUploadItemContext = React.createContext<{
  file: File
  state: FileState
  nameId: string
} | null>(null)

function useFileUploadItem(part: string) {
  const context = React.useContext(FileUploadItemContext)
  if (!context) throw new Error(`${part} must be used within <FileUploadItem>`)
  return context
}

function FileUploadItem({
  file,
  className,
  ...props
}: React.ComponentProps<"li"> & { file: File }) {
  const { states } = useFileUpload("FileUploadItem")
  const state = states.get(file) ?? { status: "idle", progress: 0 }
  const nameId = React.useId()

  return (
    <FileUploadItemContext.Provider value={{ file, state, nameId }}>
      <li
        data-slot="file-upload-item"
        data-status={state.status}
        aria-labelledby={nameId}
        className={cn(
          "group/file-upload-item gap-x-3 gap-y-2 p-2.5 pr-2 relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-xl border border-border bg-card",
          "data-[status=error]:border-danger-input",
          className
        )}
        {...props}
      />
    </FileUploadItemContext.Provider>
  )
}

function iconFor(file: File) {
  const type = file.type
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  if (type.startsWith("image/")) return FileImageIcon
  if (type.startsWith("video/")) return FileVideoIcon
  if (type.startsWith("audio/")) return FileAudioIcon
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) return FileArchiveIcon
  if (["js", "ts", "tsx", "jsx", "json", "html", "css", "py", "rb", "go"].includes(extension))
    return FileCodeIcon
  if (type.startsWith("text/") || ["pdf", "doc", "docx", "md"].includes(extension))
    return FileTextIcon
  return FileIcon
}

function FileUploadItemPreview({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { file } = useFileUploadItem("FileUploadItemPreview")
  const { previewUrl } = useFileUpload("FileUploadItemPreview")
  const isImage = file.type.startsWith("image/")
  const Icon = iconFor(file)

  return (
    <div
      data-slot="file-upload-item-preview"
      className={cn(
        "size-10 flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    >
      {children ??
        (isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl(file)} alt="" className="size-full object-cover" />
        ) : (
          <Icon aria-hidden="true" />
        ))}
    </div>
  )
}

function FileUploadItemMetadata({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { file, state, nameId } = useFileUploadItem("FileUploadItemMetadata")

  return (
    <div
      data-slot="file-upload-item-metadata"
      className={cn("min-w-0 gap-0.5 flex flex-col", className)}
      {...props}
    >
      {children ?? (
        <>
          <span id={nameId} className="text-sm font-medium truncate text-foreground">
            {file.name}
          </span>
          <span className="text-xs truncate text-muted-foreground group-data-[status=error]/file-upload-item:text-destructive">
            {state.status === "error"
              ? state.error
              : state.status === "uploading"
                ? `${formatBytes(file.size)} · ${Math.round(state.progress)}%`
                : formatBytes(file.size)}
          </span>
        </>
      )}
    </div>
  )
}

function FileUploadItemProgress({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Progress>, "value">) {
  const { file, state } = useFileUploadItem("FileUploadItemProgress")
  if (state.status !== "uploading") return null

  return (
    <Progress
      data-slot="file-upload-item-progress"
      size="sm"
      value={state.progress}
      aria-label={`Uploading ${file.name}`}
      className={cn("col-span-full", className)}
      {...props}
    />
  )
}

function FileUploadItemDelete({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { file } = useFileUploadItem("FileUploadItemDelete")
  const { removeFile, disabled } = useFileUpload("FileUploadItemDelete")

  return (
    <button
      type="button"
      data-slot="file-upload-item-delete"
      aria-label={`Remove ${file.name}`}
      disabled={disabled}
      className={cn(
        "size-8 flex shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-item-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) removeFile(file)
      }}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </button>
  )
}

function FileUploadClear({
  onClick,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { files, clear, disabled } = useFileUpload("FileUploadClear")
  if (files.length === 0) return null
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      type="button"
      data-slot="file-upload-clear"
      disabled={disabled}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) clear()
      }}
      {...props}
    />
  )
}

export {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
  formatBytes,
}
export type { FileUploadProps, FileUploadStatus, FileUploadUploadOptions }
