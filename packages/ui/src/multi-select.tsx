// Based on Origin UI multiselect (https://github.com/cosscom/coss/blob/0ac96b5353780c19d3122a86cac67ef0551f33ce/apps/origin/registry/default/ui/multiselect.tsx)
// Copyright (c) 2025 coss.com, originally Copyright (c) 2025 Origin UI.
// Licensed under MIT (apps/origin/LICENSE.md). Modified for Blank.
"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { CheckIcon, ChevronDownIcon, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"

type MultiSelectOption = {
  value: string
  label: string
  disabled?: boolean
  /** Options with the same group are listed under one heading. */
  group?: string
}

type MultiSelectProps = {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** Most options that can be selected at once. */
  maxCount?: number
  /** Called when a pick is refused because `maxCount` is reached. */
  onMaxCount?: (maxCount: number) => void
  /** Offer the typed text as a new option when nothing matches it exactly. */
  creatable?: boolean
  /** Called with the typed text; return the value to select, or nothing to add it as is. */
  onCreateOption?: (label: string) => string | void
  placeholder?: string
  emptyMessage?: React.ReactNode
  /** Label for the create row; receives the typed text. */
  createLabel?: (query: string) => React.ReactNode
  disabled?: boolean
  /** Submits one hidden input per selected value under this name. */
  name?: string
  /** Id of the text input, for `<FieldLabel htmlFor>`. */
  id?: string
  size?: "default" | "sm"
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  "aria-invalid"?: React.AriaAttributes["aria-invalid"]
  "aria-describedby"?: string
  "aria-label"?: string
}

const CREATE = "\u0000create"

