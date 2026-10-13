// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/dot-pattern
"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface GlowDot {
  key: string
  cx: number
  cy: number
  delay: number
  duration: number
}

/**
 * A dot grid for section backgrounds, drawn as one SVG pattern so it stays
 * cheap at any size. Dots take `currentColor` (the border token by default);
 * `glow` pulses a scattered handful of them in the brand color.
 */
function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  glow = false,
  className,
  ...props
}: Omit<
  React.ComponentProps<"svg">,
  "width" | "height" | "x" | "y" | "cx" | "cy"
> & {
  /** Horizontal spacing between dots, in px. */
  width?: number
  /** Vertical spacing between dots, in px. */
  height?: number
  /** Horizontal offset of the whole pattern, in px. */
  x?: number
  /** Vertical offset of the whole pattern, in px. */
  y?: number
  /** Horizontal offset of a dot inside its cell, in px. */
  cx?: number
  /** Vertical offset of a dot inside its cell, in px. */
  cy?: number
  /** Dot radius, in px. */
  cr?: number
  /** Pulse a few scattered dots in the brand color. */
  glow?: boolean
}) {
  const id = React.useId()
  const ref = React.useRef<SVGSVGElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const element = ref.current
    if (!glow || !element) return
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
  }, [glow])

  // Positions are random, so they are only chosen on the client, after the
  // element has a size — never during render on the server.
  const dots = React.useMemo<GlowDot[]>(() => {
    if (!glow || !size.width || !size.height) return []
    const columns = Math.ceil(size.width / width)
    const rows = Math.ceil(size.height / height)
    const count = Math.min(48, Math.max(4, Math.round((columns * rows) / 40)))
    const taken = new Set<string>()
    const result: GlowDot[] = []
    for (let i = 0; i < count * 3 && result.length < count; i++) {
      const column = Math.floor(Math.random() * columns)
      const row = Math.floor(Math.random() * rows)
      const key = `${column}-${row}`
      if (taken.has(key)) continue
      taken.add(key)
      result.push({
        key,
        cx: column * width + cx + x,
        cy: row * height + cy + y,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })
    }
    return result
  }, [glow, size.width, size.height, width, height, cx, cy, x, y])

  return (
    <svg
      ref={ref}
      data-slot="dot-pattern"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full text-border",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={`${id}-dots`}
          width={width}
          height={height}
          x={x}
          y={y}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-dots)`} />
      {inView &&
        dots.map((dot) => (
          <motion.circle
            key={dot.key}
            cx={dot.cx}
            cy={dot.cy}
            r={cr * 1.5}
            className="fill-brand"
            initial={reduceMotion ? false : { opacity: 0, scale: 1 }}
            animate={
              reduceMotion
                ? { opacity: 0.6 }
                : { opacity: [0, 1, 0], scale: [1, 1.6, 1] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: dot.duration,
                    delay: dot.delay,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
    </svg>
  )
}

export { DotPattern }
