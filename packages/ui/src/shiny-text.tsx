// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/animated-shiny-text
"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Muted text with a highlight that sweeps across it — for announcement pills
 * and "working…" labels. The highlight is the foreground color clipped to the
 * glyphs, so it follows the theme. It pauses off screen; with reduced motion
 * the text stays muted.
 */
function ShinyText({
  duration = 2.5,
  repeatDelay = 1,
  spread = 2,
  className,
  style,
  children,
  ...props
}: Omit<HTMLMotionProps<"span">, "children"> & {
  children?: React.ReactNode
  /** Seconds for one sweep. */
  duration?: number
  /** Seconds between sweeps. */
  repeatDelay?: number
  /** Half-width of the highlight, in px per character of text. */
  spread?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const animate = inView && !reduceMotion
  const length = typeof children === "string" ? children.length : 12
  const highlight = `${Math.min(length * spread, 240)}px`

  return (
    <motion.span
      ref={ref}
      data-slot="shiny-text"
      className={cn(
        "inline-block bg-size-[250%_100%,auto] bg-clip-text bg-no-repeat text-transparent",
        className
      )}
      style={
        {
          "--shiny-spread": highlight,
          backgroundImage:
            "linear-gradient(90deg, transparent calc(50% - var(--shiny-spread)), var(--foreground), transparent calc(50% + var(--shiny-spread))), linear-gradient(var(--muted-foreground), var(--muted-foreground))",
          ...style,
        } as React.CSSProperties
      }
      initial={{ backgroundPosition: "100% center" }}
      animate={{
        backgroundPosition: animate ? "0% center" : "100% center",
      }}
      transition={
        animate
          ? { duration, repeat: Infinity, repeatDelay, ease: "linear" }
          : { duration: 0 }
      }
      {...props}
    >
      {children}
    </motion.span>
  )
}

export { ShinyText }
