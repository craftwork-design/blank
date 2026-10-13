// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/progressive-blur
import * as React from "react"

import { cn } from "@/lib/utils"

type BlurPosition = "top" | "bottom" | "both"
type BlurEdge = "top" | "bottom"

/**
 * One stack of backdrop-blur layers. Each layer is masked to a band, and the
 * bands overlap, so the blur ramps up smoothly toward the edge instead of
 * stepping.
 */
function BlurStack({
  edge,
  height,
  blurLevels,
}: {
  edge: BlurEdge
  height: string
  blurLevels: number[]
}) {
  const direction = edge === "bottom" ? "to bottom" : "to top"
  const step = 100 / blurLevels.length

  return (
    <div
      data-slot="progressive-blur-edge"
      data-edge={edge}
      className="absolute inset-x-0 data-[edge=bottom]:bottom-0 data-[edge=top]:top-0"
      style={{ height }}
    >
      {blurLevels.map((blur, i) => {
        const last = i === blurLevels.length - 1
        const mask = last
          ? `linear-gradient(${direction}, transparent ${i * step}%, black 100%)`
          : `linear-gradient(${direction}, transparent ${i * step}%, black ${(i + 1) * step}%, black ${(i + 2) * step}%, transparent ${(i + 3) * step}%)`
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: i + 1,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        )
      })}
    </div>
  )
}

/**
 * Blurs whatever scrolls beneath an edge of its container, strongest at the
 * edge. Place it inside a `relative` parent, over a scroller.
 */
function ProgressiveBlur({
  position = "bottom",
  height = "30%",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Which edge to blur. `both` blurs top and bottom with the same height. */
  position?: BlurPosition
  /** Height of the blurred band, as a CSS length. */
  height?: string
  /** Blur radii in px, from the inner end of the band to the edge. */
  blurLevels?: number[]
}) {
  const edges: BlurEdge[] = position === "both" ? ["top", "bottom"] : [position]

  return (
    <div
      data-slot="progressive-blur"
      data-position={position}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-10", className)}
      {...props}
    >
      {edges.map((edge) => (
        <BlurStack
          key={edge}
          edge={edge}
          height={height}
          blurLevels={blurLevels}
        />
      ))}
    </div>
  )
}

export { ProgressiveBlur }
