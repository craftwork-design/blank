// Based on Kibo UI announcement (https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/announcement/index.tsx)
// Copyright (c) 2023 — Present shadcnblocks. Licensed under MIT. Modified for Blank.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const announcementVariants = cva(
  [
    "group/announcement h-8 max-w-full min-w-0 gap-2 pr-2.5 pl-3 text-sm leading-5 font-medium inline-flex w-fit items-center rounded-full border shadow-xs transition-colors outline-none",
    "has-[>[data-slot=announcement-tag]]:pl-1",
    "focus-visible:ring-3 focus-visible:ring-focus-ring",
    "[a&]:cursor-pointer [button&]:cursor-pointer",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground [a&]:hover:bg-item-outline-hover [button&]:hover:bg-item-outline-hover",
        brand:
          "border-item-selected-border bg-item-selected text-brand [a&]:hover:bg-brand-subtle [button&]:hover:bg-brand-subtle",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Announcement({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof announcementVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="announcement"
      data-variant={variant}
      className={cn(announcementVariants({ variant, className }))}
      {...props}
    />
  )
}

function AnnouncementTag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="announcement-tag"
      className={cn(
        "h-6 px-2 text-xs leading-4 inline-flex shrink-0 items-center rounded-full",
        "group-data-[variant=default]/announcement:bg-item-secondary group-data-[variant=default]/announcement:text-foreground",
        "group-data-[variant=brand]/announcement:bg-brand group-data-[variant=brand]/announcement:text-brand-foreground",
        className
      )}
      {...props}
    />
  )
}

function AnnouncementTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="announcement-title"
      className={cn(
        // One line, always: a title that does not fit is clipped, and text
        // wrapped in a span gets an ellipsis.
        "min-w-0 gap-1 pr-0.5 inline-flex items-center overflow-hidden whitespace-nowrap [&>span]:min-w-0 [&>span]:truncate",
        // A trailing arrow nudges forward when the pill is a link.
        "[&>svg:last-child]:text-muted-foreground [&>svg:last-child]:transition-transform group-data-[variant=brand]/announcement:[&>svg:last-child]:text-current",
        "group-hover/announcement:[&>svg:last-child]:translate-x-0.5 motion-reduce:[&>svg:last-child]:transition-none motion-reduce:group-hover/announcement:[&>svg:last-child]:translate-x-0",
        className
      )}
      {...props}
    />
  )
}

export { Announcement, AnnouncementTag, AnnouncementTitle, announcementVariants }
