"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  showFill?: boolean
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showFill = true,
  ...props
}: SliderProps) {
  const values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min],
    [value, defaultValue, min]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-fill={showFill}
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:min-w-40",
        "data-[orientation=vertical]:h-40 data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted",
          "data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:w-2 data-[orientation=vertical]:h-full"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute rounded-full bg-brand",
            "data-[fill=false]:bg-transparent",
            "data-[orientation=horizontal]:h-full",
            "data-[orientation=vertical]:w-full"
          )}
          data-fill={showFill}
        />
      </SliderPrimitive.Track>
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className={cn(
            "size-5 relative block shrink-0 rounded-full border border-border bg-background shadow-thumb transition-[box-shadow,border-color,transform] outline-none select-none",
            "after:-inset-2 after:absolute",
            "hover:border-input-hover hover:ring-3 hover:ring-ring/15",
            "focus-visible:ring-3 focus-visible:ring-focus-ring",
            "active:scale-95 active:ring-3 active:ring-focus-ring",
            "disabled:pointer-events-none disabled:border-input disabled:bg-background disabled:opacity-70"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
export type { SliderProps }
