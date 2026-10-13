"use client"

// Adapted from BeUI "Tilt Card" (MIT, © 2026 Saurabh Chauhan) — https://github.com/starc007/ui-components
import * as React from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/lib/utils"
import { useHoverCapable } from "@/hooks/use-hover-capable"

// Cursor-follow physics: quick to answer, settles without wobble.
const TILT_SPRING = { stiffness: 200, damping: 15, mass: 0.3 }

/**
 * A card that leans toward the pointer, with an optional glare that follows
 * it. The effect is decorative, so it switches off on touch screens (where a
 * tap leaves a phantom hover behind) and under reduced motion; the card stays
 * a plain card there.
 */
function TiltCard({
  className,
  style,
  max = 12,
  glare = true,
  onPointerMove,
  onPointerLeave,
  children,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode
  /** Largest tilt on either axis, in degrees. */
  max?: number
  /** Show a highlight that follows the pointer. */
  glare?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const canHover = useHoverCapable()
  const enabled = !reduceMotion && canHover

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const springX = useSpring(rotateX, TILT_SPRING)
  const springY = useSpring(rotateY, TILT_SPRING)

  const transform = useMotionTemplate`perspective(1000px) rotateX(${springX}deg) rotateY(${springY}deg)`
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, var(--tilt-glare), transparent 55%)`

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
    if (!enabled || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * max)
    rotateX.set((0.5 - py) * max)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      data-slot="tilt-card"
      data-tilt={enabled || undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: enabled ? transform : undefined,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={cn(
        "group/tilt-card relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm [--tilt-glare:var(--foreground)] data-tilt:will-change-transform",
        className
      )}
      {...props}
    >
      {children}
      {glare && enabled ? (
        <motion.div
          aria-hidden
          data-slot="tilt-card-glare"
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt-card:opacity-[0.06] dark:group-hover/tilt-card:opacity-10"
        />
      ) : null}
    </motion.div>
  )
}

export { TiltCard }
