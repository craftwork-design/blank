// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/flickering-grid
"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A canvas of small squares that flicker at random. The color is read from
 * CSS at runtime — `currentColor` (muted foreground by default), or any value
 * passed to `color`, including `var(--token)` — and re-read when the theme
 * changes. Drawing stops while the grid is off screen; with reduced motion it
 * draws one still frame.
 */
function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  maxOpacity = 0.3,
  color,
  width,
  height,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  /** Side of each square, in px. */
  squareSize?: number
  /** Gap between squares, in px. */
  gridGap?: number
  /** Chance per second that a square changes its opacity. */
  flickerChance?: number
  /** Peak opacity of a square, 0–1. */
  maxOpacity?: number
  /** Any CSS color, e.g. `var(--brand)`. Defaults to `currentColor`. */
  color?: string
  /** Fixed width in px. Defaults to the element's width. */
  width?: number
  /** Fixed height in px. Defaults to the element's height. */
  height?: number
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!container || !canvas || !context) return

    let fill = ""
    let columns = 0
    let rows = 0
    let ratio = 1
    let squares = new Float32Array(0)
    let frame: number | null = null
    let previous = 0
    let visible = false

    // Canvas cannot resolve `var()`; the computed `color` of the container
    // is the resolved value of whatever was set, in any color syntax.
    const readColor = () => {
      fill = getComputedStyle(container).color
    }

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = fill
      const step = (squareSize + gridGap) * ratio
      const side = squareSize * ratio
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          context.globalAlpha = squares[i * rows + j]
          context.fillRect(i * step, j * step, side, side)
        }
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      const w = width ?? container.clientWidth
      const h = height ?? container.clientHeight
      ratio = window.devicePixelRatio || 1
      canvas.width = Math.round(w * ratio)
      canvas.height = Math.round(h * ratio)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      columns = Math.ceil(w / (squareSize + gridGap))
      rows = Math.ceil(h / (squareSize + gridGap))
      squares = new Float32Array(columns * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }
      draw()
    }

    const tick = (time: number) => {
      const elapsed = previous ? (time - previous) / 1000 : 0
      previous = time
      const chance = flickerChance * elapsed
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < chance) squares[i] = Math.random() * maxOpacity
      }
      draw()
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame !== null || !visible || reduceMotion) return
      previous = 0
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (frame === null) return
      cancelAnimationFrame(frame)
      frame = null
    }

    readColor()
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    intersectionObserver.observe(container)

    // Theme switches flip a class or attribute on <html>; tokens follow.
    const themeObserver = new MutationObserver(() => {
      readColor()
      draw()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    })

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
    }
  }, [
    squareSize,
    gridGap,
    flickerChance,
    maxOpacity,
    color,
    width,
    height,
    reduceMotion,
  ])

  return (
    <div
      ref={containerRef}
      data-slot="flickering-grid"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden text-muted-foreground",
        className
      )}
      style={color ? { color, ...style } : style}
      {...props}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}

export { FlickeringGrid }
