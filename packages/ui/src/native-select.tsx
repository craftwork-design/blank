import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default" | "lg"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-10 min-w-0 py-2 pr-9 pl-3 text-sm data-[size=sm]:h-8 data-[size=sm]:py-1 data-[size=sm]:pr-8 data-[size=sm]:pl-2.5 data-[size=lg]:h-12 data-[size=lg]:py-3 data-[size=lg]:pr-10 data-[size=lg]:pl-4 data-[size=lg]:text-base w-full appearance-none rounded-xl border border-input bg-input-field text-foreground shadow-field transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground hover:border-input-hover focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border disabled:bg-input-disabled disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-error-ring data-[size=sm]:rounded-lg"
        {...props}
      />
      <ChevronDownIcon
        className="right-3 size-4 group-data-[size=lg]/native-select:right-4 group-data-[size=sm]/native-select:right-2.5 pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
