import * as React from "react"

import { IPhoneFrame } from "@/components/ui/iphone-frame"
import { MacBookFrame } from "@/components/ui/macbook-frame"
import { cn } from "@/lib/utils"

/**
 * The hero composition: a laptop with a phone standing in front of one of its
 * corners. Both devices are sized from the stack's width, so the overlap holds
 * at every breakpoint.
 */
function DeviceStack({
  desktop,
  mobile,
  side = "right",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** Screen content of the laptop. */
  desktop?: React.ReactNode
  /** Screen content of the phone. */
  mobile?: React.ReactNode
  /** The corner of the laptop the phone stands in front of. */
  side?: "left" | "right"
}) {
  return (
    <div
      data-slot="device-stack"
      data-side={side}
      className={cn("group/device-stack relative w-full pb-[3%]", className)}
      {...props}
    >
      <MacBookFrame className="w-[95%] group-data-[side=left]/device-stack:ml-auto">
        {desktop}
      </MacBookFrame>
      <IPhoneFrame className="bottom-0 right-0 absolute w-[20%] group-data-[side=left]/device-stack:right-auto group-data-[side=left]/device-stack:left-0">
        {mobile}
      </IPhoneFrame>
    </div>
  )
}

export { DeviceStack }
