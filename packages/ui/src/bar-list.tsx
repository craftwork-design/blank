// Based on Tremor Raw BarList v1.0.0
// (https://github.com/tremorlabs/tremor/blob/ca4d588f47820ff3d514d37fa4ee08a4222dec11/src/components/BarList/BarList.tsx)
// Copyright (c) 2025 Tremor. Licensed under the Apache License, Version 2.0
// (http://www.apache.org/licenses/LICENSE-2.0); distributed on an "AS IS"
// BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
// Modified for Blank: Tailwind palette colors replaced by semantic tokens,
// rows rebuilt as a list with the value beside each bar, links rendered in the
// same tab instead of `_blank` and never nested in a button, forwardRef removed.
import * as React from "react"

import { cn } from "@/lib/utils"

type BarListItem<T = unknown> = T & {
  key?: string
  name: string
  value: number
  href?: string
  icon?: React.ReactNode
}

type BarListProps<T = unknown> = Omit<
  React.ComponentProps<"ul">,
  "children" | "onChange"
> & {
  data: BarListItem<T>[]
  valueFormatter?: (value: number) => string
  sortOrder?: "ascending" | "descending" | "none"
  /** Makes each row a button and reports the clicked row. Rows with an
   *  `href` render as links either way. */
  onValueChange?: (item: BarListItem<T>) => void
  /** Grow the bars in from zero on mount. */
  showAnimation?: boolean
}

function BarList<T = unknown>({
  data,
  valueFormatter = (value) => value.toLocaleString(),
  sortOrder = "descending",
  onValueChange,
  showAnimation = false,
  className,
  ...props
}: BarListProps<T>) {
  const rows =
    sortOrder === "none"
      ? data
      : [...data].sort((a, b) =>
          sortOrder === "ascending" ? a.value - b.value : b.value - a.value
        )

  const max = Math.max(0, ...rows.map((row) => row.value))

  return (
    <ul
      data-slot="bar-list"
      data-animate={showAnimation || undefined}
      className={cn("group/bar-list gap-1.5 flex w-full flex-col", className)}
      {...props}
    >
      {rows.map((row) => {
        // A non-zero value always shows a sliver, as in the original.
        const width =
          row.value <= 0 || max === 0
            ? 0
            : Math.max((row.value / max) * 100, 2)

        const content = (
          <>
            <span
              data-slot="bar-list-bar"
              className="h-8 relative flex min-w-0 flex-1 items-center"
            >
              <span
                aria-hidden="true"
                className="inset-y-0 start-0 absolute w-(--bar-list-width) rounded-md bg-brand/15 transition-[width,background-color] duration-700 ease-out group-data-animate/bar-list:starting:w-0 group-hover/bar-list-row:group-data-interactive/bar-list-row:bg-brand/25 motion-reduce:transition-none"
                style={{ "--bar-list-width": `${width}%` } as React.CSSProperties}
              />
              <span className="gap-2 px-2 text-sm relative flex min-w-0 items-center text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">
                {row.icon}
                <span className="truncate">{row.name}</span>
              </span>
            </span>
            <span
              data-slot="bar-list-value"
              className="text-sm shrink-0 text-right whitespace-nowrap text-foreground tabular-nums"
            >
              {valueFormatter(row.value)}
            </span>
          </>
        )

        // One interactive element per row: a link when the row has an href,
        // a button when the list reports clicks, plain text otherwise.
        const rowClasses =
          "gap-6 -mx-1 px-1 flex w-[calc(100%+0.5rem)] items-center rounded-lg text-left outline-none hover:bg-item-secondary focus-visible:ring-3 focus-visible:ring-focus-ring"

        return (
          <li
            key={row.key ?? row.name}
            data-slot="bar-list-item"
            data-interactive={Boolean(row.href || onValueChange) || undefined}
            className="group/bar-list-row"
          >
            {row.href ? (
              <a
                href={row.href}
                className={rowClasses}
                onClick={() => onValueChange?.(row)}
              >
                {content}
              </a>
            ) : onValueChange ? (
              <button
                type="button"
                className={rowClasses}
                onClick={() => onValueChange(row)}
              >
                {content}
              </button>
            ) : (
              <div className="gap-6 flex items-center">{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export { BarList }
export type { BarListItem, BarListProps }
