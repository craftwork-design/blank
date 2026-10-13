"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Toggle as TogglePrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// A pressable two-state button, styled exactly like a ToggleGroup item so a
// standalone toggle and one inside a group are indistinguishable.
const toggleVariants = cva(
  "group/toggle font-medium inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-error-ring [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-transparent text-muted-foreground hover:bg-item-secondary hover:text-foreground data-[state=on]:bg-item-secondary data-[state=on]:text-foreground",
        outline:
          "border-border bg-item-outline text-muted-foreground hover:bg-item-outline-hover hover:text-foreground data-[state=on]:bg-item-selected data-[state=on]:text-foreground",
      },
      size: {
        lg: "h-12 min-w-12 gap-1 px-4 text-base leading-6 [&_svg:not([class*='size-'])]:size-5",
        default:
          "h-10 min-w-10 gap-1 px-3 text-sm leading-5 [&_svg:not([class*='size-'])]:size-5",
        sm: "h-8 min-w-8 gap-0.5 px-2.5 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-6 min-w-6 gap-1 px-2 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:stroke-[2.25]",
      },
      shape: {
        rounded: "rounded-xl",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: "sm", className: "rounded-lg" },
      { shape: "rounded", size: "xs", className: "rounded-md" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  shape = "rounded",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(toggleVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
