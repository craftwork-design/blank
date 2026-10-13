import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Every measurement is in `cqw` of the root, taken from the real device
 * (71.6 × 146.6 mm), so the phone keeps its proportions at any width: set the
 * size with a width class and nothing else.
 */

function IPhoneFrame({
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
      data-slot="iphone-frame"
      className={cn(
        "@container relative aspect-[71.6/146.6] w-75 max-w-full shrink-0",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute top-[30cqw] -left-[0.8cqw] h-[7cqw] w-[1.2cqw] rounded-l-[0.6cqw] bg-device-frame"
      />
      <span
        aria-hidden="true"
        className="absolute top-[46cqw] -left-[0.8cqw] h-[13cqw] w-[1.2cqw] rounded-l-[0.6cqw] bg-device-frame"
      />
      <span
        aria-hidden="true"
        className="absolute top-[63cqw] -left-[0.8cqw] h-[13cqw] w-[1.2cqw] rounded-l-[0.6cqw] bg-device-frame"
      />
      <span
        aria-hidden="true"
        className="absolute top-[50cqw] -right-[0.8cqw] h-[21cqw] w-[1.2cqw] rounded-r-[0.6cqw] bg-device-frame"
      />

      <div
        data-slot="iphone-frame-body"
        className="inset-0 absolute rounded-[17cqw] bg-device-frame p-[1.1cqw] shadow-2xl"
      >
        <div className="relative size-full rounded-[15.9cqw] bg-device p-[3.3cqw]">
          <div
            data-slot="iphone-frame-screen"
            className="relative size-full overflow-hidden rounded-[12.6cqw] bg-background [clip-path:inset(0_round_12.6cqw)]"
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
            data-slot="iphone-frame-island"
            aria-hidden="true"
            className="top-[5.4cqw] absolute left-1/2 z-10 h-[8.6cqw] w-[28.5cqw] -translate-x-1/2 rounded-full bg-device"
          />
        </div>
      </div>
    </div>
  )
}

export { IPhoneFrame }
