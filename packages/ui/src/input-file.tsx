"use client"

import * as React from "react"
import { FileIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type InputFileRejectReason = "type" | "size" | "count"

type InputFileContextValue = {
  files: File[]
  disabled: boolean
  dragging: boolean
  setDragging: (dragging: boolean) => void
  openPicker: () => void
  addFiles: (files: FileList | File[]) => void
  removeFile: (file: File) => void
}

const InputFileContext = React.createContext<InputFileContextValue | null>(null)

function useInputFile() {
  const context = React.useContext(InputFileContext)
  if (!context) {
    throw new Error("InputFile parts must be used within <InputFile>.")
  }
  return context
}

/** Mirrors the browser's own reading of the `accept` attribute. */
function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token)
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1))
      return type === token
    })
}

function sameFile(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

type InputFileProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  value?: File[]
  defaultValue?: File[]
  onValueChange?: (files: File[]) => void
  /** Same syntax as the native attribute: `image/*,.pdf`. */
  accept?: string
  multiple?: boolean
  /** Largest accepted file, in bytes. */
  maxSize?: number
  /** Most files kept at once when `multiple` is set. */
  maxFiles?: number
  /** Called for every file that is turned away, with the rule it broke. */
  onFileReject?: (file: File, reason: InputFileRejectReason) => void
  disabled?: boolean
  required?: boolean
  name?: string
}

/**
 * A visually hidden native input does the real work: it keeps the field in the
 * tab order, opens the system picker on Enter or Space, and submits with a
 * form. Everything visible is composed from the parts below.
 */
function InputFile({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onFileReject,
  disabled = false,
  required,
  name,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  className,
  children,
  ...props
}: InputFileProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const [dragging, setDragging] = React.useState(false)
  // Bumped on every native change, so the sync below also runs when the
  // picked files were all rejected and the value itself did not change.
  const [pickCount, setPickCount] = React.useState(0)
  const files = valueProp ?? uncontrolled

  const setFiles = React.useCallback(
    (next: File[]) => {
      if (valueProp === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [onValueChange, valueProp]
  )

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return
      const accepted: File[] = []
      for (const file of Array.from(incoming)) {
        if (!matchesAccept(file, accept)) {
          onFileReject?.(file, "type")
        } else if (maxSize !== undefined && file.size > maxSize) {
          onFileReject?.(file, "size")
        } else {
          accepted.push(file)
        }
      }
      if (accepted.length === 0) return

      if (!multiple) {
        accepted.slice(1).forEach((file) => onFileReject?.(file, "count"))
        setFiles([accepted[0]])
        return
      }

      const merged = [...files]
      for (const file of accepted) {
        if (merged.some((existing) => sameFile(existing, file))) continue
        if (maxFiles !== undefined && merged.length >= maxFiles) {
          onFileReject?.(file, "count")
          continue
        }
        merged.push(file)
      }
      setFiles(merged)
    },
    [
      accept,
      disabled,
      files,
      maxFiles,
      maxSize,
      multiple,
      onFileReject,
      setFiles,
    ]
  )

  const removeFile = React.useCallback(
    (file: File) => setFiles(files.filter((item) => item !== file)),
    [files, setFiles]
  )

  const openPicker = React.useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  // Keep the native input's FileList equal to the composed value, so a plain
  // form submit sends exactly the files the user sees.
  React.useEffect(() => {
    const input = inputRef.current
    if (!input || typeof DataTransfer === "undefined") return
    try {
      const transfer = new DataTransfer()
      files.forEach((file) => transfer.items.add(file))
      input.files = transfer.files
    } catch {
      // Older engines cannot assign a FileList; the visible list still works.
    }
  }, [files, pickCount])

  const context = React.useMemo(
    () => ({
      files,
      disabled,
      dragging,
      setDragging,
      openPicker,
      addFiles,
      removeFile,
    }),
    [addFiles, disabled, dragging, files, openPicker, removeFile]
  )

  return (
    <InputFileContext.Provider value={context}>
      <div
        data-slot="input-file"
        data-dragging={dragging}
        data-disabled={disabled}
        className={cn("group/input-file gap-3 grid w-full", className)}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          data-slot="input-file-input"
          id={id}
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required && files.length === 0}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files)
            setPickCount((count) => count + 1)
          }}
        />
        {children}
      </div>
    </InputFileContext.Provider>
  )
}

