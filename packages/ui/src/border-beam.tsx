// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/border-beam
"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type MotionStyle,
  type Transition,
} from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A short beam of light that travels around its parent's border. Put it as
 * the last child of a `relative overflow-hidden` element; it takes the
 * parent's radius. It pauses off screen, and with reduced motion it rests at
 * `initialOffset`.
 */
function BorderBeam({
  size = 50,
  duration = 6,
  delay = 0,
  colorFrom = "var(--brand)",
  colorTo = "transparent",
  transition,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
  className,
  style,
}: {
  /** Length of the beam, in px. */
  size?: number
  /** Seconds for one lap. */
  duration?: number
  /** Seconds to offset the lap by, to stagger several beams. */
  delay?: number
  /** Color at the head of the beam. */
  colorFrom?: string
  /** Color the beam fades through toward its tail. */
  colorTo?: string
  /** Overrides for the motion transition. */
  transition?: Transition
  /** Travel counter-clockwise. */
  reverse?: boolean
  /** Starting position along the border, 0–100. */
  initialOffset?: number
  /** Width of the beam, in px. */
  borderWidth?: number
  /** Classes for the beam itself. */
  className?: string
  /** Styles for the beam itself. */
  style?: React.CSSProperties
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const animate = inView && !reduceMotion

  return (
    <div
      ref={ref}
      data-slot="border-beam"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(black,black)] mask-intersect [mask-clip:padding-box,border-box]"
      style={
        { "--border-beam-width": `${borderWidth}px` } as React.CSSProperties
      }
    >
      <motion.div
        className={cn(
          "absolute aspect-square bg-linear-to-l from-(--border-beam-from) via-(--border-beam-to) to-transparent",
          className
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--border-beam-from": colorFrom,
            "--border-beam-to": colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: !animate
            ? `${initialOffset}%`
            : reverse
              ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
              : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={
          animate
            ? {
                repeat: Infinity,
                ease: "linear",
                duration,
                delay: -delay,
                ...transition,
              }
            : { duration: 0 }
        }
      />
    </div>
  )
}

export { BorderBeam }
