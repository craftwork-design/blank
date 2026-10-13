import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button font-medium inline-flex shrink-0 items-center justify-center overflow-hidden border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-error-ring [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      // Four steps of emphasis, each available against a destructive target.
      // Names match shadcn so upstream blocks drop in and look as intended:
      // `secondary` is the filled step, `outline` the bordered one.
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-85",
        secondary:
          "bg-item-secondary text-foreground hover:bg-item-secondary-hover hover:opacity-90 aria-expanded:bg-item-secondary-hover",
        outline:
          "border-border bg-item-outline text-foreground hover:bg-item-outline-hover hover:opacity-90 aria-expanded:bg-item-outline-hover",
        ghost:
          "text-muted-foreground hover:bg-item-secondary hover:text-foreground hover:opacity-90 aria-expanded:bg-item-secondary",
        link: "text-brand underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-85 focus-visible:border-destructive focus-visible:ring-error-ring",
        "destructive-secondary":
          "bg-item-destructive-subtle text-destructive-subtle-foreground hover:bg-item-destructive-subtle-hover hover:opacity-90 focus-visible:border-destructive focus-visible:ring-error-ring",
        "destructive-outline":
          "border-danger-input bg-item-outline text-destructive-subtle-foreground hover:bg-danger hover:opacity-90 focus-visible:border-destructive focus-visible:ring-error-ring",
        "destructive-ghost":
          "text-destructive-subtle-foreground hover:bg-item-destructive-subtle hover:opacity-90 focus-visible:border-destructive focus-visible:ring-error-ring",
      },
      size: {
        lg: "h-12 gap-2 px-4 text-base leading-6 has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5 [&_svg:not([class*='size-'])]:size-5",
        default:
          "h-10 gap-1.5 px-3 text-sm leading-5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-5",
        sm: "h-8 gap-1 px-2.5 text-sm leading-5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        xs: "h-6 gap-0.5 px-2 text-xs leading-4 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:stroke-[2.25]",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-xs":
          "size-6 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:stroke-[2.25]",
      },
      shape: {
        rounded: "rounded-xl",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: "sm", className: "rounded-lg" },
      { shape: "rounded", size: "icon-sm", className: "rounded-lg" },
      { shape: "rounded", size: "xs", className: "rounded-md" },
      { shape: "rounded", size: "icon-xs", className: "rounded-md" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "rounded",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
