// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/animated-grid-pattern
"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface Square {
  id: number
  pos: [number, number]
  iteration: number
}

/**
 * The grid of `GridPattern`, with cells that fade in and out at random. Lines
 * take the border token and cells take `currentColor` (the brand color by
 * default). It only animates while on screen; with reduced motion the cells
 * hold still.
 */
function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 30,
  maxOpacity = 0.15,
  duration = 4,
  repeatDelay = 0.5,
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
  strokeDasharray?: number | string
  /** How many cells are lit at any time. */
  numSquares?: number
  /** Peak opacity of a lit cell, 0–1. */
  maxOpacity?: number
  /** Seconds a cell takes to fade in (and again to fade out). */
  duration?: number
  /** Seconds a cell stays lit before fading out. */
  repeatDelay?: number
}) {
  const id = React.useId()
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const [squares, setSquares] = React.useState<Square[]>([])

  const randomPosition = React.useCallback(
    (): [number, number] => [
      Math.floor((Math.random() * size.width) / width),
      Math.floor((Math.random() * size.height) / height),
    ],
    [size.width, size.height, width, height]
  )

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height }
      )
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!size.width || !size.height) return
    setSquares(
      Array.from({ length: numSquares }, (_, i) => ({
        id: i,
        pos: randomPosition(),
        iteration: 0,
      }))
    )
  }, [size.width, size.height, numSquares, randomPosition])

  const move = (squareId: number) =>
    setSquares((current) =>
      current.map((square) =>
        square.id === squareId
          ? { ...square, pos: randomPosition(), iteration: square.iteration + 1 }
          : square
      )
    )

  return (
    <svg
      ref={ref}
      data-slot="animated-grid-pattern"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full stroke-border text-brand",
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
      <svg x={x} y={y} className="overflow-visible">
        {(inView || reduceMotion) &&
          squares.map(({ pos: [column, row], id: squareId, iteration }, i) => (
            <motion.rect
              key={`${squareId}-${iteration}`}
              width={width - 1}
              height={height - 1}
              x={column * width + 1}
              y={row * height + 1}
              fill="currentColor"
              strokeWidth={0}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: reduceMotion ? maxOpacity / 2 : maxOpacity }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration,
                      repeat: 1,
                      repeatType: "reverse",
                      repeatDelay,
                      delay: iteration === 0 ? i * 0.1 : 0,
                    }
              }
              onAnimationComplete={
                reduceMotion ? undefined : () => move(squareId)
              }
            />
          ))}
      </svg>
    </svg>
  )
}

export { AnimatedGridPattern }
