"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const tooltipContentVariants = cva(
  [
    "group/tooltip-content relative z-50 origin-(--radix-tooltip-content-transform-origin) border border-border bg-popover text-popover-foreground shadow-tooltip",
    "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
    "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
  ],
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-xs leading-4 rounded-md",
        default: "px-3 py-2 text-xs leading-4 rounded-md",
        lg: "max-w-64 px-4 py-3 text-xs leading-4 rounded-lg",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

function TooltipProvider({
  delayDuration = 150,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 6,
  size = "sm",
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> &
  VariantProps<typeof tooltipContentVariants>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ size, className }))}
        {...props}
      >
        {children}
        <span
          data-slot="tooltip-arrow"
          className={cn(
            "size-2.5 pointer-events-none absolute rotate-45 bg-popover",
            "group-data-[side=top]/tooltip-content:bottom-[-6px] group-data-[side=top]/tooltip-content:left-1/2 group-data-[side=top]/tooltip-content:-translate-x-1/2 group-data-[side=top]/tooltip-content:border-r group-data-[side=top]/tooltip-content:border-b group-data-[side=top]/tooltip-content:border-border",
            "group-data-[side=bottom]/tooltip-content:top-[-6px] group-data-[side=bottom]/tooltip-content:left-1/2 group-data-[side=bottom]/tooltip-content:-translate-x-1/2 group-data-[side=bottom]/tooltip-content:border-t group-data-[side=bottom]/tooltip-content:border-l group-data-[side=bottom]/tooltip-content:border-border",
            "group-data-[side=right]/tooltip-content:top-1/2 group-data-[side=right]/tooltip-content:left-[-6px] group-data-[side=right]/tooltip-content:-translate-y-1/2 group-data-[side=right]/tooltip-content:border-b group-data-[side=right]/tooltip-content:border-l group-data-[side=right]/tooltip-content:border-border",
            "group-data-[side=left]/tooltip-content:top-1/2 group-data-[side=left]/tooltip-content:right-[-6px] group-data-[side=left]/tooltip-content:-translate-y-1/2 group-data-[side=left]/tooltip-content:border-t group-data-[side=left]/tooltip-content:border-r group-data-[side=left]/tooltip-content:border-border",
            "group-data-[align=start]/tooltip-content:group-data-[side=top]/tooltip-content:left-4 group-data-[align=start]/tooltip-content:group-data-[side=bottom]/tooltip-content:left-4 group-data-[align=start]/tooltip-content:group-data-[side=top]/tooltip-content:translate-x-0 group-data-[align=start]/tooltip-content:group-data-[side=bottom]/tooltip-content:translate-x-0",
            "group-data-[align=end]/tooltip-content:group-data-[side=top]/tooltip-content:right-4 group-data-[align=end]/tooltip-content:group-data-[side=bottom]/tooltip-content:right-4 group-data-[align=end]/tooltip-content:group-data-[side=top]/tooltip-content:translate-x-0 group-data-[align=end]/tooltip-content:group-data-[side=bottom]/tooltip-content:translate-x-0 group-data-[align=end]/tooltip-content:group-data-[side=bottom]/tooltip-content:left-auto group-data-[align=end]/tooltip-content:group-data-[side=top]/tooltip-content:left-auto",
            "group-data-[align=start]/tooltip-content:group-data-[side=left]/tooltip-content:top-4 group-data-[align=start]/tooltip-content:group-data-[side=right]/tooltip-content:top-4 group-data-[align=start]/tooltip-content:group-data-[side=left]/tooltip-content:translate-y-0 group-data-[align=start]/tooltip-content:group-data-[side=right]/tooltip-content:translate-y-0",
            "group-data-[align=end]/tooltip-content:group-data-[side=left]/tooltip-content:bottom-4 group-data-[align=end]/tooltip-content:group-data-[side=right]/tooltip-content:bottom-4 group-data-[align=end]/tooltip-content:group-data-[side=left]/tooltip-content:translate-y-0 group-data-[align=end]/tooltip-content:group-data-[side=right]/tooltip-content:translate-y-0 group-data-[align=end]/tooltip-content:group-data-[side=left]/tooltip-content:top-auto group-data-[align=end]/tooltip-content:group-data-[side=right]/tooltip-content:top-auto"
          )}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

function TooltipTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tooltip-title"
      className={cn("font-medium text-popover-foreground", className)}
      {...props}
    />
  )
}

function TooltipDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tooltip-description"
      className={cn("mt-1 text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Tooltip,
  TooltipContent,
  TooltipDescription,
  TooltipProvider,
  TooltipTitle,
  TooltipTrigger,
  tooltipContentVariants,
}
