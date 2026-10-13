// Based on Dice UI rating (https://github.com/sadmann7/diceui/blob/ea7c91f8c17689f84b928f513de4404784e89792/docs/registry/bases/radix/ui/rating.tsx)
// Copyright (c) 2024 Sadman Sakib. Licensed under MIT. Modified for Blank.
"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type RatingContextValue = {
  value: number
  displayValue: number
  max: number
  step: 0.5 | 1
  size: "sm" | "default" | "lg"
  disabled: boolean
  readOnly: boolean
  clearable: boolean
  setValue: (value: number) => void
  setHoverValue: (value: number | null) => void
  getAutoIndex: (id: string) => number
  itemRefs: React.RefObject<Map<number, HTMLButtonElement>>
}

const RatingContext = React.createContext<RatingContextValue | null>(null)

function useRating(part: string) {
  const context = React.useContext(RatingContext)
  if (!context) throw new Error(`${part} must be used within <Rating>`)
  return context
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

type RatingProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  /** Number of items. Rendered automatically when there are no children. */
  max?: number
  /** `0.5` lets a pointer or the arrow keys pick half values. */
  step?: 0.5 | 1
  /** Picking the current value again resets it to 0. */
  clearable?: boolean
  size?: "sm" | "default" | "lg"
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Submits the value in a hidden input under this name. */
  name?: string
}

function Rating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  max = 5,
  step = 1,
  clearable = false,
  size = "default",
  disabled = false,
  readOnly = false,
  required = false,
  name,
  className,
  children,
  onMouseLeave,
  ...props
}: RatingProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = clamp(valueProp ?? uncontrolled, 0, max)
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)
  const itemRefs = React.useRef(new Map<number, HTMLButtonElement>())

  // Items without an explicit `index` number themselves in mount order.
  const autoIndexes = React.useRef(new Map<string, number>())
  const getAutoIndex = React.useCallback((id: string) => {
    const existing = autoIndexes.current.get(id)
    if (existing !== undefined) return existing
    const next = autoIndexes.current.size
    autoIndexes.current.set(id, next)
    return next
  }, [])

  const setValue = React.useCallback(
    (next: number) => {
      if (disabled || readOnly) return
      const clamped = clamp(next, 0, max)
      if (valueProp === undefined) setUncontrolled(clamped)
      onValueChange?.(clamped)
    },
    [disabled, readOnly, max, valueProp, onValueChange]
  )

  const interactive = !disabled && !readOnly
  const context = React.useMemo<RatingContextValue>(
    () => ({
      value,
      displayValue: interactive && hoverValue !== null ? hoverValue : value,
      max,
      step,
      size,
      disabled,
      readOnly,
      clearable,
      setValue,
      setHoverValue,
      getAutoIndex,
      itemRefs,
    }),
    [
      value,
      hoverValue,
      interactive,
      max,
      step,
      size,
      disabled,
      readOnly,
      clearable,
      setValue,
      getAutoIndex,
    ]
  )

  return (
    <RatingContext.Provider value={context}>
      <div
        role="radiogroup"
        data-slot="rating"
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-required={required || undefined}
        className={cn(
          "group/rating gap-0.5 inline-flex items-center text-warning-primary",
          "data-disabled:opacity-50",
          className
        )}
        onMouseLeave={(event) => {
          onMouseLeave?.(event)
          setHoverValue(null)
        }}
        {...props}
      >
        {children ??
          Array.from({ length: max }, (_, index) => (
            <RatingItem key={index} index={index} />
          ))}
      </div>
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          disabled={disabled}
          required={required}
        />
      )}
    </RatingContext.Provider>
  )
}

