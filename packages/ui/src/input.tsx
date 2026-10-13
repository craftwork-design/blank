import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "min-w-0 file:text-sm file:font-medium flex w-full border border-input bg-input-field text-foreground shadow-field transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground hover:border-input-hover focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:border-border disabled:bg-input-disabled disabled:text-muted-foreground disabled:shadow-none aria-invalid:border-danger-input aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-error-ring",
  {
    variants: {
      // One height scale for every control, matching Button: 32 / 40 / 48.
      size: {
        default: "h-10 px-3 py-2.5 text-sm leading-5 file:h-5 rounded-xl",
        sm: "h-8 px-2.5 py-1.5 text-sm leading-5 file:h-5 rounded-lg",
        lg: "h-12 px-4 py-3 text-base leading-6 file:h-6 rounded-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// The variant shadows the `size` HTML attribute, which is character-width on
// text inputs and effectively unused. Consistency with every other component's
// `size` prop is worth more than keeping it.
type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>

function Input({ className, type, size = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
export type { InputProps }
