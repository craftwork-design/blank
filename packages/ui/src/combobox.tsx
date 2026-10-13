"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import {
  ChevronDownIcon,
  CheckIcon,
  Layers2Icon,
  SearchIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"

type ComboboxValueType = unknown

type ComboboxContextValue = {
  query: string
  setQuery: (query: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  items: ComboboxValueType[]
  multiple: boolean
  value: ComboboxValueType | ComboboxValueType[] | undefined
  setValue: (value: ComboboxValueType | ComboboxValueType[] | undefined) => void
  itemToStringValue: (item: ComboboxValueType) => string
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

function useCombobox() {
  const context = React.useContext(ComboboxContext)

  if (!context) {
    throw new Error("Combobox components must be used within Combobox")
  }

  return context
}

function isEqualValue(a: ComboboxValueType, b: ComboboxValueType) {
  return Object.is(a, b)
}

function Combobox({
  items = [],
  value,
  defaultValue,
  onValueChange,
  itemToStringValue = (item) => String(item ?? ""),
  multiple = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  items?: ComboboxValueType[]
  value?: ComboboxValueType | ComboboxValueType[]
  defaultValue?: ComboboxValueType | ComboboxValueType[]
  onValueChange?: (
    value: ComboboxValueType | ComboboxValueType[] | undefined
  ) => void
  itemToStringValue?: (item: ComboboxValueType) => string
  multiple?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    ComboboxValueType | ComboboxValueType[] | undefined
  >(defaultValue)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [query, setQuery] = React.useState("")

  const currentValue = value ?? uncontrolledValue
  const open = openProp ?? uncontrolledOpen

  const setValue = React.useCallback(
    (nextValue: ComboboxValueType | ComboboxValueType[] | undefined) => {
      setUncontrolledValue(nextValue)
      onValueChange?.(nextValue)
      setQuery("")
    },
    [onValueChange]
  )

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen)
      if (!nextOpen) {
        setQuery("")
      }
    },
    [onOpenChange]
  )

  const contextValue = React.useMemo(
    () => ({
      query,
      setQuery,
      open,
      setOpen,
      items,
      multiple,
      value: currentValue,
      setValue,
      itemToStringValue,
    }),
    [
      query,
      open,
      setOpen,
      items,
      multiple,
      currentValue,
      setValue,
      itemToStringValue,
    ]
  )

  return (
    <ComboboxContext.Provider value={contextValue}>
      <Popover open={open} onOpenChange={setOpen}>
        <div data-slot="combobox" className={cn("w-fit", className)} {...props}>
          {children}
        </div>
      </Popover>
    </ComboboxContext.Provider>
  )
}

function ComboboxValue({
  className,
  placeholder,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  placeholder?: React.ReactNode
}) {
  const { value, multiple, itemToStringValue } = useCombobox()
  const label = multiple
    ? Array.isArray(value) && value.length > 0
      ? value.map(itemToStringValue).join(", ")
      : ""
    : value !== undefined && value !== null
      ? itemToStringValue(value)
      : ""

  return (
    <span data-slot="combobox-value" className={className} {...props}>
      {children ?? (label || placeholder)}
    </span>
  )
}

function ComboboxTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, setOpen } = useCombobox()

  return (
    <Button
      data-slot="combobox-trigger"
      variant="ghost"
      size="icon-xs"
      className={cn(
        "[&_svg]:size-4 shrink-0 text-muted-foreground shadow-none",
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setOpen(!open)
        }
      }}
      {...props}
    >
      {children ?? <ChevronDownIcon className="size-4 shrink-0" />}
    </Button>
  )
}

function ComboboxClear({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof InputGroupButton>) {
  const { setValue, multiple } = useCombobox()

  return (
    <InputGroupButton
      data-slot="combobox-clear"
      variant="ghost"
      size="icon-xs"
      className={cn("shrink-0 text-muted-foreground", className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          setValue(multiple ? [] : undefined)
        }
      }}
      {...props}
    >
      <XIcon />
    </InputGroupButton>
  )
}

