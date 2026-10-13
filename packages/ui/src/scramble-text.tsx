// Adapted from Smooth UI's Scramble Hover (MIT, © 2024 Eduardo Calvo) — https://smoothui.dev/docs/components/scramble-hover
// and Magic UI's Hyper Text (MIT, © Magic UI) — https://magicui.design/docs/components/hyper-text
"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type ScrambleTrigger = "hover" | "view" | "mount"

const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&*+-=<>?/"

/**
 * Scrambles its text into random characters and resolves it left to right.
 * Each character keeps the width of the original glyph, so nothing around
 * it shifts while it plays. Screen readers only ever get the real text. With
 * reduced motion it never scrambles.
 */
function ScrambleText({
  children,
  trigger = "hover",
  duration = 600,
  speed = 40,
  characters = DEFAULT_CHARACTERS,
  className,
  onMouseEnter,
  onFocus,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** The text to scramble. */
  children: string
  /** Play on hover and focus, once on scrolling into view, or once on mount. */
  trigger?: ScrambleTrigger
  /** Milliseconds from first scramble to fully resolved. */
  duration?: number
  /** Milliseconds between scrambles of the unresolved characters. */
  speed?: number
  /** Characters to scramble through. */
  characters?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const original = React.useMemo(() => Array.from(children), [children])
  // Words stay unbreakable boxes, so wrapping happens only at whitespace.
  const words = React.useMemo(() => {
    let start = 0
    return children.split(/(\s+)/).map((text) => {
      const word = { start, text }
      start += Array.from(text).length
      return word
    })
  }, [children])
  const [display, setDisplay] = React.useState(original)
  const frame = React.useRef<number | null>(null)

  const stop = React.useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
  }, [])

  const play = React.useCallback(() => {
    if (reduceMotion || frame.current !== null) return
    const pool = Array.from(characters)
    const start = performance.now()
    let last = 0

    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      if (progress >= 1) {
        setDisplay(original)
        frame.current = null
        return
      }
      if (now - last >= speed) {
        last = now
        const resolved = Math.floor(progress * original.length)
        setDisplay(
          original.map((char, i) =>
            i < resolved || /\s/.test(char)
              ? char
              : pool[Math.floor(Math.random() * pool.length)]
          )
        )
      }
      frame.current = requestAnimationFrame(step)
    }

    frame.current = requestAnimationFrame(step)
  }, [reduceMotion, characters, duration, speed, original])

  React.useEffect(() => {
    setDisplay(original)
  }, [original])

  React.useEffect(() => {
    if (trigger === "mount") play()
  }, [trigger, play])

  React.useEffect(() => {
    if (trigger === "view" && inView) play()
  }, [trigger, inView, play])

  React.useEffect(() => stop, [stop])

  return (
    <span
      ref={ref}
      data-slot="scramble-text"
      data-trigger={trigger}
      className={cn("inline-block whitespace-pre-wrap", className)}
      onMouseEnter={(event) => {
        if (trigger === "hover") play()
        onMouseEnter?.(event)
      }}
      onFocus={(event) => {
        if (trigger === "hover") play()
        onFocus?.(event)
      }}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map(({ start, text }) =>
          /^\s+$/.test(text) ? (
            text
          ) : (
            <span key={start} className="inline-block whitespace-nowrap">
              {Array.from(text, (char, offset) => (
                <span key={offset} className="inline-grid justify-items-center">
                  <span className="invisible col-start-1 row-start-1">
                    {char}
                  </span>
                  <span className="col-start-1 row-start-1">
                    {display[start + offset] ?? char}
                  </span>
                </span>
              ))}
            </span>
          )
        )}
      </span>
    </span>
  )
}

export { ScrambleText }
