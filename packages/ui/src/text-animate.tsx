// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/text-animate
"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  type MotionProps,
  type Variants,
} from "motion/react"

import { cn } from "@/lib/utils"

type AnimationType = "text" | "word" | "character" | "line"
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown"

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = keyof typeof motionElements

const spring = { type: "spring" as const, damping: 15, stiffness: 300 }

/** Each preset is a `hidden → show → exit` triple for a single segment. */
const presets: Record<AnimationVariant, Variants> = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.3 } },
    exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3 } },
  },
  blurInUp: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        y: { duration: 0.3 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
      transition: {
        y: { duration: 0.3 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    },
  },
  blurInDown: {
    hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        y: { duration: 0.3 },
        opacity: { duration: 0.4 },
        filter: { duration: 0.3 },
      },
    },
    exit: { opacity: 0, filter: "blur(10px)", y: -20 },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
  },
  slideRight: {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.3 } },
  },
  scaleUp: {
    hidden: { scale: 0.5, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, scale: spring },
    },
    exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
  },
  scaleDown: {
    hidden: { scale: 1.5, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, scale: spring },
    },
    exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
  },
}

/**
 * Reduced motion keeps the same `hidden` state, so server and client markup
 * match, and jumps to `show` without a transition.
 */
function instant(variants: Variants): Variants {
  const show = variants.show
  return typeof show === "object"
    ? { ...variants, show: { ...show, transition: { duration: 0 } } }
    : variants
}

function split(text: string, by: AnimationType) {
  switch (by) {
    case "word":
      return text.split(/(\s+)/)
    case "character":
      return Array.from(text)
    case "line":
      return text.split("\n")
    default:
      return [text]
  }
}

/**
 * Reveals a string by text, word, character or line, with one of ten
 * presets. Screen readers get the whole string once; the animated segments
 * are hidden from them. By default it plays when scrolled into view; with
 * reduced motion the text is simply there.
 */
function TextAnimate({
  children,
  as = "p",
  by = "word",
  animation = "fadeIn",
  variants,
  delay = 0,
  duration = 0.3,
  startOnView = true,
  once = false,
  accessible = true,
  className,
  segmentClassName,
  ...props
}: Omit<MotionProps, "children"> & {
  /** The text to animate. */
  children: string
  /** The element to render. */
  as?: MotionElementType
  /** How to split the text into segments. */
  by?: AnimationType
  /** The preset to use. */
  animation?: AnimationVariant
  /** Custom `hidden`/`show`/`exit` variants for a segment; wins over `animation`. */
  variants?: Variants
  /** Seconds before the first segment starts. */
  delay?: number
  /** Seconds the stagger spreads across all segments. */
  duration?: number
  /** Wait until the element scrolls into view. */
  startOnView?: boolean
  /** Animate only the first time it comes into view. */
  once?: boolean
  /** Give screen readers the full string and hide the segments from them. */
  accessible?: boolean
  className?: string
  /** Classes for every segment. */
  segmentClassName?: string
}) {
  const reduceMotion = useReducedMotion()
  const Component = motionElements[as]
  const segments = split(children, by)
  const stagger = reduceMotion ? 0 : duration / segments.length

  const container: Variants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: reduceMotion ? 0 : delay,
        staggerChildren: stagger,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: stagger, staggerDirection: -1 },
    },
  }
  const preset = variants ?? presets[animation]
  const item = reduceMotion ? instant(preset) : preset
  const play = reduceMotion || !startOnView

  return (
    <Component
      data-slot="text-animate"
      data-by={by}
      initial="hidden"
      animate={play ? "show" : undefined}
      whileInView={play ? undefined : "show"}
      viewport={{ once }}
      exit="exit"
      variants={container}
      className={cn("whitespace-pre-wrap", className)}
      {...props}
    >
      {accessible && <span className="sr-only">{children}</span>}
      {segments.map((segment, i) => (
        <motion.span
          key={`${by}-${i}-${segment}`}
          data-slot="text-animate-segment"
          variants={item}
          aria-hidden={accessible || undefined}
          className={cn(
            "inline-block whitespace-pre in-data-[by=line]:block in-data-[by=line]:whitespace-pre-wrap",
            segmentClassName
          )}
        >
          {segment}
        </motion.span>
      ))}
    </Component>
  )
}

export { TextAnimate }