function InputFileDropzone({
  className,
  onClick,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...props
}: React.ComponentProps<"div">) {
  const { disabled, setDragging, openPicker, addFiles } = useInputFile()

  return (
    // The native input is the keyboard path (it is focusable and opens the
    // picker on Enter); the zone adds pointer and drag-and-drop on top of it.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      data-slot="input-file-dropzone"
      className={cn(
        "gap-3 p-6 min-h-36 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input bg-input-field text-center transition-[color,background-color,border-color,box-shadow]",
        "hover:border-input-hover hover:bg-item-outline-hover",
        "group-data-[dragging=true]/input-file:border-brand group-data-[dragging=true]/input-file:bg-item-selected",
        "group-has-[[data-slot=input-file-input]:focus-visible]/input-file:border-ring group-has-[[data-slot=input-file-input]:focus-visible]/input-file:ring-3 group-has-[[data-slot=input-file-input]:focus-visible]/input-file:ring-focus-ring",
        "group-has-[[data-slot=input-file-input][aria-invalid=true]]/input-file:border-danger-input",
        "group-data-[disabled=true]/input-file:pointer-events-none group-data-[disabled=true]/input-file:bg-input-disabled group-data-[disabled=true]/input-file:opacity-60",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if ((event.target as HTMLElement).closest("button, a")) return
        openPicker()
      }}
      onDragEnter={(event) => {
        onDragEnter?.(event)
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragOver={(event) => {
        onDragOver?.(event)
        event.preventDefault()
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event)
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        onDrop?.(event)
        event.preventDefault()
        setDragging(false)
        addFiles(event.dataTransfer.files)
      }}
      {...props}
    />
  )
}

function InputFileTrigger({
  variant = "outline",
  size = "sm",
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { disabled, openPicker } = useInputFile()

  return (
    <Button
      type="button"
      data-slot="input-file-trigger"
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) openPicker()
      }}
      {...props}
    />
  )
}

function InputFileList({ className, ...props }: React.ComponentProps<"ul">) {
  const { files } = useInputFile()
  if (files.length === 0) return null

  return (
    <ul
      data-slot="input-file-list"
      className={cn("gap-2 grid w-full", className)}
      {...props}
    />
  )
}

const InputFileItemContext = React.createContext<File | null>(null)

function useInputFileItem() {
  const file = React.useContext(InputFileItemContext)
  if (!file) {
    throw new Error("InputFileItem parts must be used within <InputFileItem>.")
  }
  return file
}

function InputFileItem({
  file,
  className,
  children,
  ...props
}: React.ComponentProps<"li"> & { file: File }) {
  return (
    <InputFileItemContext.Provider value={file}>
      <li
        data-slot="input-file-item"
        className={cn(
          "min-w-0 gap-3 p-2 pr-3 shadow-xs flex items-center rounded-xl border bg-card text-left",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <InputFileItemPreview />
            <InputFileItemContent>
              <InputFileItemName />
              <InputFileItemSize />
            </InputFileItemContent>
            <InputFileItemRemove />
          </>
        )}
      </li>
    </InputFileItemContext.Provider>
  )
}

/** An image file shows its own thumbnail; anything else shows a file icon. */
function InputFileItemPreview({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const file = useInputFileItem()
  const isImage = file.type.startsWith("image/")
  const [url, setUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!isImage) return
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, isImage])

  return (
    <span
      data-slot="input-file-item-preview"
      className={cn(
        "size-10 [&_svg:not([class*='size-'])]:size-5 flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {children ??
        (isImage && url ? (
          <img src={url} alt="" className="size-full object-cover" />
        ) : (
          <FileIcon aria-hidden="true" />
        ))}
    </span>
  )
}

function InputFileItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-file-item-content"
      className={cn("min-w-0 flex flex-1 flex-col", className)}
      {...props}
    />
  )
}

function InputFileItemName({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const file = useInputFileItem()

  return (
    <span
      data-slot="input-file-item-name"
      className={cn(
        "text-sm leading-5 font-medium truncate text-foreground",
        className
      )}
      {...props}
    >
      {children ?? file.name}
    </span>
  )
}

function InputFileItemSize({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const file = useInputFileItem()

  return (
    <span
      data-slot="input-file-item-size"
      className={cn(
        "text-xs leading-4 text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {children ?? formatBytes(file.size)}
    </span>
  )
}

function InputFileItemRemove({
  variant = "ghost",
  size = "icon-sm",
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const file = useInputFileItem()
  const { disabled, removeFile } = useInputFile()

  return (
    <Button
      type="button"
      data-slot="input-file-item-remove"
      variant={variant}
      size={size}
      disabled={disabled}
      aria-label={`Remove ${file.name}`}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) removeFile(file)
      }}
      {...props}
    >
      {children ?? <XIcon />}
    </Button>
  )
}

export {
  InputFile,
  InputFileDropzone,
  InputFileItem,
  InputFileItemContent,
  InputFileItemName,
  InputFileItemPreview,
  InputFileItemRemove,
  InputFileItemSize,
  InputFileList,
  InputFileTrigger,
  useInputFile,
}
export type { InputFileProps, InputFileRejectReason }
