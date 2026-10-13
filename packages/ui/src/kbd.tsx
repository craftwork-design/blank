import * as React from "react"
import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "h-5 min-w-5 gap-1 px-1 text-xs font-medium shadow-xs [&_svg:not([class*='size-'])]:size-3 pointer-events-none inline-flex w-fit items-center justify-center rounded-sm border border-border bg-muted font-sans text-muted-foreground select-none in-data-[slot=tooltip-content]:border-transparent in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background in-data-[slot=tooltip-content]:shadow-none dark:in-data-[slot=tooltip-content]:bg-background/10",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("gap-1 inline-flex items-center", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
