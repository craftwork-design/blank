"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-track",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
      },
      color: {
        brand: "[--progress-fill:var(--brand)]",
        success: "[--progress-fill:var(--success-primary)]",
        info: "[--progress-fill:var(--info-primary)]",
        warning: "[--progress-fill:var(--warning-primary)]",
        danger: "[--progress-fill:var(--destructive)]",
      },
    },
    defaultVariants: {
      size: "default",
      color: "brand",
    },
  }
)

function Progress({
  className,
  color = "brand",
  max = 100,
  size = "default",
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants>) {
  const percent = Math.min(
    100,
    Math.max(0, ((value ?? 0) / (max || 100)) * 100)
  )

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      data-color={color}
      className={cn(progressVariants({ size, color, className }))}
      max={max}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full bg-(--progress-fill) transition-transform"
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressVariants }
