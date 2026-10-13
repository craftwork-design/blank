// Based on Dice UI tags-input (https://github.com/sadmann7/diceui/blob/ea7c91f8c17689f84b928f513de4404784e89792/docs/registry/bases/radix/ui/tags-input.tsx)
// and its @diceui/tags-input primitive (packages/tags-input/src at the same commit).
// Copyright (c) 2024 Sadman Sakib. Licensed under MIT. Modified for Blank.
"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type TagsInputInvalidReason = "duplicate" | "max" | "invalid"

type TagsInputContextValue = {
  value: string[]
  highlightedIndex: number | null
  setHighlightedIndex: (index: number | null) => void
  addTags: (input: string, options?: { split?: boolean }) => boolean
  removeTag: (index: number) => void
  clear: () => void
  resetInvalid: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  delimiter: string
  addOnBlur: boolean
  addOnPaste: boolean
  disabled: boolean
  readOnly: boolean
  itemId: (index: number) => string
}

const TagsInputContext = React.createContext<TagsInputContextValue | null>(
  null
)

function useTagsInput(part: string) {
  const context = React.useContext(TagsInputContext)
  if (!context) {
    throw new Error(`${part} must be used within <TagsInput>`)
  }
  return context
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

type TagsInputProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onInvalid"
> & {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Maximum number of tags. */
  max?: number
  /** Keep tags that are already in the list. */
  allowDuplicates?: boolean
  /** Character that commits a tag while typing and splits pasted text. */
  delimiter?: string
  /** Split pasted text into tags on the delimiter and on new lines. */
  addOnPaste?: boolean
  /** Commit whatever is in the input when it loses focus. */
  addOnBlur?: boolean
  /** Return false to reject a tag. */
  onValidate?: (tag: string) => boolean
  /** Called for every tag that was not added, with the reason. */
  onInvalid?: (tag: string, reason: TagsInputInvalidReason) => void
  disabled?: boolean
  readOnly?: boolean
  /** Submits one hidden input per tag under this name. */
  name?: string
  size?: "default" | "sm"
}

function TagsInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  max = Number.POSITIVE_INFINITY,
  allowDuplicates = false,
  delimiter = ",",
  addOnPaste = true,
  addOnBlur = false,
  onValidate,
  onInvalid,
  disabled = false,
  readOnly = false,
  name,
  size = "default",
  className,
  children,
  onClick,
  onMouseDown,
  ...props
}: TagsInputProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    defaultValue ?? []
  )
  const value = valueProp ?? uncontrolledValue
  const [highlightedIndex, setHighlightedIndex] = React.useState<
    number | null
  >(null)
  const [invalid, setInvalid] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const baseId = React.useId()

  // Handlers read the latest value through a ref, so several tags committed
  // in one paste never race a stale closure.
  const valueRef = React.useRef(value)
  valueRef.current = value

  const setValue = React.useCallback(
    (next: string[]) => {
      valueRef.current = next
      if (valueProp === undefined) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const addTags = React.useCallback(
    (input: string, options?: { split?: boolean }) => {
      if (disabled || readOnly) return false

      const pattern = new RegExp(`${escapeRegExp(delimiter)}|\\r?\\n`)
      const candidates = (options?.split ? input.split(pattern) : [input])
        .map((tag) => tag.trim())
        .filter(Boolean)
      if (candidates.length === 0) return false

      const next = [...valueRef.current]
      const rejected: string[] = []
      for (const tag of candidates) {
        let reason: TagsInputInvalidReason | null = null
        if (next.length >= max) reason = "max"
        else if (!allowDuplicates && next.includes(tag)) reason = "duplicate"
        else if (onValidate && !onValidate(tag)) reason = "invalid"

        if (reason) {
          rejected.push(tag)
          onInvalid?.(tag, reason)
        } else {
          next.push(tag)
        }
      }

      setInvalid(rejected.length > 0)
      setHighlightedIndex(null)
      if (next.length === valueRef.current.length) return false

      const added = next.slice(valueRef.current.length)
      setValue(next)
      setAnnouncement(`Added ${added.join(", ")}`)
      return true
    },
    [
      disabled,
      readOnly,
      delimiter,
      max,
      allowDuplicates,
      onValidate,
      onInvalid,
      setValue,
    ]
  )

  const removeTag = React.useCallback(
    (index: number) => {
      if (disabled || readOnly) return
      const current = valueRef.current
      const tag = current[index]
      if (tag === undefined) return
      setValue(current.filter((_, i) => i !== index))
      setInvalid(false)
      setAnnouncement(`Removed ${tag}`)
    },
    [disabled, readOnly, setValue]
  )

  const clear = React.useCallback(() => {
    if (disabled || readOnly || valueRef.current.length === 0) return
    setValue([])
    setInvalid(false)
    setHighlightedIndex(null)
    setAnnouncement("All tags removed")
  }, [disabled, readOnly, setValue])

  // The input keeps focus while a tag is marked, so say which one it is.
  React.useEffect(() => {
    if (highlightedIndex === null) return
    const tag = valueRef.current[highlightedIndex]
    if (tag !== undefined) {
      setAnnouncement(`${tag}. Press Backspace to remove.`)
    }
  }, [highlightedIndex])

  const context = React.useMemo<TagsInputContextValue>(
    () => ({
      value,
      highlightedIndex,
      setHighlightedIndex,
      addTags,
      removeTag,
      clear,
      resetInvalid: () => setInvalid(false),
      inputRef,
      delimiter,
      addOnBlur,
      addOnPaste,
      disabled,
      readOnly,
      itemId: (index) => `${baseId}-tag-${index}`,
    }),
    [
      value,
      highlightedIndex,
      addTags,
      removeTag,
      clear,
      delimiter,
      addOnBlur,
      addOnPaste,
      disabled,
      readOnly,
      baseId,
    ]
  )

  return (
    <TagsInputContext.Provider value={context}>
      {/* Pointer convenience only: the input inside is the keyboard target. */}
      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        data-slot="tags-input"
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={invalid || undefined}
        className={cn(
          "group/tags-input min-w-0 gap-1.5 text-sm flex w-full cursor-text flex-wrap items-center border border-input bg-input-field text-foreground shadow-field transition-colors",
          "data-[size=default]:min-h-10 data-[size=default]:rounded-xl data-[size=default]:px-1.5 data-[size=default]:py-1.5",
          "data-[size=sm]:min-h-8 data-[size=sm]:rounded-lg data-[size=sm]:px-1 data-[size=sm]:py-1",
          "hover:border-input-hover",
          "has-[[data-slot=tags-input-input]:focus-visible]:border-ring has-[[data-slot=tags-input-input]:focus-visible]:ring-3 has-[[data-slot=tags-input-input]:focus-visible]:ring-focus-ring",
          "has-[[aria-invalid=true]]:border-danger-input data-invalid:border-danger-input",
          "has-[[aria-invalid=true]]:has-[[data-slot=tags-input-input]:focus-visible]:border-destructive has-[[aria-invalid=true]]:has-[[data-slot=tags-input-input]:focus-visible]:ring-error-ring",
          "data-invalid:has-[[data-slot=tags-input-input]:focus-visible]:border-destructive data-invalid:has-[[data-slot=tags-input-input]:focus-visible]:ring-error-ring",
          "data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:bg-input-disabled data-disabled:text-muted-foreground data-disabled:shadow-none",
          className
        )}
        onMouseDown={(event) => {
          onMouseDown?.(event)
          // Keep focus in the input when the empty area is pressed.
          if (event.target === event.currentTarget) event.preventDefault()
        }}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || disabled) return
          if (event.target === event.currentTarget) inputRef.current?.focus()
        }}
        {...props}
      >
        {children}
        {name &&
          value.map((tag, index) => (
            <input
              key={`${tag}-${index}`}
              type="hidden"
              name={name}
              value={tag}
              disabled={disabled}
            />
          ))}
        <span aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </div>
    </TagsInputContext.Provider>
  )
}

