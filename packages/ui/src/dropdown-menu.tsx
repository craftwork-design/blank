"use client"

import * as React from "react"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type DropdownMenuSize = "default" | "xs"

// Size lives in the DOM: the content carries `data-size` and every part reads
// it through `group-data-[size=xs]/dropdown-menu-content`. The context only
// exists so a sub menu rendered in its own portal can repeat that attribute.
const DropdownMenuSizeContext = React.createContext<DropdownMenuSize>("default")

const dropdownMenuContentClassName = [
  "group/dropdown-menu-content z-50 max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto border border-border bg-popover text-popover-foreground shadow-lg",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
]

const dropdownMenuItemClassName = [
  "group/dropdown-menu-item gap-1 relative flex cursor-default items-center outline-none select-none",
  "mx-1.5 my-0.5 min-h-8 p-1.5 text-sm leading-5 rounded-md",
  "group-data-[size=xs]/dropdown-menu-content:mx-1 group-data-[size=xs]/dropdown-menu-content:my-px group-data-[size=xs]/dropdown-menu-content:min-h-6 group-data-[size=xs]/dropdown-menu-content:rounded group-data-[size=xs]/dropdown-menu-content:p-1 group-data-[size=xs]/dropdown-menu-content:text-xs group-data-[size=xs]/dropdown-menu-content:leading-4",
  "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "[&_svg:not([class*='size-'])]:h-4 [&_svg:not([class*='size-'])]:w-5 [&_[data-slot=dropdown-menu-item-text]]:px-1",
  "group-data-[size=xs]/dropdown-menu-content:[&_svg:not([class*='size-'])]:h-3.5 group-data-[size=xs]/dropdown-menu-content:[&_svg:not([class*='size-'])]:w-4 group-data-[size=xs]/dropdown-menu-content:[&_[data-slot=dropdown-menu-item-text]]:px-0.5",
]

// Checkbox and radio items reserve room for the check on whichever side it sits.
const dropdownMenuIndicatorItemClassName = [
  "data-[state=checked]:bg-item-selected",
  "data-[indicator-position=end]:pr-8 data-[indicator-position=start]:pl-8",
  "group-data-[size=xs]/dropdown-menu-content:data-[indicator-position=end]:pr-6 group-data-[size=xs]/dropdown-menu-content:data-[indicator-position=start]:pl-6",
]

const dropdownMenuIndicatorClassName = [
  "pointer-events-none absolute flex size-4 items-center justify-center group-data-[size=xs]/dropdown-menu-content:size-3.5",
  "data-[position=start]:left-2 data-[position=end]:right-2",
  "group-data-[size=xs]/dropdown-menu-content:data-[position=start]:left-1.5 group-data-[size=xs]/dropdown-menu-content:data-[position=end]:right-1.5",
]

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  size = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  size?: DropdownMenuSize
}) {
  return (
    <DropdownMenuSizeContext.Provider value={size}>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          data-slot="dropdown-menu-content"
          data-size={size}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            dropdownMenuContentClassName,
            "min-w-60 py-1 data-[size=xs]:min-w-40 data-[size=xs]:py-0.5 rounded-xl data-[size=xs]:rounded-lg",
            className
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuSizeContext.Provider>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  selected,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  selected?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-selected={selected}
      data-variant={variant}
      className={cn(
        dropdownMenuItemClassName,
        "data-[selected=true]:bg-item-selected",
        "data-[inset=true]:pl-7 group-data-[size=xs]/dropdown-menu-content:data-[inset=true]:pl-5",
        "data-[variant=destructive]:text-destructive data-[variant=destructive]:data-[highlighted]:bg-item-destructive-subtle data-[variant=destructive]:data-[highlighted]:text-destructive",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "font-medium text-muted-foreground",
        "px-3.5 py-1.5 text-xs leading-4 group-data-[size=xs]/dropdown-menu-content:px-2.5 group-data-[size=xs]/dropdown-menu-content:py-1 group-data-[size=xs]/dropdown-menu-content:leading-3 group-data-[size=xs]/dropdown-menu-content:text-[11px]",
        "data-[inset=true]:pl-8 group-data-[size=xs]/dropdown-menu-content:data-[inset=true]:pl-6",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "h-2 px-2.5 group-data-[size=xs]/dropdown-menu-content:h-1.5 group-data-[size=xs]/dropdown-menu-content:px-2 flex items-center",
        className
      )}
      {...props}
    >
      <span className="h-px w-full bg-border" />
    </DropdownMenuPrimitive.Separator>
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "tracking-widest ml-auto text-muted-foreground group-data-[highlighted]/dropdown-menu-item:text-accent-foreground",
        "px-1 text-xs leading-4 group-data-[size=xs]/dropdown-menu-content:px-0.5 group-data-[size=xs]/dropdown-menu-content:leading-3 group-data-[size=xs]/dropdown-menu-content:text-[11px]",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  indicatorPosition = "end",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  indicatorPosition?: "start" | "end"
}) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-indicator-position={indicatorPosition}
      checked={checked}
      className={cn(
        dropdownMenuItemClassName,
        dropdownMenuIndicatorItemClassName,
        className
      )}
      {...props}
    >
      <span
        data-slot="dropdown-menu-item-indicator"
        data-position={indicatorPosition}
        className={cn(dropdownMenuIndicatorClassName)}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-full" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  indicatorPosition = "end",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  indicatorPosition?: "start" | "end"
}) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-indicator-position={indicatorPosition}
      className={cn(
        dropdownMenuItemClassName,
        dropdownMenuIndicatorItemClassName,
        className
      )}
      {...props}
    >
      <span
        data-slot="dropdown-menu-item-indicator"
        data-position={indicatorPosition}
        className={cn(dropdownMenuIndicatorClassName)}
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-full" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        dropdownMenuItemClassName,
        "pr-8 group-data-[size=xs]/dropdown-menu-content:pr-6",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        "data-[inset=true]:pl-7 group-data-[size=xs]/dropdown-menu-content:data-[inset=true]:pl-5",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="right-2 size-4 group-data-[size=xs]/dropdown-menu-content:right-1.5 group-data-[size=xs]/dropdown-menu-content:size-3.5 absolute" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const size = React.useContext(DropdownMenuSizeContext)
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      data-size={size}
      className={cn(
        "group/dropdown-menu-content shadow-lg z-50 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden border border-border bg-popover text-popover-foreground",
        "min-w-40 py-1 data-[size=xs]:min-w-32 data-[size=xs]:py-0.5 rounded-xl data-[size=xs]:rounded-lg",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  type DropdownMenuSize,
}
