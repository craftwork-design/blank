// Based on Tremor Raw Tracker v1.0.0
// (https://github.com/tremorlabs/tremor/blob/ca4d588f47820ff3d514d37fa4ee08a4222dec11/src/components/Tracker/Tracker.tsx)
// Copyright (c) 2025 Tremor. Licensed under the Apache License, Version 2.0
// (http://www.apache.org/licenses/LICENSE-2.0); distributed on an "AS IS"
// BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
// Modified for Blank: hover cards replaced by Blank's Tooltip, Tailwind palette
// colors replaced by a `status` mapped to semantic tokens, roving keyboard focus
// and list semantics added, forwardRef removed.
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type TrackerStatus = "success" | "warning" | "danger" | "info" | "brand" | "empty"

type TrackerBlock = {
  key?: string | number
  /** Picks the block's color from the semantic palette. */
  status?: TrackerStatus
  /** Shown on hover, focus and tap. */
  tooltip?: React.ReactNode
  /** Accessible name; defaults to the tooltip when it is a string. */
  label?: string
  className?: string
}

type TrackerProps = Omit<React.ComponentProps<"div">, "children"> & {
  data: TrackerBlock[]
  /** Dim the block under the pointer. */
  hoverEffect?: boolean
}

function Tracker({
  data,
  hoverEffect = false,
  className,
  onKeyDown,
  ...props
}: TrackerProps) {
  const [focusIndex, setFocusIndex] = React.useState(data.length - 1)
  const tabStop = Math.min(Math.max(focusIndex, 0), data.length - 1)

  return (
    <div
      role="list"
      data-slot="tracker"
      data-hover-effect={hoverEffect || undefined}
      className={cn("group/tracker gap-px h-8 flex w-full items-stretch sm:gap-0.5", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const blocks = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "[data-slot=tracker-block]"
          )
        )
        const index = blocks.indexOf(event.target as HTMLElement)
        if (index === -1) return
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
        const forward = rtl ? "ArrowLeft" : "ArrowRight"
        const backward = rtl ? "ArrowRight" : "ArrowLeft"
        const next =
          event.key === forward
            ? index + 1
            : event.key === backward
              ? index - 1
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? blocks.length - 1
                  : null
        if (next === null || !blocks[next]) return
        event.preventDefault()
        setFocusIndex(next)
        blocks[next].focus()
      }}
      {...props}
    >
      {data.map((block, index) => (
        <TrackerBlockItem
          key={block.key ?? index}
          block={block}
          tabIndex={index === tabStop ? 0 : -1}
          onFocus={() => setFocusIndex(index)}
        />
      ))}
    </div>
  )
}

function TrackerBlockItem({
  block,
  tabIndex,
  onFocus,
}: {
  block: TrackerBlock
  tabIndex: number
  onFocus: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const label =
    block.label ?? (typeof block.tooltip === "string" ? block.tooltip : undefined)

  const element = (
    <div
      role="listitem"
      tabIndex={tabIndex}
      aria-label={label}
      data-slot="tracker-block"
      data-status={block.status ?? "empty"}
      className={cn(
        "min-w-0 flex-1 rounded-[2px] outline-none transition-opacity first:rounded-s-md last:rounded-e-md",
        "data-[status=success]:bg-success-primary data-[status=warning]:bg-warning-primary data-[status=danger]:bg-danger-primary data-[status=info]:bg-info-primary data-[status=brand]:bg-brand data-[status=empty]:bg-muted-foreground/25",
        "group-data-hover-effect/tracker:hover:opacity-60",
        "focus-visible:ring-3 focus-visible:ring-focus-ring",
        block.className
      )}
      onFocus={onFocus}
      onClick={() => setOpen(true)}
    />
  )

  if (!block.tooltip) return element

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent side="top" size="sm">
        {block.tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export { Tracker }
export type { TrackerBlock, TrackerProps, TrackerStatus }