function RatingItem({
  index: indexProp,
  className,
  children,
  onClick,
  onKeyDown,
  onPointerMove,
  ref,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  /** Zero-based position. Defaults to mount order. */
  index?: number
  /** Custom icon, or a function of the item's fill state. */
  children?:
    | React.ReactNode
    | ((state: "full" | "half" | "empty") => React.ReactNode)
}) {
  const context = useRating("RatingItem")
  const autoId = React.useId()
  const index = indexProp ?? context.getAutoIndex(autoId)
  const itemValue = index + 1
  const { displayValue, value, step, max } = context

  const state =
    displayValue >= itemValue
      ? "full"
      : step < 1 && displayValue >= itemValue - 0.5
        ? "half"
        : "empty"

  // One tab stop: the item that holds the value, or the first when empty.
  const tabStop = value === 0 ? index === 0 : Math.ceil(value) === itemValue
  const checked =
    step < 1 ? Math.ceil(value) === itemValue && value > 0 : value === itemValue

  const pointerValue = (event: React.PointerEvent | React.MouseEvent) => {
    if (step === 1) return itemValue
    const rect = event.currentTarget.getBoundingClientRect()
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
    const offset = rtl ? rect.right - event.clientX : event.clientX - rect.left
    return offset < rect.width / 2 ? itemValue - 0.5 : itemValue
  }

  const focusItem = (target: number) => {
    const item = context.itemRefs.current.get(clamp(Math.ceil(target), 1, max))
    item?.focus()
  }

  return (
    <button
      ref={(node) => {
        if (node) context.itemRefs.current.set(itemValue, node)
        else context.itemRefs.current.delete(itemValue)
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      type="button"
      role="radio"
      data-slot="rating-item"
      data-state={state}
      aria-checked={checked}
      aria-label={
        step < 1 && checked && value % 1 !== 0
          ? `${value} of ${max}`
          : `${itemValue} of ${max}`
      }
      aria-posinset={itemValue}
      aria-setsize={max}
      tabIndex={tabStop ? 0 : -1}
      disabled={context.disabled}
      aria-readonly={context.readOnly || undefined}
      className={cn(
        "group/rating-item relative inline-flex shrink-0 items-center justify-center rounded-sm outline-none transition-transform motion-reduce:transition-none",
        "group-data-[size=sm]/rating:size-4 group-data-[size=default]/rating:size-5 group-data-[size=lg]/rating:size-7",
        "focus-visible:ring-3 focus-visible:ring-focus-ring",
        "not-disabled:not-aria-readonly:cursor-pointer not-disabled:not-aria-readonly:hover:scale-110 motion-reduce:hover:scale-100",
        "disabled:cursor-not-allowed",
        "[&_svg]:pointer-events-none [&_svg]:size-full [&_svg]:shrink-0",
        className
      )}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (event.pointerType === "mouse") {
          context.setHoverValue(pointerValue(event))
        }
      }}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const next = pointerValue(event)
        context.setValue(context.clearable && next === value ? 0 : next)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
        const forward = rtl ? "ArrowLeft" : "ArrowRight"
        const backward = rtl ? "ArrowRight" : "ArrowLeft"
        let next: number | null = null

        if (event.key === forward || event.key === "ArrowUp") {
          next = value + step
        } else if (event.key === backward || event.key === "ArrowDown") {
          next = value - step
        } else if (event.key === "Home") {
          next = context.clearable ? 0 : step
        } else if (event.key === "End") {
          next = max
        } else if (event.key === " " || event.key === "Enter") {
          event.preventDefault()
          context.setValue(
            context.clearable && value === itemValue ? 0 : itemValue
          )
          return
        }

        if (next === null) return
        event.preventDefault()
        const floor = context.clearable ? 0 : step
        const clamped = clamp(next, floor, max)
        context.setValue(clamped)
        focusItem(clamped || 1)
      }}
      {...props}
    >
      {typeof children === "function" ? (
        children(state)
      ) : children ? (
        children
      ) : (
        <>
          <StarIcon
            aria-hidden="true"
            className="text-track fill-current"
          />
          <StarIcon
            aria-hidden="true"
            className="inset-0 absolute fill-current group-data-[state=empty]/rating-item:hidden group-data-[state=half]/rating-item:[clip-path:inset(0_50%_0_0)] rtl:group-data-[state=half]/rating-item:[clip-path:inset(0_0_0_50%)]"
          />
        </>
      )}
    </button>
  )
}

export { Rating, RatingItem }
export type { RatingProps }