function TagsInputList({
  children,
}: {
  children?: (tag: string, index: number) => React.ReactNode
}) {
  const { value } = useTagsInput("TagsInputList")

  return (
    <>
      {value.map((tag, index) =>
        children ? (
          <React.Fragment key={`${tag}-${index}`}>
            {children(tag, index)}
          </React.Fragment>
        ) : (
          <TagsInputItem key={`${tag}-${index}`} index={index}>
            {tag}
          </TagsInputItem>
        )
      )}
    </>
  )
}

function TagsInputItem({
  index,
  className,
  children,
  onMouseDown,
  onClick,
  ...props
}: React.ComponentProps<"span"> & {
  /** Position of the tag in the value array. */
  index: number
}) {
  const {
    value,
    highlightedIndex,
    setHighlightedIndex,
    removeTag,
    inputRef,
    disabled,
    readOnly,
    itemId,
  } = useTagsInput("TagsInputItem")
  const tag = value[index]
  const highlighted = highlightedIndex === index
  const removable = !disabled && !readOnly

  return (
    <span
      id={itemId(index)}
      data-slot="tags-input-item"
      data-highlighted={highlighted || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "h-6 max-w-full gap-0.5 pl-2 text-sm leading-5 font-medium inline-flex min-w-0 items-center rounded-md border border-border bg-background text-foreground transition-colors select-none",
        "group-data-[size=sm]/tags-input:h-5.5 group-data-[size=sm]/tags-input:text-xs",
        "data-highlighted:border-item-selected-border data-highlighted:bg-item-selected data-highlighted:text-brand",
        "data-disabled:text-muted-foreground",
        removable ? "pr-0.5" : "pr-2",
        className
      )}
      onMouseDown={(event) => {
        onMouseDown?.(event)
        event.preventDefault()
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!removable) return
        setHighlightedIndex(index)
        inputRef.current?.focus()
      }}
      {...props}
    >
      <span className="truncate">{children ?? tag}</span>
      {removable && (
        <button
          type="button"
          tabIndex={-1}
          data-slot="tags-input-item-delete"
          aria-label={`Remove ${tag}`}
          className="size-5 shrink-0 flex items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:bg-item-secondary hover:text-foreground [&_svg]:size-3.5"
          onClick={(event) => {
            event.stopPropagation()
            removeTag(index)
            inputRef.current?.focus()
          }}
        >
          <XIcon aria-hidden="true" />
        </button>
      )}
    </span>
  )
}

function TagsInputInput({
  className,
  onKeyDown,
  onChange,
  onPaste,
  onBlur,
  ...props
}: React.ComponentProps<"input">) {
  const {
    value,
    highlightedIndex,
    setHighlightedIndex,
    addTags,
    removeTag,
    inputRef,
    delimiter,
    addOnBlur,
    addOnPaste,
    disabled,
    readOnly,
    resetInvalid,
  } = useTagsInput("TagsInputInput")

  const commit = (input: HTMLInputElement) => {
    if (input.value.trim() && addTags(input.value)) input.value = ""
  }

  return (
    <input
      ref={inputRef}
      type="text"
      data-slot="tags-input-input"
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      disabled={disabled}
      readOnly={readOnly}
      className={cn(
        "h-6 min-w-20 px-1.5 text-sm flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
        className
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || readOnly || disabled) return
        const input = event.currentTarget
        const atStart = input.selectionStart === 0 && input.selectionEnd === 0
        const last = value.length - 1

        switch (event.key) {
          case "Enter": {
            if (!input.value.trim()) return
            event.preventDefault()
            commit(input)
            return
          }
          case "Backspace":
          case "Delete": {
            if (highlightedIndex !== null) {
              event.preventDefault()
              removeTag(highlightedIndex)
              const next =
                event.key === "Backspace"
                  ? highlightedIndex - 1
                  : highlightedIndex
              setHighlightedIndex(
                next >= 0 && next < value.length - 1 ? next : null
              )
            } else if (event.key === "Backspace" && atStart && last >= 0) {
              // First press marks the last tag, the second removes it.
              event.preventDefault()
              setHighlightedIndex(last)
            }
            return
          }
          case "ArrowLeft": {
            if (highlightedIndex !== null) {
              event.preventDefault()
              setHighlightedIndex(Math.max(0, highlightedIndex - 1))
            } else if (atStart && last >= 0) {
              event.preventDefault()
              setHighlightedIndex(last)
            }
            return
          }
          case "ArrowRight": {
            if (highlightedIndex === null) return
            event.preventDefault()
            setHighlightedIndex(
              highlightedIndex < last ? highlightedIndex + 1 : null
            )
            return
          }
          case "Home":
          case "End": {
            if (highlightedIndex === null) return
            event.preventDefault()
            setHighlightedIndex(event.key === "Home" ? 0 : last)
            return
          }
          case "Escape": {
            if (highlightedIndex !== null) {
              event.preventDefault()
              setHighlightedIndex(null)
            }
            return
          }
          default: {
            if (event.key === delimiter) {
              event.preventDefault()
              commit(input)
            } else if (event.key.length === 1) {
              setHighlightedIndex(null)
            }
          }
        }
      }}
      onChange={(event) => {
        onChange?.(event)
        resetInvalid()
        // Virtual keyboards and IMEs do not always report the delimiter key.
        const input = event.currentTarget
        if (input.value.includes(delimiter)) {
          const parts = input.value.split(delimiter)
          const rest = parts.pop() ?? ""
          addTags(parts.join(delimiter), { split: true })
          input.value = rest
        }
      }}
      onPaste={(event) => {
        onPaste?.(event)
        if (event.defaultPrevented || !addOnPaste) return
        const text = event.clipboardData.getData("text")
        const splitter = new RegExp(`${escapeRegExp(delimiter)}|\\n`)
        if (!splitter.test(text)) return
        event.preventDefault()
        addTags(text, { split: true })
      }}
      onBlur={(event) => {
        onBlur?.(event)
        setHighlightedIndex(null)
        if (!event.defaultPrevented && addOnBlur) commit(event.currentTarget)
      }}
      {...props}
    />
  )
}

function TagsInputClear({
  className,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { value, disabled, readOnly, inputRef, clear } =
    useTagsInput("TagsInputClear")

  if (value.length === 0 || disabled || readOnly) return null

  return (
    <button
      type="button"
      data-slot="tags-input-clear"
      aria-label="Clear all tags"
      className={cn(
        "size-6 ml-auto shrink-0 flex items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-item-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        clear()
        inputRef.current?.focus()
      }}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </button>
  )
}

export {
  TagsInput,
  TagsInputClear,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
}
export type { TagsInputInvalidReason, TagsInputProps }
