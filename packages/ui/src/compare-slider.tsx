// Based on Dice UI compare-slider (https://github.com/sadmann7/diceui/blob/ea7c91f8c17689f84b928f513de4404784e89792/docs/registry/bases/radix/ui/compare-slider.tsx)
// Copyright (c) 2024 Sadman Sakib. Licensed under MIT. Modified for Blank.
"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CompareSliderContextValue = {
  value: number
  orientation: "horizontal" | "vertical"
}

const CompareSliderContext =
  React.createContext<CompareSliderContextValue | null>(null)

function useCompareSlider(part: string) {
  const context = React.useContext(CompareSliderContext)
  if (!context) throw new Error(`${part} must be used within <CompareSlider>`)
  return context
}

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 100)
}

type CompareSliderProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** Position of the divider, 0–100, measured from the start edge. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Arrow-key step; Page keys and Shift move ten times as far. */
  step?: number
  orientation?: "horizontal" | "vertical"
  /** `hover` follows the pointer without pressing. */
  interaction?: "drag" | "hover"
}

function CompareSlider({
  value: valueProp,
  defaultValue = 50,
  onValueChange,
  step = 1,
  orientation = "horizontal",
  interaction = "drag",
  className,
  children,
  onKeyDown,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  ...props
}: CompareSliderProps) {
  const [uncontrolled, setUncontrolled] = React.useState(clamp(defaultValue))
  const value = clamp(valueProp ?? uncontrolled)
  const dragging = React.useRef(false)
  const vertical = orientation === "vertical"

  const setValue = (next: number) => {
    const clamped = Math.round(clamp(next) * 100) / 100
    if (valueProp === undefined) setUncontrolled(clamped)
    onValueChange?.(clamped)
  }

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    if (vertical) return ((event.clientY - rect.top) / rect.height) * 100
    const offset = rtl ? rect.right - event.clientX : event.clientX - rect.left
    return (offset / rect.width) * 100
  }

  return (
    <CompareSliderContext.Provider value={{ value, orientation }}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={props["aria-label"] ?? "Comparison position"}
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={`${Math.round(value)}%`}
        data-slot="compare-slider"
        data-orientation={orientation}
        data-interaction={interaction}
        className={cn(
          "group/compare-slider isolate relative w-full touch-none overflow-hidden rounded-xl border border-border outline-none select-none",
          "focus-visible:ring-3 focus-visible:ring-focus-ring",
          "data-[interaction=drag]:cursor-ew-resize data-[orientation=vertical]:data-[interaction=drag]:cursor-ns-resize",
          className
        )}
        onPointerDown={(event) => {
          onPointerDown?.(event)
          if (event.defaultPrevented || interaction !== "drag") return
          if (event.pointerType === "mouse" && event.button !== 0) return
          dragging.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          setValue(fromPointer(event))
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event)
          if (event.defaultPrevented) return
          if (interaction === "hover" || dragging.current) {
            setValue(fromPointer(event))
          }
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event)
          dragging.current = false
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        }}
        onPointerCancel={() => {
          dragging.current = false
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
          const big = step * 10
          const increase = vertical
            ? ["ArrowDown"]
            : [rtl ? "ArrowLeft" : "ArrowRight", "ArrowUp"]
          const decrease = vertical
            ? ["ArrowUp"]
            : [rtl ? "ArrowRight" : "ArrowLeft", "ArrowDown"]
          let next: number | null = null
          if (increase.includes(event.key)) next = value + (event.shiftKey ? big : step)
          else if (decrease.includes(event.key)) next = value - (event.shiftKey ? big : step)
          else if (event.key === "PageDown") next = value + big
          else if (event.key === "PageUp") next = value - big
          else if (event.key === "Home") next = 0
          else if (event.key === "End") next = 100
          if (next === null) return
          event.preventDefault()
          setValue(next)
        }}
        {...props}
      >
        {children}
      </div>
    </CompareSliderContext.Provider>
  )
}

/** The layer revealed on the start side of the divider. */
function CompareSliderBefore({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { value, orientation } = useCompareSlider("CompareSliderBefore")
  const vertical = orientation === "vertical"
  const clip = vertical
    ? `inset(0 0 ${100 - value}% 0)`
    : `inset(0 ${100 - value}% 0 0)`
  // Right-to-left pages reveal the start side from the right edge.
  const clipRtl = vertical ? clip : `inset(0 0 0 ${100 - value}%)`

  return (
    <div
      data-slot="compare-slider-before"
      className={cn(
        "inset-0 absolute z-10 size-full [clip-path:var(--compare-clip)] rtl:[clip-path:var(--compare-clip-rtl)] *:size-full *:object-cover",
        className
      )}
      style={
        {
          "--compare-clip": clip,
          "--compare-clip-rtl": clipRtl,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

/** The base layer, revealed on the end side. It sets the slider's size. */
function CompareSliderAfter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="compare-slider-after"
      className={cn("relative size-full *:size-full *:object-cover", className)}
      {...props}
    />
  )
}

function CompareSliderHandle({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { value, orientation } = useCompareSlider("CompareSliderHandle")
  const vertical = orientation === "vertical"

  return (
    <div
      aria-hidden="true"
      data-slot="compare-slider-handle"
      className={cn(
        "pointer-events-none absolute z-20 flex items-center justify-center",
        "group-data-[orientation=horizontal]/compare-slider:inset-y-0 group-data-[orientation=horizontal]/compare-slider:w-0",
        "group-data-[orientation=vertical]/compare-slider:inset-x-0 group-data-[orientation=vertical]/compare-slider:h-0",
        className
      )}
      style={{
        ...(vertical
          ? { top: `${value}%` }
          : { insetInlineStart: `${value}%` }),
        ...style,
      }}
      {...props}
    >
      <div className="absolute bg-overlay-foreground shadow-[0_0_0_1px_var(--color-overlay)] group-data-[orientation=horizontal]/compare-slider:inset-y-0 group-data-[orientation=horizontal]/compare-slider:w-0.5 group-data-[orientation=vertical]/compare-slider:inset-x-0 group-data-[orientation=vertical]/compare-slider:h-0.5" />
      {children ?? (
        <div className="size-8 relative flex shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-md transition-transform group-active/compare-slider:scale-95 motion-reduce:transition-none [&_svg]:size-4 group-data-[orientation=vertical]/compare-slider:[&_svg]:rotate-90">
          <GripVerticalIcon />
        </div>
      )}
    </div>
  )
}

function CompareSliderLabel({
  side = "before",
  className,
  ...props
}: React.ComponentProps<"div"> & { side?: "before" | "after" }) {
  return (
    <div
      data-slot="compare-slider-label"
      data-side={side}
      className={cn(
        "px-2 py-1 text-xs font-medium pointer-events-none absolute z-30 rounded-md bg-overlay text-overlay-foreground backdrop-blur-sm",
        "data-[side=before]:start-3 data-[side=before]:top-3",
        "data-[side=after]:end-3 data-[side=after]:top-3",
        "group-data-[orientation=vertical]/compare-slider:data-[side=after]:start-3 group-data-[orientation=vertical]/compare-slider:data-[side=after]:end-auto group-data-[orientation=vertical]/compare-slider:data-[side=after]:top-auto group-data-[orientation=vertical]/compare-slider:data-[side=after]:bottom-3",
        className
      )}
      {...props}
    />
  )
}

export {
  CompareSlider,
  CompareSliderAfter,
  CompareSliderBefore,
  CompareSliderHandle,
  CompareSliderLabel,
}
export type { CompareSliderProps }
