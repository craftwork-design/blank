// Based on Origin UI timeline (https://github.com/cosscom/coss/blob/0ac96b5353780c19d3122a86cac67ef0551f33ce/apps/origin/registry/default/ui/timeline.tsx)
// Copyright (c) 2025 coss.com, originally Copyright (c) 2025 Origin UI.
// Licensed under MIT (apps/origin/LICENSE.md). Modified for Blank.
"use client"

import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const TimelineContext = React.createContext<{ value: number } | null>(null)

type TimelineProps = Omit<React.ComponentProps<"ol">, "defaultValue"> & {
  /**
   * Items up to and including this step render as completed. A timeline is a
   * record, not a control, so there is no change handler.
   */
  value?: number
  orientation?: "horizontal" | "vertical"
}

function Timeline({
  value = 0,
  orientation = "vertical",
  className,
  ...props
}: TimelineProps) {
  return (
    <TimelineContext.Provider value={{ value }}>
      <ol
        data-slot="timeline"
        data-orientation={orientation}
        className={cn(
          "group/timeline flex list-none data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      />
    </TimelineContext.Provider>
  )
}

function TimelineItem({
  step,
  className,
  ...props
}: React.ComponentProps<"li"> & {
  /** Position in the timeline, counted from 1. */
  step: number
}) {
  const context = React.useContext(TimelineContext)
  const completed = context !== null && step <= context.value

  return (
    <li
      data-slot="timeline-item"
      data-completed={completed || undefined}
      className={cn(
        "group/timeline-item gap-0.5 relative flex flex-1 flex-col",
        "group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=vertical]/timeline:not-last:pb-10",
        "group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8",
        // The line out of an item turns brand once the next item is reached too.
        "has-[+[data-completed]]:**:data-[slot=timeline-separator]:bg-brand",
        className
      )}
      {...props}
    />
  )
}

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="timeline-header" className={className} {...props} />
  )
}

function TimelineIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="timeline-indicator"
      className={cn(
        "size-4 [&_svg:not([class*='size-'])]:size-3 absolute flex items-center justify-center rounded-full border-2 border-border bg-background text-brand-foreground transition-colors",
        "group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2",
        "group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
        "rtl:group-data-[orientation=vertical]/timeline:-right-6 rtl:group-data-[orientation=vertical]/timeline:left-auto rtl:group-data-[orientation=vertical]/timeline:translate-x-1/2",
        "group-data-completed/timeline-item:border-brand",
        className
      )}
      {...props}
    />
  )
}

function TimelineSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="timeline-separator"
      className={cn(
        "absolute self-start bg-border transition-colors group-last/timeline-item:hidden",
        "group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.5rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-5",
        "group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.5rem)] group-data-[orientation=horizontal]/timeline:translate-x-5 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
        "rtl:group-data-[orientation=vertical]/timeline:-right-6 rtl:group-data-[orientation=vertical]/timeline:left-auto rtl:group-data-[orientation=vertical]/timeline:translate-x-1/2",
        className
      )}
      {...props}
    />
  )
}

function TimelineDate({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"time"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "time"

  return (
    <Comp
      data-slot="timeline-date"
      className={cn(
        "mb-1 text-xs font-medium block text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
}
export type { TimelineProps }
