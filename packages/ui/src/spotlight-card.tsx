"use client"

// Adapted from Magic UI "Magic Card" (MIT, © Magic UI) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/magic-card.tsx
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A card lit from the cursor: the border picks up a radial gradient and the
 * surface a soft spotlight wherever the pointer is. The pointer position is
 * written straight to CSS variables, so moving the mouse never re-renders.
 *
 * Every color prop takes any CSS color and defaults to a token, so the card
 * follows the theme without a theme hook.
 */
function SpotlightCard({
  className,
  style,
  gradientSize = 240,
  gradientColor = "var(--item-secondary)",
  gradientOpacity = 1,
  gradientFrom = "var(--brand)",
  gradientTo = "var(--item-selected-border)",
  onPointerMove,
  onPointerLeave,
  ...props
}: React.ComponentProps<"div"> & {
  /** Radius of the spotlight, in px. */
  gradientSize?: number
  /** Fill of the spotlight on the surface. */
  gradientColor?: string
  /** Opacity of the surface spotlight while hovered. */
  gradientOpacity?: number
  /** Border color under the pointer. */
  gradientFrom?: string
  /** Border color at the spotlight's edge, before it fades into the border. */
  gradientTo?: string
}) {
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
    const node = event.currentTarget
    const rect = node.getBoundingClientRect()
    node.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`)
    node.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`)
  }

  function handlePointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event)
    event.currentTarget.style.removeProperty("--spotlight-x")
    event.currentTarget.style.removeProperty("--spotlight-y")
  }

  return (
    <div
      data-slot="spotlight-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        {
          "--spotlight-size": `${gradientSize}px`,
          "--spotlight-color": gradientColor,
          "--spotlight-opacity": gradientOpacity,
          "--spotlight-from": gradientFrom,
          "--spotlight-to": gradientTo,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "group/spotlight-card relative isolate flex flex-col overflow-hidden rounded-xl border border-transparent text-card-foreground [--spotlight-x:-9999px] [--spotlight-y:-9999px]",
        "[background:linear-gradient(var(--color-card),var(--color-card))_padding-box,radial-gradient(var(--spotlight-size)_circle_at_var(--spotlight-x)_var(--spotlight-y),var(--spotlight-from),var(--spotlight-to),var(--color-border)_100%)_border-box]",
        // The surface spotlight sits at z -1: above the card's own background,
        // below every child, so content needs no wrapper.
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] hover:before:opacity-(--spotlight-opacity) motion-reduce:before:transition-none",
        "before:[background:radial-gradient(var(--spotlight-size)_circle_at_var(--spotlight-x)_var(--spotlight-y),var(--spotlight-color),transparent_100%)]",
        className
      )}
      {...props}
    />
  )
}

export { SpotlightCard }
