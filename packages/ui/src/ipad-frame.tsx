import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A tablet with even bezels. Orientation lives in `data-orientation` and only
 * swaps the aspect ratio and the unit: `--u` is one hundredth of the short
 * side, so every bezel, radius and button below reads the same in portrait and
 * landscape. Size the frame with a width class.
 */

function IPadFrame({
  orientation = "portrait",
  src,
  alt = "",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "portrait" | "landscape"
  /** A screenshot to fill the screen instead of `children`. */
  src?: string
  alt?: string
}) {
  return (
    <div
      data-slot="ipad-frame"
      data-orientation={orientation}
      className={cn(
        "group/ipad @container relative w-(--ipad-width) max-w-full shrink-0",
        "data-[orientation=portrait]:aspect-[177.5/249.7] data-[orientation=portrait]:[--ipad-width:22.5rem] data-[orientation=portrait]:[--u:1cqw]",
        "data-[orientation=landscape]:aspect-[249.7/177.5] data-[orientation=landscape]:[--ipad-width:35rem] data-[orientation=landscape]:[--u:0.711cqw]",
        className
      )}
      {...props}
    >
      {/* Top button and volume rocker: top and right edges in portrait, left
          and top edges once the device turns. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute rounded-[calc(var(--u)*0.5)] bg-device-frame",
          "-top-[calc(var(--u)*0.7)] right-[calc(var(--u)*10)] h-[calc(var(--u)*1.2)] w-[calc(var(--u)*9)]",
          "group-data-[orientation=landscape]/ipad:top-[calc(var(--u)*10)] group-data-[orientation=landscape]/ipad:right-auto group-data-[orientation=landscape]/ipad:-left-[calc(var(--u)*0.7)] group-data-[orientation=landscape]/ipad:h-[calc(var(--u)*9)] group-data-[orientation=landscape]/ipad:w-[calc(var(--u)*1.2)]"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute rounded-[calc(var(--u)*0.5)] bg-device-frame",
          "top-[calc(var(--u)*12)] -right-[calc(var(--u)*0.7)] h-[calc(var(--u)*8)] w-[calc(var(--u)*1.2)]",
          "group-data-[orientation=landscape]/ipad:-top-[calc(var(--u)*0.7)] group-data-[orientation=landscape]/ipad:right-auto group-data-[orientation=landscape]/ipad:left-[calc(var(--u)*12)] group-data-[orientation=landscape]/ipad:h-[calc(var(--u)*1.2)] group-data-[orientation=landscape]/ipad:w-[calc(var(--u)*8)]"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute rounded-[calc(var(--u)*0.5)] bg-device-frame",
          "top-[calc(var(--u)*21.5)] -right-[calc(var(--u)*0.7)] h-[calc(var(--u)*8)] w-[calc(var(--u)*1.2)]",
          "group-data-[orientation=landscape]/ipad:-top-[calc(var(--u)*0.7)] group-data-[orientation=landscape]/ipad:right-auto group-data-[orientation=landscape]/ipad:left-[calc(var(--u)*21.5)] group-data-[orientation=landscape]/ipad:h-[calc(var(--u)*1.2)] group-data-[orientation=landscape]/ipad:w-[calc(var(--u)*8)]"
        )}
      />

      <div
        data-slot="ipad-frame-body"
        className="inset-0 absolute rounded-[calc(var(--u)*7)] bg-device-frame p-[calc(var(--u)*0.9)] shadow-2xl"
      >
        <div className="relative size-full rounded-[calc(var(--u)*6.1)] bg-device p-[calc(var(--u)*3.9)]">
          <div
            data-slot="ipad-frame-screen"
            className="relative size-full overflow-hidden rounded-[calc(var(--u)*2.4)] bg-background [clip-path:inset(0_round_calc(var(--u)*2.4))]"
          >
            {src ? (
              <img
                src={src}
                alt={alt}
                className="size-full object-cover object-top"
              />
            ) : (
              children
            )}
          </div>
          <span
            data-slot="ipad-frame-camera"
            aria-hidden="true"
            className="absolute top-[calc(var(--u)*1.4)] left-1/2 size-[calc(var(--u)*1.1)] -translate-x-1/2 rounded-full bg-device-frame/40"
          />
        </div>
      </div>
    </div>
  )
}

export { IPadFrame }
