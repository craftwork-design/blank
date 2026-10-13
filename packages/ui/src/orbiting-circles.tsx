// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/orbiting-circles
"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Spaces its children evenly on a circle and turns the circle, keeping each
 * child upright. Fill a `relative` parent; stack several with different radii
 * for multiple rings. It pauses off screen and holds still with reduced
 * motion.
 */
function OrbitingCircles({
  radius = 160,
  duration = 20,
  speed = 1,
  reverse = false,
  path = true,
  iconSize = 30,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Radius of the orbit, in px. */
  radius?: number
  /** Seconds for one revolution at `speed` 1. */
  duration?: number
  /** Multiplier on the revolution speed. */
  speed?: number
  /** Turn counter-clockwise. */
  reverse?: boolean
  /** Draw the orbit as a hairline circle. */
  path?: boolean
  /** Size of the box each child is centered in, in px. */
  iconSize?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const animate = inView && !reduceMotion
  const items = React.Children.toArray(children)
  const turn = reverse ? -360 : 360
  const transition = animate
    ? { duration: duration / speed, ease: "linear" as const, repeat: Infinity }
    : { duration: 0 }

  return (
    <div
      ref={ref}
      data-slot="orbiting-circles"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      {...props}
    >
      {path && (
        <svg aria-hidden="true" className="absolute inset-0 size-full">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            className="stroke-border"
          />
        </svg>
      )}
      <motion.div
        data-slot="orbiting-circles-ring"
        className="absolute top-1/2 left-1/2 size-0"
        initial={{ transform: "rotate(0deg)" }}
        animate={{ transform: animate ? `rotate(${turn}deg)` : "rotate(0deg)" }}
        transition={transition}
      >
        {items.map((child, index) => {
          const angle = (360 / items.length) * index
          return (
            <div
              key={index}
              className="absolute top-0 left-0"
              style={{
                transform: `rotate(${angle}deg) translateY(${-radius}px) rotate(${-angle}deg)`,
              }}
            >
              <motion.div
                data-slot="orbiting-circles-item"
                className={cn(
                  "pointer-events-auto flex -translate-1/2 items-center justify-center rounded-full",
                  className
                )}
                style={{ width: iconSize, height: iconSize }}
                initial={{ transform: "rotate(0deg)" }}
                animate={{
                  transform: animate ? `rotate(${-turn}deg)` : "rotate(0deg)",
                }}
                transition={transition}
              >
                {child}
              </motion.div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

export { OrbitingCircles }
