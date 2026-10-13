// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/grid-pattern
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A static SVG grid for section backgrounds. Lines take the border token and
 * `squares` tints individual cells with the brand color. Fade it out with a
 * mask on `className`, e.g. `mask-[radial-gradient(...)]`.
 */
function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "width" | "height" | "x" | "y"> & {
  /** Cell width in px. */
  width?: number
  /** Cell height in px. */
  height?: number
  /** Horizontal offset of the grid, in px. */
  x?: number
  /** Vertical offset of the grid, in px. */
  y?: number
  strokeDasharray?: string
  /** Cells to fill, as `[column, row]` pairs. */
  squares?: Array<[x: number, y: number]>
}) {
  const id = React.useId()

  return (
    <svg
      data-slot="grid-pattern"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full fill-brand/10 stroke-border",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([column, row]) => (
            <rect
              key={`${column}-${row}`}
              strokeWidth={0}
              width={width - 1}
              height={height - 1}
              x={column * width + 1}
              y={row * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}

export { GridPattern }
