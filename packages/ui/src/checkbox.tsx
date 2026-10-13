"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  [
    "peer shadow-xs relative flex shrink-0 items-center justify-center border bg-background text-brand-foreground transition-colors outline-none select-none",
    "border-input hover:border-input-hover",
    "focus-visible:ring-3 focus-visible:ring-focus-ring",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-input disabled:text-background",
    "data-[state=checked]:border-transparent data-[state=checked]:bg-brand",
    "data-[state=indeterminate]:border-transparent data-[state=indeterminate]:bg-brand",
    "disabled:data-[state=checked]:bg-input disabled:data-[state=indeterminate]:bg-input",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-error-ring",
  ],
  {
    variants: {
      size: {
        sm: "size-4 [&_svg]:size-3 rounded-xs",
        default: "size-5 [&_svg]:size-3 rounded-xs",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>

function Checkbox({ className, size = "sm", ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-size={size}
      className={cn(checkboxVariants({ size, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current",
          "[&[data-state=checked]>svg[data-icon=check]]:block",
          "[&[data-state=indeterminate]>svg[data-icon=minus]]:block",
          "[&_svg]:hidden [&_svg]:stroke-[3]"
        )}
      >
        <CheckIcon data-icon="check" />
        <MinusIcon data-icon="minus" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
export { Checkbox, checkboxVariants }
export type { CheckboxProps }
