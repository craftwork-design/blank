import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-30 px-4 py-2.5 text-sm leading-5 flex field-sizing-content w-full resize-y rounded-xl border border-input bg-input-field text-foreground shadow-field transition-colors outline-none placeholder:text-muted-foreground hover:border-input-hover focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:border-border disabled:bg-input-disabled disabled:text-muted-foreground disabled:shadow-none aria-invalid:border-danger-input aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:ring-error-ring",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
