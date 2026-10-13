"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("gap-2 grid", className)}
      {...props}
    />
  )
}

const radioGroupItemVariants = cva(
  [
    "peer group/radio-group-item shadow-xs relative flex shrink-0 items-center justify-center rounded-full border bg-background transition-colors outline-none select-none",
    "border-input hover:border-input-hover",
    "focus-visible:ring-3 focus-visible:ring-focus-ring",
    "data-[state=checked]:border-2 data-[state=checked]:border-brand",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-input disabled:shadow-none",
    "disabled:data-[state=checked]:border-2 disabled:data-[state=checked]:border-border disabled:data-[state=checked]:bg-background",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-error-ring",
  ],
  {
    variants: {
      size: {
        sm: "size-4",
        default: "size-5",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

type RadioGroupItemProps = React.ComponentProps<
  typeof RadioGroupPrimitive.Item
> &
  VariantProps<typeof radioGroupItemVariants>

function RadioGroupItem({
  className,
  size = "sm",
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-size={size}
      className={cn(radioGroupItemVariants({ size, className }))}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <span
          className={cn(
            "size-2 rounded-full bg-brand",
            "group-data-[size=default]/radio-group-item:size-2.5",
            "group-disabled/radio-group-item:bg-input"
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
export { RadioGroup, RadioGroupItem, radioGroupItemVariants }
export type { RadioGroupItemProps }
