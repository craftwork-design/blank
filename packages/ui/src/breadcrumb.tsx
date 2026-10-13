import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

type BreadcrumbSize = "sm" | "md"
type BreadcrumbSeparatorVariant = "icon" | "slash"

function Breadcrumb({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<"nav"> & {
  size?: BreadcrumbSize
}) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      data-size={size}
      className={cn("group/breadcrumb", className)}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "gap-2 text-xs leading-4 font-medium flex flex-wrap items-center wrap-break-word text-muted-foreground",
        "group-data-[size=md]/breadcrumb:text-sm group-data-[size=md]/breadcrumb:leading-5",
        "[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "group-data-[size=md]/breadcrumb:[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        "gap-1 inline-flex items-center",
        "group-data-[size=md]/breadcrumb:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "gap-1 inline-flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground hover:no-underline",
        "group-data-[size=md]/breadcrumb:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "gap-1 inline-flex items-center text-foreground",
        "group-data-[size=md]/breadcrumb:gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  variant = "icon",
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  children?: React.ReactNode
  variant?: BreadcrumbSeparatorVariant
}) {
  return (
    <li
      data-slot="breadcrumb-separator"
      data-variant={variant}
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center text-muted-foreground",
        "data-[variant=slash]:w-3.5 data-[variant=slash]:text-[10px] data-[variant=slash]:leading-[14px]",
        "group-data-[size=md]/breadcrumb:data-[variant=slash]:w-4 group-data-[size=md]/breadcrumb:data-[variant=slash]:text-xs group-data-[size=md]/breadcrumb:data-[variant=slash]:leading-4",
        "[&>svg:not([class*='size-'])]:size-3.5",
        "group-data-[size=md]/breadcrumb:[&>svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {variant === "slash" ? "/" : (children ?? <ChevronRightIcon />)}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="breadcrumb-ellipsis"
      type="button"
      aria-label="More"
      className={cn(
        "inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground",
        "h-4 min-w-4 px-0.5 text-xs leading-4 font-medium",
        "group-data-[size=md]/breadcrumb:h-5 group-data-[size=md]/breadcrumb:min-w-5 group-data-[size=md]/breadcrumb:text-sm group-data-[size=md]/breadcrumb:leading-5",
        "focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      ...
    </button>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
