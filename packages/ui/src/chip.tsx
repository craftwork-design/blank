import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  [
    "group/chip inline-flex w-fit shrink-0 items-center justify-center overflow-hidden border bg-clip-padding",
    "font-medium whitespace-nowrap transition-all outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    // A chip rendered as a button or link is interactive; a plain span is not.
    "[a&]:cursor-pointer [button&]:cursor-pointer",
    // Selected: the brand marks selection, as it does on every other control.
    "data-[selected=true]:border-item-selected-border data-[selected=true]:bg-item-selected data-[selected=true]:text-brand",
    "aria-pressed:border-item-selected-border aria-pressed:bg-item-selected aria-pressed:text-brand",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // An avatar or a dismiss button sits closer to the edge than text does.
    "has-[>[data-slot=chip-avatar]:first-child]:pl-1 has-[>[data-slot=chip-dismiss]:last-child]:pr-1",
  ],
  {
    variants: {
      variant: {
        outline:
          "shadow-xs border-border bg-item-outline text-foreground [a&]:hover:bg-item-outline-hover [button&]:hover:bg-item-outline-hover",
        secondary:
          "border-transparent bg-item-secondary text-foreground [a&]:hover:bg-item-secondary-hover [button&]:hover:bg-item-secondary-hover",
      },
      size: {
        sm: "h-6 gap-1 px-2 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3.5",
        default:
          "h-8 gap-1.5 px-2.5 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 gap-2 px-3 text-sm leading-5 [&_svg:not([class*='size-'])]:size-4",
      },
      shape: {
        rounded: "",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: "sm", className: "rounded-md" },
      { shape: "rounded", size: "default", className: "rounded-lg" },
      { shape: "rounded", size: "lg", className: "rounded-xl" },
    ],
    defaultVariants: {
      variant: "outline",
      size: "default",
      shape: "rounded",
    },
  }
)

function Chip({
  className,
  variant = "outline",
  size = "default",
  shape = "rounded",
  selected,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof chipVariants> & {
    /** Marks the chip as chosen, e.g. an active filter. */
    selected?: boolean
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="chip"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-selected={selected}
      className={cn(chipVariants({ variant, size, shape, className }))}
      {...props}
    />
  )
}

function ChipAvatar({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chip-avatar"
      className={cn(
        "font-medium relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground",
        "group-data-[size=sm]/chip:size-4 group-data-[size=sm]/chip:text-[8px]",
        "group-data-[size=default]/chip:size-6 group-data-[size=default]/chip:text-[10px]",
        "group-data-[size=lg]/chip:size-7 group-data-[size=lg]/chip:text-xs",
        "[&>img]:size-full [&>img]:object-cover",
        className
      )}
      {...props}
    />
  )
}

function ChipDismiss({
  className,
  children,
  type = "button",
  "aria-label": ariaLabel = "Remove",
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="chip-dismiss"
      type={type}
      aria-label={ariaLabel}
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors outline-none",
        "hover:bg-item-secondary hover:text-foreground focus-visible:ring-3 focus-visible:ring-focus-ring",
        "group-aria-pressed/chip:text-brand group-data-[selected=true]/chip:text-brand",
        "group-data-[size=sm]/chip:size-4 group-data-[size=default]/chip:size-6 group-data-[size=lg]/chip:size-7",
        "group-data-[shape=rounded]/chip:rounded-sm",
        "[&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {children ?? <XIcon />}
    </button>
  )
}

export { Chip, ChipAvatar, ChipDismiss, chipVariants }
