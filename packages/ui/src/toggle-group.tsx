"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const toggleGroupItemVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center overflow-hidden border border-transparent bg-clip-padding",
    "font-medium shadow-xs whitespace-nowrap transition-all outline-none select-none",
    "focus-visible:relative focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring",
    "disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-error-ring",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-muted-foreground shadow-none hover:bg-item-secondary hover:text-foreground data-[state=on]:bg-item-selected data-[state=on]:text-foreground",
        outline:
          "border-border bg-background text-foreground hover:bg-item-outline-hover data-[state=on]:border-item-selected-border data-[state=on]:bg-item-selected",
        secondary:
          "border-border bg-background text-foreground hover:bg-item-outline-hover data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        ghost:
          "bg-transparent text-muted-foreground shadow-none hover:bg-item-secondary hover:text-foreground data-[state=on]:bg-item-secondary data-[state=on]:text-foreground",
      },
      size: {
        lg: "h-12 min-w-12 gap-1 px-4 text-base leading-6 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5 [&_svg:not([class*='size-'])]:size-5",
        default:
          "h-10 min-w-10 gap-1 px-3 text-sm leading-5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-5",
        sm: "h-8 min-w-8 gap-0.5 px-2.5 text-sm leading-5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-6 min-w-6 gap-1 px-2 text-xs leading-4 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:stroke-[2.25]",
      },
      shape: {
        rounded: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
)

type ToggleGroupSpacing = 0 | 1 | 2 | 3 | 4
type ToggleGroupOrientation = "horizontal" | "vertical"

// `spacing={0}` fuses the items into one control: a single outer shadow, no
// borders or radii between neighbours. Everything keys off the root's
// data-spacing / data-orientation / data-shape, so nothing is picked in JS.
const toggleGroupClassName = [
  "group/toggle-group inline-flex w-fit flex-row items-stretch data-[orientation=vertical]:flex-col",
  "data-[spacing=1]:gap-1 data-[spacing=2]:gap-2 data-[spacing=3]:gap-3 data-[spacing=4]:gap-4",
  "data-[spacing=0]:overflow-hidden data-[spacing=0]:shadow-xs data-[spacing=0]:[&>[data-slot=toggle-group-item]]:shadow-none",
  "data-[spacing=0]:data-[shape=rounded]:rounded-xl data-[spacing=0]:data-[shape=pill]:rounded-full",
  // Horizontal: neighbours share a vertical edge.
  "data-[spacing=0]:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:border-l-0 data-[spacing=0]:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:first-child)]:rounded-l-none data-[spacing=0]:data-[orientation=horizontal]:[&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-r-none",
  "data-[spacing=0]:data-[orientation=horizontal]:data-[shape=rounded]:[&>[data-slot=toggle-group-item]:first-child]:rounded-l-xl data-[spacing=0]:data-[orientation=horizontal]:data-[shape=rounded]:[&>[data-slot=toggle-group-item]:last-child]:rounded-r-xl",
  "data-[spacing=0]:data-[orientation=horizontal]:data-[shape=pill]:[&>[data-slot=toggle-group-item]:first-child]:rounded-l-full data-[spacing=0]:data-[orientation=horizontal]:data-[shape=pill]:[&>[data-slot=toggle-group-item]:last-child]:rounded-r-full",
  // Vertical: neighbours share a horizontal edge.
  "data-[spacing=0]:data-[orientation=vertical]:[&>[data-slot=toggle-group-item]:not(:first-child)]:border-t-0 data-[spacing=0]:data-[orientation=vertical]:[&>[data-slot=toggle-group-item]:not(:first-child)]:rounded-t-none data-[spacing=0]:data-[orientation=vertical]:[&>[data-slot=toggle-group-item]:not(:last-child)]:rounded-b-none",
  "data-[spacing=0]:data-[orientation=vertical]:data-[shape=rounded]:[&>[data-slot=toggle-group-item]:first-child]:rounded-t-xl data-[spacing=0]:data-[orientation=vertical]:data-[shape=rounded]:[&>[data-slot=toggle-group-item]:last-child]:rounded-b-xl",
  "data-[spacing=0]:data-[orientation=vertical]:data-[shape=pill]:[&>[data-slot=toggle-group-item]:first-child]:rounded-t-full data-[spacing=0]:data-[orientation=vertical]:data-[shape=pill]:[&>[data-slot=toggle-group-item]:last-child]:rounded-b-full",
]

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleGroupItemVariants> & {
    spacing: ToggleGroupSpacing
    orientation: ToggleGroupOrientation
  }
>({
  variant: "default",
  size: "default",
  shape: "rounded",
  spacing: 0,
  orientation: "horizontal",
})

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleGroupItemVariants> & {
    spacing?: ToggleGroupSpacing
  }

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  shape = "rounded",
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupProps) {
  const contextValue = React.useMemo(
    () => ({ variant, size, shape, spacing, orientation }),
    [variant, size, shape, spacing, orientation]
  )

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      className={cn(toggleGroupClassName, className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={contextValue}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

type ToggleGroupItemProps = React.ComponentProps<
  typeof ToggleGroupPrimitive.Item
> &
  VariantProps<typeof toggleGroupItemVariants>

function ToggleGroupItem({
  className,
  variant,
  size,
  shape,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={variant ?? context.variant}
      data-size={size ?? context.size}
      data-shape={shape ?? context.shape}
      data-spacing={context.spacing}
      className={cn(
        toggleGroupItemVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
          shape: shape ?? context.shape,
        }),
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants }
export type { ToggleGroupItemProps, ToggleGroupProps, ToggleGroupSpacing }
