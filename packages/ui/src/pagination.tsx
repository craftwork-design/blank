import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Pagination({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"nav"> & { size?: "sm" | "default" }) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      data-size={size}
      className={cn("group/pagination flex w-full justify-center", className)}
      {...props}
    />
  )
}
function PaginationContent({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"ul"> & {
  variant?: "default" | "spread" | "buttons"
}) {
  return (
    <ul
      data-slot="pagination-content"
      data-variant={variant}
      className={cn(
        "gap-2 flex w-fit items-center",
        "data-[variant=spread]:w-full data-[variant=spread]:justify-between",
        "data-[variant=buttons]:gap-4 data-[variant=buttons]:w-full",
        className
      )}
      {...props}
    />
  )
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="pagination-item"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

// Parts follow the size set on <Pagination> through `group-data-[size=sm]`.
// A part's own `size` still works for a one-off mismatch.
const paginationSmClassName = [
  "group-data-[size=sm]/pagination:h-8 group-data-[size=sm]/pagination:rounded-lg",
  "group-data-[size=sm]/pagination:[&_svg:not([class*='size-'])]:size-4",
]

type PaginationLinkProps = {
  isActive?: boolean
  size?: "sm" | "default"
} & Omit<React.ComponentProps<"a">, "size">

function PaginationLink({
  className,
  isActive,
  size,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant="ghost"
      size={size === "sm" ? "icon-sm" : "icon"}
      data-active={isActive}
      className={cn(
        "shadow-none",
        "text-muted-foreground hover:text-foreground",
        "!no-underline hover:!no-underline focus:!no-underline",
        "data-[active=true]:bg-item-secondary data-[active=true]:text-foreground",
        paginationSmClassName,
        "group-data-[size=sm]/pagination:w-8",
        className
      )}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        {...props}
      />
    </Button>
  )
}

// Label text is children, not a prop: an icon-only arrow is `<PaginationPrevious />`
// with the label in `aria-label`, and a labelled one puts the text inside.
function PaginationArrow({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<"a"> & { size?: "sm" | "default" }) {
  // `toArray` drops the empty slot an unlabelled arrow passes along, so only a
  // real label switches the arrow from a square icon button to a text button.
  const labelled = React.Children.toArray(children).length > 1

  return (
    <Button
      asChild
      variant="ghost"
      size={labelled ? size : size === "sm" ? "icon-sm" : "icon"}
      data-labelled={labelled}
      className={cn(
        "no-underline shadow-none hover:no-underline",
        paginationSmClassName,
        "group-data-[size=sm]/pagination:data-[labelled=false]:w-8",
        "group-data-[size=sm]/pagination:data-[labelled=true]:gap-1 group-data-[size=sm]/pagination:data-[labelled=true]:px-2.5",
        className
      )}
    >
      <a data-slot="pagination-arrow" {...props}>
        {children}
      </a>
    </Button>
  )
}

function PaginationPrevious({
  children,
  ...props
}: React.ComponentProps<typeof PaginationArrow>) {
  return (
    <PaginationArrow
      aria-label={children ? undefined : "Go to previous page"}
      {...props}
    >
      <ChevronLeftIcon />
      {children}
    </PaginationArrow>
  )
}

function PaginationNext({
  children,
  ...props
}: React.ComponentProps<typeof PaginationArrow>) {
  return (
    <PaginationArrow
      aria-label={children ? undefined : "Go to next page"}
      {...props}
    >
      {children}
      <ChevronRightIcon />
    </PaginationArrow>
  )
}

function PaginationEllipsis({
  className,
  size,
  ...props
}: React.ComponentProps<"span"> & {
  size?: "sm" | "default"
}) {
  return (
    <span
      data-slot="pagination-ellipsis"
      data-size={size}
      className={cn(
        "font-medium size-10 text-base leading-6 flex items-center justify-center rounded-xl text-center text-muted-foreground",
        "group-data-[size=sm]/pagination:size-8 group-data-[size=sm]/pagination:text-sm group-data-[size=sm]/pagination:leading-5",
        "data-[size=sm]:size-8 data-[size=sm]:text-sm data-[size=sm]:leading-5",
        className
      )}
      {...props}
    >
      <span aria-hidden="true">...</span>
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationArrow,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