function MultiSelect({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  maxCount,
  onMaxCount,
  creatable = false,
  onCreateOption,
  placeholder,
  emptyMessage = "No results.",
  createLabel = (query) => `Create "${query}"`,
  disabled = false,
  name,
  id,
  size = "default",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...aria
}: MultiSelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    defaultValue ?? []
  )
  const value = valueProp ?? uncontrolledValue
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const [query, setQuery] = React.useState("")
  const [highlighted, setHighlighted] = React.useState("")
  const [activeId, setActiveId] = React.useState<string>()
  const [listId, setListId] = React.useState<string>()
  const [created, setCreated] = React.useState<MultiSelectOption[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const allOptions = React.useMemo(() => {
    const known = new Set(options.map((option) => option.value))
    return [...options, ...created.filter((option) => !known.has(option.value))]
  }, [options, created])
  const byValue = React.useMemo(
    () => new Map(allOptions.map((option) => [option.value, option])),
    [allOptions]
  )

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (next && disabled) return
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
      if (!next) setQuery("")
    },
    [disabled, openProp, onOpenChange]
  )

  const setValue = React.useCallback(
    (next: string[]) => {
      if (valueProp === undefined) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const atMax = maxCount !== undefined && value.length >= maxCount

  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      setValue(value.filter((item) => item !== optionValue))
    } else if (atMax) {
      onMaxCount?.(maxCount!)
    } else {
      setValue([...value, optionValue])
    }
    setQuery("")
  }

  const create = () => {
    const label = query.trim()
    if (!label) return
    if (atMax) {
      onMaxCount?.(maxCount!)
      return
    }
    const nextValue = onCreateOption?.(label) || label
    if (!byValue.has(nextValue)) {
      setCreated((current) => [...current, { value: nextValue, label }])
    }
    if (!value.includes(nextValue)) setValue([...value, nextValue])
    setQuery("")
  }

  const needle = query.trim().toLowerCase()
  const filtered = needle
    ? allOptions.filter((option) => option.label.toLowerCase().includes(needle))
    : allOptions
  const showCreate =
    creatable &&
    needle !== "" &&
    !allOptions.some((option) => option.label.toLowerCase() === needle)

  const groups = React.useMemo(() => {
    const map = new Map<string, MultiSelectOption[]>()
    for (const option of filtered) {
      const key = option.group ?? ""
      map.set(key, [...(map.get(key) ?? []), option])
    }
    return [...map.entries()]
  }, [filtered])

  // Highlight the first enabled row whenever the visible rows change.
  const firstEnabled =
    filtered.find((option) => !option.disabled)?.value ??
    (showCreate ? CREATE : "")
  const visibleKey = filtered.map((option) => option.value).join("\n")
  React.useEffect(() => {
    setHighlighted(firstEnabled)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKey, showCreate, open])

  // cmdk owns the option ids; mirror the highlighted one onto the input.
  React.useEffect(() => {
    if (!open) {
      setActiveId(undefined)
      return
    }
    const frame = requestAnimationFrame(() => {
      setListId(listRef.current?.id)
      setActiveId(
        listRef.current?.querySelector<HTMLElement>(
          "[cmdk-item][aria-selected=true]"
        )?.id
      )
    })
    return () => cancelAnimationFrame(frame)
  }, [open, highlighted, visibleKey])

  return (
    <CommandPrimitive
      data-slot="multi-select"
      shouldFilter={false}
      loop
      value={highlighted}
      onValueChange={setHighlighted}
      label={aria["aria-label"] ?? placeholder ?? "Options"}
      className="contents"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          {/* Pointer convenience only: the input inside takes keyboard focus. */}
          {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            ref={anchorRef}
            data-slot="multi-select-trigger"
            data-size={size}
            data-disabled={disabled || undefined}
            data-state={open ? "open" : "closed"}
            className={cn(
              "group/multi-select min-w-0 gap-1 pr-9 text-sm relative flex w-full cursor-text flex-wrap items-center border border-input bg-input-field text-foreground shadow-field transition-colors",
              "data-[size=default]:min-h-10 data-[size=default]:rounded-xl data-[size=default]:py-1.5 data-[size=default]:pl-1.5",
              "data-[size=sm]:min-h-8 data-[size=sm]:rounded-lg data-[size=sm]:py-1 data-[size=sm]:pl-1",
              "hover:border-input-hover",
              "has-[[data-slot=multi-select-input]:focus-visible]:border-ring has-[[data-slot=multi-select-input]:focus-visible]:ring-3 has-[[data-slot=multi-select-input]:focus-visible]:ring-focus-ring",
              "has-[[aria-invalid=true]]:border-danger-input has-[[aria-invalid=true]]:has-[[data-slot=multi-select-input]:focus-visible]:border-destructive has-[[aria-invalid=true]]:has-[[data-slot=multi-select-input]:focus-visible]:ring-error-ring",
              "data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:bg-input-disabled data-disabled:text-muted-foreground data-disabled:shadow-none",
              className
            )}
            onMouseDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return
              event.preventDefault()
              if (disabled) return
              inputRef.current?.focus()
              // The text field always opens the list; the rest of the box toggles it.
              setOpen(event.target === inputRef.current ? true : !open)
            }}
          >
            {value.map((item) => {
              const label = byValue.get(item)?.label ?? item
              return (
                <span
                  key={item}
                  data-slot="multi-select-badge"
                  className="h-6 max-w-full gap-0.5 pl-2 pr-0.5 text-sm leading-5 font-medium inline-flex min-w-0 items-center rounded-md border border-border bg-background text-foreground group-data-[size=sm]/multi-select:h-5.5 group-data-[size=sm]/multi-select:text-xs group-data-disabled/multi-select:pr-2 group-data-disabled/multi-select:text-muted-foreground"
                >
                  <span className="truncate">{label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={`Remove ${label}`}
                      className="size-5 shrink-0 flex items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:bg-item-secondary hover:text-foreground [&_svg]:size-3.5"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setValue(value.filter((entry) => entry !== item))
                        inputRef.current?.focus()
                      }}
                    >
                      <XIcon aria-hidden="true" />
                    </button>
                  )}
                </span>
              )
            })}
            <input
              ref={inputRef}
              id={id}
              type="text"
              role="combobox"
              data-slot="multi-select-input"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={open ? listId : undefined}
              aria-haspopup="listbox"
              aria-activedescendant={open ? activeId : undefined}
              aria-invalid={aria["aria-invalid"]}
              aria-describedby={aria["aria-describedby"]}
              aria-label={aria["aria-label"]}
              disabled={disabled}
              value={query}
              placeholder={value.length === 0 ? placeholder : undefined}
              className="h-6 min-w-16 px-1.5 text-sm flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
              onChange={(event) => {
                setQuery(event.target.value)
                if (!open) setOpen(true)
              }}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && query === "" && value.length) {
                  event.preventDefault()
                  setValue(value.slice(0, -1))
                } else if (
                  !open &&
                  (event.key === "ArrowDown" || event.key === "ArrowUp")
                ) {
                  event.preventDefault()
                  event.stopPropagation()
                  setOpen(true)
                } else if (!open && event.key === "Enter") {
                  // Let the form submit when the list is closed.
                  event.stopPropagation()
                } else if (open && event.key === "Escape") {
                  event.preventDefault()
                  setOpen(false)
                } else if (open && event.key === "Tab") {
                  setOpen(false)
                }
              }}
            />
            <ChevronDownIcon
              aria-hidden="true"
              className="right-3 size-4 pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-transform group-data-[state=open]/multi-select:rotate-180 group-data-[size=sm]/multi-select:right-2.5"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          data-slot="multi-select-content"
          align="start"
          className="w-(--radix-popover-trigger-width) min-w-48 p-1 gap-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (anchorRef.current?.contains(event.target as Node)) {
              event.preventDefault()
            }
          }}
        >
          <CommandPrimitive.List
            ref={listRef}
            data-slot="multi-select-list"
            data-at-max={atMax || undefined}
            className="group/multi-select-list max-h-64 scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain outline-none"
          >
            {filtered.length === 0 && !showCreate && (
              <div
                data-slot="multi-select-empty"
                className="py-6 text-sm text-center text-muted-foreground"
              >
                {emptyMessage}
              </div>
            )}
            {groups.map(([group, items]) => (
              <CommandPrimitive.Group
                key={group}
                heading={group || undefined}
                className="**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:pt-2 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground"
              >
                {items.map((option) => {
                  const selected = value.includes(option.value)
                  return (
                    <CommandPrimitive.Item
                      key={option.value}
                      value={option.value}
                      // At the limit the rest stay reachable but dimmed, so a
                      // pick can be refused out loud through onMaxCount.
                      disabled={option.disabled}
                      data-slot="multi-select-item"
                      data-checked={selected || undefined}
                      onSelect={() => toggle(option.value)}
                      className="min-h-9 gap-2 px-2 py-1.5 text-sm relative flex cursor-default items-center rounded-lg outline-hidden select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 group-data-at-max/multi-select-list:not-data-checked:opacity-50"
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      <CheckIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-brand opacity-0 in-data-checked:opacity-100"
                      />
                    </CommandPrimitive.Item>
                  )
                })}
              </CommandPrimitive.Group>
            ))}
            {showCreate && (
              <CommandPrimitive.Item
                value={CREATE}
                data-slot="multi-select-create"
                onSelect={create}
                className="min-h-9 gap-2 px-2 py-1.5 text-sm flex cursor-default items-center rounded-lg text-muted-foreground outline-hidden select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground group-data-at-max/multi-select-list:opacity-50 [&_svg]:size-4"
              >
                <PlusIcon aria-hidden="true" />
                <span className="truncate">{createLabel(query.trim())}</span>
              </CommandPrimitive.Item>
            )}
          </CommandPrimitive.List>
        </PopoverContent>
      </Popover>
      {name &&
        value.map((item) => (
          <input
            key={item}
            type="hidden"
            name={name}
            value={item}
            disabled={disabled}
          />
        ))}
    </CommandPrimitive>
  )
}

export { MultiSelect }
export type { MultiSelectOption, MultiSelectProps }
