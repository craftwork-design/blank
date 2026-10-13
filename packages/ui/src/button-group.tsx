import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonGroupVariants = cva(
  [
    "group/button-group inline-flex w-fit items-stretch",
    "*:focus-visible:relative *:focus-visible:z-10",
    "[&>[data-slot=button]]:shadow-none",
    "[&>[data-slot=button-group-text]]:shadow-none",
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          "flex-row",
          "[&>[data-slot=button]:not(:first-child)]:border-l-0",
          "[&>[data-slot=button]:not(:first-child)]:rounded-l-none",
          "[&>[data-slot=button]:not(:last-child)]:rounded-r-none",
          "[&>[data-slot=button-group-text]:not(:first-child)]:border-l-0",
          "[&>[data-slot=button-group-text]:not(:first-child)]:rounded-l-none",
          "[&>[data-slot=button-group-text]:not(:last-child)]:rounded-r-none",
        ].join(" "),
        vertical: [
          "flex-col",
          "[&>[data-slot=button]:not(:first-child)]:border-t-0",
          "[&>[data-slot=button]:not(:first-child)]:rounded-t-none",
          "[&>[data-slot=button]:not(:last-child)]:rounded-b-none",
          "[&>[data-slot=button-group-text]:not(:first-child)]:border-t-0",
          "[&>[data-slot=button-group-text]:not(:first-child)]:rounded-t-none",
          "[&>[data-slot=button-group-text]:not(:last-child)]:rounded-b-none",
        ].join(" "),
      },
      shape: {
        rounded: "",
        pill: "",
      },
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        shape: "rounded",
        className:
          "[&>[data-slot=button-group-text]:first-child]:rounded-l-xl [&>[data-slot=button-group-text]:last-child]:rounded-r-xl [&>[data-slot=button]:first-child]:rounded-l-xl [&>[data-slot=button]:last-child]:rounded-r-xl",
      },
      {
        orientation: "horizontal",
        shape: "pill",
        className:
          "[&>[data-slot=button-group-text]:first-child]:rounded-l-full [&>[data-slot=button-group-text]:last-child]:rounded-r-full [&>[data-slot=button]:first-child]:rounded-l-full [&>[data-slot=button]:last-child]:rounded-r-full",
      },
      {
        orientation: "vertical",
        shape: "rounded",
        className:
          "[&>[data-slot=button-group-text]:first-child]:rounded-t-xl [&>[data-slot=button-group-text]:last-child]:rounded-b-xl [&>[data-slot=button]:first-child]:rounded-t-xl [&>[data-slot=button]:last-child]:rounded-b-xl",
      },
      {
        orientation: "vertical",
        shape: "pill",
        className:
          "[&>[data-slot=button-group-text]:first-child]:rounded-t-full [&>[data-slot=button-group-text]:last-child]:rounded-b-full [&>[data-slot=button]:first-child]:rounded-t-full [&>[data-slot=button]:last-child]:rounded-b-full",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      shape: "rounded",
    },
  }
)

function ButtonGroup({
  className,
  orientation = "horizontal",
  shape = "rounded",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      data-shape={shape}
      className={cn(buttonGroupVariants({ orientation, shape }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        "gap-1 px-3 text-sm leading-5 font-medium inline-flex items-center justify-center border border-border bg-background text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical"
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="button-group-separator"
      data-orientation={orientation}
      className={cn(
        "relative shrink-0 self-stretch bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
