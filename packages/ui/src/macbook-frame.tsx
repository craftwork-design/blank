import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * An open laptop seen from the front: lid, hinge and the lip of the base.
 * Measurements are in `cqw` of the root, so the frame scales with its width
 * and the screen keeps a 16:10 panel.
 */

function MacBookFrame({
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
      data-slot="macbook-frame"
      className={cn("@container w-full shrink-0", className)}
      {...props}
    >
      <div
        data-slot="macbook-frame-lid"
        className="mx-auto w-[83cqw] rounded-t-[3.4cqw] bg-device-frame p-[0.35cqw] pb-0"
      >
        <div className="relative rounded-t-[3.1cqw] bg-device px-[1.7cqw] pt-[2.1cqw] pb-[2.6cqw]">
          <span
            aria-hidden="true"
            className="top-[0.75cqw] absolute left-1/2 size-[0.6cqw] -translate-x-1/2 rounded-full bg-device-frame/40"
          />
          <div
            data-slot="macbook-frame-screen"
            className="relative aspect-[16/10] overflow-hidden rounded-[0.6cqw] bg-background"
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
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mx-auto h-[0.7cqw] w-[83cqw] bg-linear-to-b from-device to-device-frame"
      />
      <div
        data-slot="macbook-frame-base"
        aria-hidden="true"
        className="relative h-[2.3cqw] w-full rounded-t-[0.5cqw] rounded-b-[6cqw_100%] bg-device-frame shadow-lg after:absolute after:inset-0 after:rounded-[inherit] after:bg-linear-to-b after:from-transparent after:from-40% after:to-device/25"
      >
        <span className="h-[0.8cqw] absolute top-0 left-1/2 w-[13cqw] -translate-x-1/2 rounded-b-[0.8cqw] bg-device/15" />
      </div>
    </div>
  )
}

export { MacBookFrame }
