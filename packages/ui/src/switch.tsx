"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const switchVariants = cva(
  [
    "peer group/switch p-0.5 relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none select-none",
    "bg-muted-foreground hover:bg-input-hover",
    "focus-visible:ring-3 focus-visible:ring-focus-ring",
    "disabled:cursor-not-allowed disabled:bg-muted",
    "data-[state=checked]:bg-primary",
    "disabled:data-[state=checked]:bg-primary/40",
    "aria-invalid:ring-3 aria-invalid:ring-error-ring",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-[34px]",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

function Switch({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(switchVariants({ size, className }))}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "shadow-xs pointer-events-none block rounded-full bg-background ring-0 transition-transform",
          "size-3 group-data-[size=default]/switch:size-4",
          "data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-3",
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-[14px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch, switchVariants }