function ComboboxInput({
  className,
  disabled = false,
  showTrigger = true,
  showClear = false,
  showIcon = false,
  leadingIcon,
  size = "default",
  variant = "default",
  placeholder,
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "size" | "value" | "onChange"
> & {
  showTrigger?: boolean
  showClear?: boolean
  showIcon?: boolean
  leadingIcon?: React.ReactNode
  size?: "sm" | "default" | "lg"
  variant?: "default" | "secondary"
}) {
  const { query, setQuery, setOpen, value, multiple, itemToStringValue } =
    useCombobox()
  const hasValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== undefined && value !== null
  const selectedLabel =
    !multiple && value !== undefined && value !== null
      ? itemToStringValue(value)
      : ""

  return (
    <PopoverAnchor asChild>
      <InputGroup
        data-slot="combobox-input"
        size={size}
        variant={variant}
        className={cn(
          "w-70 overflow-hidden focus-within:border-ring focus-within:ring-3 focus-within:ring-focus-ring has-[[data-slot=input-group-control]:focus-visible]:ring-focus-ring",
          // Height and radius come from InputGroup's size; only the inset
          // differs, because the trigger sits flush against the edge.
          "gap-1.5 pr-1 pl-2.5 data-[size=lg]:gap-2 data-[size=lg]:pr-1.5 data-[size=sm]:pl-2",
          className
        )}
      >
        {(showIcon || leadingIcon) && (
          <InputGroupAddon
            align="inline-start"
            className="px-0 shrink-0 [&_svg]:shrink-0"
          >
            {leadingIcon ?? <Layers2Icon className="size-4 shrink-0" />}
          </InputGroupAddon>
        )}
        <InputGroupInput
          disabled={disabled}
          placeholder={placeholder}
          value={query || selectedLabel}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          className="px-0 text-sm h-full"
          {...props}
        />
        <InputGroupAddon align="inline-end" className="gap-0 px-0 shrink-0">
          {showTrigger && !showClear && <ComboboxTrigger disabled={disabled} />}
          {showTrigger && showClear && !hasValue && (
            <ComboboxTrigger disabled={disabled} />
          )}
          {showClear && hasValue && <ComboboxClear disabled={disabled} />}
        </InputGroupAddon>
      </InputGroup>
    </PopoverAnchor>
  )
}

function ComboboxContent({
  className,
  children,
  align = "start",
  sideOffset = 4,
  inverted = false,
  ...props
}: React.ComponentProps<typeof PopoverContent> & {
  inverted?: boolean
}) {
  const { open } = useCombobox()

  if (!open) {
    return null
  }

  return (
    <PopoverContent
      data-slot="combobox-content"
      align={align}
      forceMount
      sideOffset={sideOffset}
      className={cn(
        "w-70 gap-0 p-0 shadow-md overflow-hidden rounded-lg border border-input bg-popover ring-0",
        className
      )}
      {...props}
    >
      <CommandPrimitive shouldFilter={false}>{children}</CommandPrimitive>
    </PopoverContent>
  )
}

function ComboboxList({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CommandPrimitive.List>, "children"> & {
  children?: React.ReactNode | ((item: ComboboxValueType) => React.ReactNode)
}) {
  const { items, query, itemToStringValue } = useCombobox()
  const filteredItems = query
    ? items.filter((item) =>
        itemToStringValue(item).toLowerCase().includes(query.toLowerCase())
      )
    : items

  return (
    <CommandPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar min-h-0 max-h-72 gap-1.5 px-1 py-1 flex flex-col overflow-y-auto overscroll-contain",
        className
      )}
      {...props}
    >
      {typeof children === "function"
        ? filteredItems.map((item) => children(item))
        : children}
    </CommandPrimitive.List>
  )
}

