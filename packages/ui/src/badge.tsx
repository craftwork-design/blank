import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge gap-1 font-medium inline-flex w-fit shrink-0 items-center justify-center overflow-hidden border border-transparent whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-error-ring [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    // One axis. The first four names are shadcn's, so upstream blocks render as
    // intended; the rest extend it with the system's semantic colors.
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-muted text-muted-foreground",
        outline: "border-border bg-background text-foreground",
        destructive: "bg-danger-subtle text-danger-foreground dark:bg-danger",
        success: "bg-success-subtle text-success-foreground dark:bg-success",
        warning: "bg-warning-subtle text-warning-foreground dark:bg-warning",
        info: "bg-info-subtle text-info-foreground dark:bg-info",
        brand: "bg-brand-subtle text-brand",
      },
      size: {
        lg: "h-7 px-1.5 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
        default:
          "h-6 px-1.5 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-5 px-1 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-4 px-1 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3 [&_svg]:stroke-[2.25]",
      },
      shape: {
        rounded: "rounded-md",
        pill: "rounded-full",
      },
      stroke: {
        true: "border-current/20",
        false: "",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: "sm", className: "rounded-sm" },
      { shape: "rounded", size: "xs", className: "rounded-xs" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "rounded",
      stroke: false,
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  shape = "rounded",
  stroke = false,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(badgeVariants({ variant, size, shape, stroke, className }))}
      {...props}
    />
  )
}

/** A pill that pairs a leading badge with a label; compose the parts yourself. */
function BadgeGroup({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge-group"
      className={cn(
        "group/badge-group h-7 gap-1.5 pr-2.5 pl-1 text-sm leading-5 font-medium [&_svg]:size-4 inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-border bg-background whitespace-nowrap transition-all select-none [&_[data-slot=badge]]:rounded-full [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { Badge, BadgeGroup, badgeVariants }
