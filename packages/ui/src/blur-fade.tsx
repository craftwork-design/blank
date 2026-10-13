// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/blur-fade
"use client"

import * as React from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
  type UseInViewOptions,
  type Variants,
} from "motion/react"

type Direction = "up" | "down" | "left" | "right"

/**
 * Fades its children in from a blur and a small offset. By default it plays
 * on mount; with `inView` it waits until the element scrolls into view, once.
 * Stagger siblings with `delay`. With reduced motion the content is simply
 * there.
 */
function BlurFade({
  duration = 0.4,
  delay = 0,
  offset = 6,
  direction = "down",
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
  variant,
  children,
  ...props
}: HTMLMotionProps<"div"> & {
  /** Seconds the fade takes. */
  duration?: number
  /** Seconds before it starts. */
  delay?: number
  /** Distance travelled, in px. */
  offset?: number
  /** The direction the content travels in. */
  direction?: Direction
  /** Wait until the element scrolls into view. */
  inView?: boolean
  /** Margin around the viewport used by `inView`. */
  inViewMargin?: UseInViewOptions["margin"]
  /** Starting blur, as a CSS length. */
  blur?: string
  /** Replace the default `hidden` and `visible` variants. */
  variant?: Variants
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: inViewMargin })
  const reduceMotion = useReducedMotion()
  const visible = !inView || seen

  const axis = direction === "left" || direction === "right" ? "x" : "y"
  const from = direction === "right" || direction === "down" ? -offset : offset

  const variants: Variants = variant ?? {
    hidden: { [axis]: from, opacity: 0, filter: `blur(${blur})` },
    visible: { [axis]: 0, opacity: 1, filter: "blur(0px)" },
  }

  return (
    <motion.div
      ref={ref}
      data-slot="blur-fade"
      initial="hidden"
      animate={reduceMotion || visible ? "visible" : "hidden"}
      exit="hidden"
      variants={variants}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: 0.04 + delay, duration, ease: "easeOut" }
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}

export { BlurFade }