function ComboboxItem({
  className,
  children,
  value,
  ...props
}: Omit<
  React.ComponentProps<typeof CommandPrimitive.Item>,
  "value" | "onSelect"
> & {
  value: ComboboxValueType
}) {
  const {
    value: selectedValue,
    multiple,
    setOpen,
    setValue,
    itemToStringValue,
  } = useCombobox()
  const selected = multiple
    ? Array.isArray(selectedValue) &&
      selectedValue.some((item) => isEqualValue(item, value))
    : isEqualValue(selectedValue, value)

  return (
    <CommandPrimitive.Item
      data-slot="combobox-item"
      data-checked={selected || undefined}
      value={itemToStringValue(value)}
      onSelect={() => {
        if (multiple) {
          const current = Array.isArray(selectedValue) ? selectedValue : []
          setValue(
            selected
              ? current.filter((item) => !isEqualValue(item, value))
              : [...current, value]
          )
          return
        }

        setValue(value)
        setOpen(false)
      }}
      className={cn(
        "min-h-9 gap-1 px-2 py-2 text-sm relative flex cursor-default items-start rounded-lg bg-transparent text-popover-foreground outline-hidden select-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[checked=true]:[&_svg:last-child]:text-current data-[checked=true]:[&_svg:last-child]:opacity-100",
        className
      )}
      {...props}
    >
      <span className="min-w-0 gap-1 px-0.5 flex flex-1 flex-col">
        {children}
      </span>
      <CheckIcon className="mt-0.5 size-4 shrink-0 opacity-0" />
    </CommandPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-group"
      className={cn("gap-1.5 flex flex-col", className)}
      {...props}
    />
  )
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-label"
      className={cn(
        "h-7 px-2 text-xs flex items-center text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-collection" {...props} />
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<"div">) {
  const { items, query, itemToStringValue } = useCombobox()
  const hasItems = query
    ? items.some((item) =>
        itemToStringValue(item).toLowerCase().includes(query.toLowerCase())
      )
    : items.length > 0

  if (hasItems) {
    return null
  }

  return (
    <div
      data-slot="combobox-empty"
      className={cn(
        "h-12 p-1 text-sm flex items-center justify-center text-center text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  inset = false,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean
}) {
  return (
    <div
      data-slot="combobox-separator"
      data-inset={inset || undefined}
      className={cn("h-2 px-2.5 data-inset:px-2 flex items-center", className)}
      {...props}
    >
      <div className="h-px w-full bg-border" />
    </div>
  )
}

function ComboboxChips({
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "sm" | "default" | "lg"
  variant?: "default" | "secondary"
}) {
  return (
    <PopoverAnchor asChild>
      <div
        data-slot="combobox-chips"
        data-size={size}
        data-variant={variant}
        className={cn(
          "w-70 text-sm [&_[data-slot=combobox-value]]:min-w-0 [&_[data-slot=combobox-value]]:gap-1 flex flex-wrap items-center overflow-hidden border focus-within:border-ring focus-within:ring-3 focus-within:ring-focus-ring [&_[data-slot=combobox-value]]:flex [&_[data-slot=combobox-value]]:flex-1 [&_[data-slot=combobox-value]]:items-center",
          "data-[variant=default]:border-input data-[variant=default]:bg-input-field data-[variant=default]:shadow-field",
          "data-[variant=secondary]:border-transparent data-[variant=secondary]:bg-item-secondary",
          // The same 32 / 40 / 48 scale as every other control, as a minimum:
          // chips wrap onto new lines and the field grows with them.
          "min-h-10 gap-2 py-1 pr-1 pl-2.5 rounded-xl",
          "data-[size=lg]:min-h-12 data-[size=lg]:pr-1.5",
          "data-[size=sm]:min-h-8 data-[size=sm]:rounded-lg",
          className
        )}
        {...props}
      />
    </PopoverAnchor>
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: React.ComponentProps<"span"> & {
  showRemove?: boolean
}) {
  const { value, setValue, multiple, itemToStringValue } = useCombobox()

  return (
    <span
      data-slot="combobox-chip"
      data-removable={showRemove}
      className={cn(
        "h-5 gap-0 pl-1.5 pr-1.5 data-[removable=true]:pr-0 text-xs flex w-fit items-center rounded-xs bg-item-secondary text-foreground aria-disabled:opacity-50 data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <button
          type="button"
          data-slot="combobox-chip-remove"
          className="size-5 flex items-center justify-center rounded-xs text-muted-foreground outline-hidden hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={(event) => {
            event.preventDefault()
            if (!multiple || !Array.isArray(value)) {
              return
            }
            setValue(
              value.filter(
                (item) => itemToStringValue(item) !== String(children)
              )
            )
          }}
        >
          <XIcon className="size-3" />
        </button>
      )}
    </span>
  )
}

function ComboboxChipsInput({
  className,
  placeholder,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  const { query, setQuery, setOpen } = useCombobox()

  return (
    <input
      data-slot="combobox-chip-input"
      value={query}
      placeholder={placeholder}
      className={cn(
        "h-5 min-w-16 text-sm flex-1 bg-transparent outline-hidden placeholder:text-muted-foreground",
        className
      )}
      onFocus={() => setOpen(true)}
      onChange={(event) => {
        setQuery(event.target.value)
        setOpen(true)
      }}
      {...props}
    />
  )
}

function ComboboxSearchInput({
  className,
  placeholder = "Search",
  ...props
}: Omit<React.ComponentProps<typeof InputGroupInput>, "value" | "onChange">) {
  const { query, setQuery } = useCombobox()

  return (
    <InputGroup
      data-slot="combobox-search-input"
      variant="secondary"
      size="sm"
      className={cn("m-1 mb-0 w-auto", className)}
    >
      <InputGroupAddon align="inline-start" className="shrink-0">
        <SearchIcon className="size-4 shrink-0" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="px-0 text-sm h-full"
        {...props}
      />
    </InputGroup>
  )
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxSearchInput,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxClear,
}
