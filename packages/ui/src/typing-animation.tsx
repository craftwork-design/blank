// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/typing-animation
"use client"

import * as React from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type Phase = "typing" | "pause" | "deleting"
type CursorStyle = "line" | "block" | "underscore"

const cursors: Record<CursorStyle, string> = {
  line: "|",
  block: "▌",
  underscore: "_",
}

/**
 * Types a string out one character at a time, or cycles through `words`,
 * typing and deleting each. The finished text reserves its space from the
 * first paint, so nothing below it moves while it types. Screen readers get
 * the full text. With reduced motion the text is shown complete.
 */
function TypingAnimation({
  children,
  words,
  as = "span",
  duration = 100,
  typeSpeed,
  deleteSpeed,
  delay = 0,
  pauseDelay = 1000,
  loop = false,
  startOnView = true,
  showCursor = true,
  blinkCursor = true,
  cursorStyle = "line",
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** The text to type. */
  children?: string
  /** Several strings to type and delete in turn; wins over `children`. */
  words?: string[]
  /** The element to render. */
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "code"
  /** Milliseconds per character; shorthand for `typeSpeed`. */
  duration?: number
  /** Milliseconds per typed character. */
  typeSpeed?: number
  /** Milliseconds per deleted character; half of `typeSpeed` by default. */
  deleteSpeed?: number
  /** Milliseconds before typing starts. */
  delay?: number
  /** Milliseconds a finished word stays before it is deleted. */
  pauseDelay?: number
  /** Start over after the last word. */
  loop?: boolean
  /** Wait until the element scrolls into view. */
  startOnView?: boolean
  showCursor?: boolean
  blinkCursor?: boolean
  cursorStyle?: CursorStyle
}) {
  const Component = as as React.ElementType
  const ref = React.useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.3, once: true })
  const reduceMotion = useReducedMotion()

  const list = React.useMemo(
    () => words ?? (children ? [children] : []),
    [words, children]
  )
  const source = list.join("\u0000")
  const multiple = list.length > 1
  const typing = typeSpeed ?? duration
  const deleting = deleteSpeed ?? typing / 2

  const [wordIndex, setWordIndex] = React.useState(0)
  const [charIndex, setCharIndex] = React.useState(0)
  const [phase, setPhase] = React.useState<Phase>("typing")
  const [started, setStarted] = React.useState(false)

  React.useEffect(() => {
    setWordIndex(0)
    setCharIndex(0)
    setPhase("typing")
    setStarted(false)
  }, [source])

  // Applied after mount: the server cannot know the preference, and the
  // first client render has to match its markup.
  const [still, setStill] = React.useState(false)
  React.useEffect(() => setStill(Boolean(reduceMotion)), [reduceMotion])

  const ready = !still && (startOnView ? inView : true)

  React.useEffect(() => {
    if (!ready || list.length === 0) return
    const graphemes = Array.from(list[wordIndex] ?? "")
    const wait = !started
      ? delay
      : phase === "typing"
        ? typing
        : phase === "deleting"
          ? deleting
          : pauseDelay

    const timeout = setTimeout(() => {
      setStarted(true)
      if (phase === "typing") {
        if (charIndex < graphemes.length) {
          setCharIndex(charIndex + 1)
        } else if (loop || (multiple && wordIndex < list.length - 1)) {
          setPhase("pause")
        }
      } else if (phase === "pause") {
        setPhase("deleting")
      } else if (charIndex > 0) {
        setCharIndex(charIndex - 1)
      } else {
        setWordIndex((wordIndex + 1) % list.length)
        setPhase("typing")
      }
    }, wait)

    return () => clearTimeout(timeout)
  }, [
    ready,
    started,
    phase,
    charIndex,
    wordIndex,
    list,
    multiple,
    loop,
    typing,
    deleting,
    pauseDelay,
    delay,
  ])

  const word = list[wordIndex] ?? ""
  const graphemes = Array.from(word)
  const shown = still ? word : graphemes.slice(0, charIndex).join("")
  const complete =
    still ||
    (!loop &&
      wordIndex === list.length - 1 &&
      charIndex >= graphemes.length &&
      phase !== "deleting")
  const longest = list.reduce((a, b) => (b.length > a.length ? b : a), "")
  // The cursor holds steady while characters are landing and blinks at rest.
  const blink = blinkCursor && (!started || phase === "pause")

  return (
    <Component
      ref={ref}
      data-slot="typing-animation"
      className={cn("inline-grid", className)}
      {...props}
    >
      <span className="sr-only">{list.join(", ")}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {longest}
        {showCursor && cursors[cursorStyle]}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {shown}
        {showCursor && !complete && (
          <motion.span
            data-slot="typing-animation-cursor"
            className="inline-block"
            animate={blink ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
            transition={
              blink
                ? {
                    duration: 1,
                    times: [0, 0.5, 0.5, 1],
                    repeat: Infinity,
                    ease: "linear",
                  }
                : { duration: 0 }
            }
          >
            {cursors[cursorStyle]}
          </motion.span>
        )}
      </span>
    </Component>
  )
}

export { TypingAnimation }
