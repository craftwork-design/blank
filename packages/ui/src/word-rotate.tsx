// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/word-rotate
"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type MotionProps,
} from "motion/react"

import { cn } from "@/lib/utils"

const defaultMotion: MotionProps = {
  initial: { opacity: 0, y: "-60%", filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: "60%", filter: "blur(4px)" },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
}

/**
 * Cycles through `words` in place. The box is as wide as the longest word,
 * so the text around it never moves. Screen readers hear the list once.
 * It pauses off screen; with reduced motion it shows the first word only.
 */
function WordRotate({
  words,
  duration = 2500,
  motionProps = defaultMotion,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** The words to cycle through. */
  words: string[]
  /** Milliseconds each word stays on screen. */
  duration?: number
  /** Enter, exit and transition for a word. */
  motionProps?: MotionProps
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = React.useState(0)
  const rotate = inView && !reduceMotion && words.length > 1

  React.useEffect(() => {
    if (!rotate) return
    const interval = setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      duration
    )
    return () => clearInterval(interval)
  }, [rotate, words.length, duration])

  const word = words[reduceMotion ? 0 : index % words.length] ?? ""

  return (
    <span
      ref={ref}
      data-slot="word-rotate"
      className={cn(
        "relative -my-[0.15em] inline-grid overflow-hidden py-[0.15em] whitespace-nowrap",
        className
      )}
      {...props}
    >
      <span className="sr-only">{words.join(", ")}</span>
      {words.map((item) => (
        <span
          key={item}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1"
        >
          {item}
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          aria-hidden="true"
          data-slot="word-rotate-word"
          className="col-start-1 row-start-1"
          {...motionProps}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export { WordRotate }
