import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A Pixel-style handset: flat aluminium sides, even bezels and a punch-hole
 * camera. Measurements are in `cqw` of the root (72 × 152.8 mm device), so the
 * frame keeps its proportions at any width.
 */

function AndroidFrame({
  src,
  alt = "",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** A screenshot to fill the screen instead of `children`. */
  src?: string
  alt?: string
}) {
  return (
    <div
      data-slot="android-frame"
      className={cn(
        "@container relative aspect-[72/152.8] w-75 max-w-full shrink-0",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute top-[42cqw] -right-[0.8cqw] h-[12cqw] w-[1.2cqw] rounded-r-[0.5cqw] bg-device-frame"
      />
      <span
        aria-hidden="true"
        className="absolute top-[60cqw] -right-[0.8cqw] h-[25cqw] w-[1.2cqw] rounded-r-[0.5cqw] bg-device-frame"
      />

      <div
        data-slot="android-frame-body"
        className="inset-0 absolute rounded-[13cqw] bg-device-frame p-[1cqw] shadow-2xl"
      >
        <div className="relative size-full rounded-[12cqw] bg-device p-[3cqw]">
          <div
            data-slot="android-frame-screen"
            className="relative size-full overflow-hidden rounded-[9.5cqw] bg-background [clip-path:inset(0_round_9.5cqw)]"
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
            data-slot="android-frame-camera"
            aria-hidden="true"
            className="top-[5.2cqw] absolute left-1/2 z-10 size-[4.4cqw] -translate-x-1/2 rounded-full bg-device ring-[0.7cqw] ring-device-frame/25"
          />
        </div>
      </div>
    </div>
  )
}

export { AndroidFrame }
