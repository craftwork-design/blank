// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/animated-beam
"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Draws a curved path between two elements inside a container and sends a
 * beam of light along it. The path is measured from the elements' boxes and
 * re-measured when the container resizes. The beam pauses while the
 * container is off screen; with reduced motion the path is drawn in the beam
 * color instead.
 */
function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5,
  delay = 0,
  repeat = Infinity,
  repeatDelay = 0,
  pathColor = "var(--border)",
  pathWidth = 2,
  pathOpacity = 1,
  gradientStartColor = "var(--brand)",
  gradientStopColor = "var(--brand)",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  className,
}: {
  /** The positioned element both nodes live in; the beam is drawn over it. */
  containerRef: React.RefObject<HTMLElement | null>
  fromRef: React.RefObject<HTMLElement | null>
  toRef: React.RefObject<HTMLElement | null>
  /** How far the path bows; positive bows up, negative bows down. */
  curvature?: number
  /** Send the beam from `toRef` to `fromRef`. */
  reverse?: boolean
  /** Seconds for one pass. */
  duration?: number
  /** Seconds before the first pass. */
  delay?: number
  repeat?: number
  /** Seconds between passes. */
  repeatDelay?: number
  /** Color of the resting path. */
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  /** Color at the head of the beam. */
  gradientStartColor?: string
  /** Color the beam fades through toward its tail. */
  gradientStopColor?: string
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
  className?: string
}) {
  const id = React.useId()
  const inView = useInView(containerRef)
  const reduceMotion = useReducedMotion()
  const [path, setPath] = React.useState("")
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    const update = () => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!container || !from || !to) return

      const box = container.getBoundingClientRect()
      const a = from.getBoundingClientRect()
      const b = to.getBoundingClientRect()

      setSize({ width: box.width, height: box.height })

      const startX = a.left - box.left + a.width / 2 + startXOffset
      const startY = a.top - box.top + a.height / 2 + startYOffset
      const endX = b.left - box.left + b.width / 2 + endXOffset
      const endY = b.top - box.top + b.height / 2 + endYOffset
      const controlY = startY - curvature

      setPath(
        `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
      )
    }

    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    update()
    return () => observer.disconnect()
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  // Applied after mount: the server cannot know the preference, and the
  // first client render has to match its markup.
  const [still, setStill] = React.useState(false)
  React.useEffect(() => setStill(Boolean(reduceMotion)), [reduceMotion])

  const animate = inView && !still
  const travel = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"] }

  return (
    <svg
      data-slot="animated-beam"
      aria-hidden="true"
      fill="none"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu",
        className
      )}
    >
      <path
        d={path}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
        style={{ stroke: pathColor }}
      />
      <path
        d={path}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        stroke={`url(#${id})`}
      />
      {still && (
        <path
          d={path}
          strokeWidth={pathWidth}
          strokeOpacity={0.5}
          strokeLinecap="round"
          style={{ stroke: gradientStartColor }}
        />
      )}
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={animate ? travel : { x1: "0%", x2: "0%" }}
          transition={
            animate
              ? {
                  delay,
                  duration,
                  ease: [0.16, 1, 0.3, 1],
                  repeat,
                  repeatDelay,
                }
              : { duration: 0 }
          }
        >
          <stop style={{ stopColor: gradientStartColor, stopOpacity: 0 }} />
          <stop style={{ stopColor: gradientStartColor }} />
          <stop offset="32.5%" style={{ stopColor: gradientStopColor }} />
          <stop
            offset="100%"
            style={{ stopColor: gradientStopColor, stopOpacity: 0 }}
          />
        </motion.linearGradient>
      </defs>
    </svg>
  )
}

export { AnimatedBeam }
