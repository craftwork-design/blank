// Based on Dice UI time-picker (https://github.com/sadmann7/diceui/blob/ea7c91f8c17689f84b928f513de4404784e89792/docs/registry/bases/radix/ui/time-picker.tsx)
// Copyright (c) 2024 Sadman Sakib. Licensed under MIT. Modified for Blank:
// reduced to the segmented input, with segments as spin buttons.
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type TimePickerSegmentType = "hour" | "minute" | "second" | "period"
type Period = "AM" | "PM"

type Segments = {
  hour: number | null
  minute: number | null
  second: number | null
  period: Period | null
}

const EMPTY: Segments = { hour: null, minute: null, second: null, period: null }

const LABELS: Record<TimePickerSegmentType, string> = {
  hour: "Hours",
  minute: "Minutes",
  second: "Seconds",
  period: "AM/PM",
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

function parseValue(value: string | undefined, hourCycle: 12 | 24): Segments {
  const match = value?.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return EMPTY
  const hour24 = Math.min(Number(match[1]), 23)
  return {
    hour: hourCycle === 12 ? hour24 % 12 || 12 : hour24,
    minute: Math.min(Number(match[2]), 59),
    second: match[3] ? Math.min(Number(match[3]), 59) : 0,
    period: hour24 >= 12 ? "PM" : "AM",
  }
}

function formatValue(
  segments: Segments,
  hourCycle: 12 | 24,
  withSeconds: boolean
) {
  const { hour, minute, second, period } = segments
  if (hour === null || minute === null) return ""
  if (withSeconds && second === null) return ""
  if (hourCycle === 12 && period === null) return ""
  const hour24 =
    hourCycle === 12 ? (hour % 12) + (period === "PM" ? 12 : 0) : hour
  return withSeconds
    ? `${pad(hour24)}:${pad(minute)}:${pad(second ?? 0)}`
    : `${pad(hour24)}:${pad(minute)}`
}

type TimePickerContextValue = {
  segments: Segments
  setSegment: <K extends keyof Segments>(key: K, value: Segments[K]) => void
  hourCycle: 12 | 24
  minuteStep: number
  disabled: boolean
  readOnly: boolean
  firstSegmentId?: string
  typing: React.RefObject<{ segment: TimePickerSegmentType | null; digits: string }>
}

const TimePickerContext = React.createContext<TimePickerContextValue | null>(
  null
)

function useTimePicker(part: string) {
  const context = React.useContext(TimePickerContext)
  if (!context) throw new Error(`${part} must be used within <TimePicker>`)
  return context
}

type TimePickerProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> & {
  /** 24-hour `HH:mm` or `HH:mm:ss`, like a native time input; `""` when empty. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Display 12-hour time with an AM/PM segment. The value stays 24-hour. */
  hourCycle?: 12 | 24
  /** Add a seconds segment. */
  granularity?: "minute" | "second"
  /** How far the arrow keys move minutes and seconds. */
  minuteStep?: number
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Submits the value in a hidden input under this name. */
  name?: string
  size?: "default" | "sm"
}

function TimePicker({
  value: valueProp,
  defaultValue,
  onValueChange,
  hourCycle = 24,
  granularity = "minute",
  minuteStep = 1,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  size = "default",
  id,
  className,
  children,
  ...props
}: TimePickerProps) {
  const withSeconds = granularity === "second"
  const [segments, setSegments] = React.useState<Segments>(() =>
    parseValue(valueProp ?? defaultValue, hourCycle)
  )
  const typing = React.useRef<{
    segment: TimePickerSegmentType | null
    digits: string
  }>({ segment: null, digits: "" })

  const value = formatValue(segments, hourCycle, withSeconds)
  const lastEmitted = React.useRef(value)

  // A controlled value that changed from outside replaces every segment.
  React.useEffect(() => {
    if (valueProp === undefined || valueProp === lastEmitted.current) return
    lastEmitted.current = valueProp
    setSegments(parseValue(valueProp, hourCycle))
  }, [valueProp, hourCycle])

  const segmentsRef = React.useRef(segments)
  segmentsRef.current = segments

  const setSegment = React.useCallback(
    <K extends keyof Segments>(key: K, next: Segments[K]) => {
      const updated = { ...segmentsRef.current, [key]: next }
      // A 12-hour time needs a period; assume AM until one is picked.
      if (hourCycle === 12 && key === "hour" && next !== null) {
        updated.period ??= "AM"
      }
      segmentsRef.current = updated
      setSegments(updated)
      const nextValue = formatValue(updated, hourCycle, withSeconds)
      if (nextValue !== lastEmitted.current) {
        lastEmitted.current = nextValue
        onValueChange?.(nextValue)
      }
    },
    [hourCycle, withSeconds, onValueChange]
  )

  const context = React.useMemo<TimePickerContextValue>(
    () => ({
      segments,
      setSegment,
      hourCycle,
      minuteStep,
      disabled,
      readOnly,
      firstSegmentId: id,
      typing,
    }),
    [segments, setSegment, hourCycle, minuteStep, disabled, readOnly, id]
  )

  return (
    <TimePickerContext.Provider value={context}>
      <div
        role="group"
        data-slot="time-picker"
        data-size={size}
        data-disabled={disabled || undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          "group/time-picker w-fit gap-0.5 text-sm inline-flex items-center border border-input bg-input-field text-foreground tabular-nums shadow-field transition-colors",
          "data-[size=default]:h-10 data-[size=default]:rounded-xl data-[size=default]:px-2.5",
          "data-[size=sm]:h-8 data-[size=sm]:rounded-lg data-[size=sm]:px-2",
          "hover:border-input-hover",
          "has-[[data-slot=time-picker-segment]:focus-visible]:border-ring has-[[data-slot=time-picker-segment]:focus-visible]:ring-3 has-[[data-slot=time-picker-segment]:focus-visible]:ring-focus-ring",
          "aria-invalid:border-danger-input aria-invalid:has-[[data-slot=time-picker-segment]:focus-visible]:border-destructive aria-invalid:has-[[data-slot=time-picker-segment]:focus-visible]:ring-error-ring",
          "data-disabled:cursor-not-allowed data-disabled:border-border data-disabled:bg-input-disabled data-disabled:text-muted-foreground data-disabled:shadow-none",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <TimePickerSegment segment="hour" />
            <TimePickerSeparator />
            <TimePickerSegment segment="minute" />
            {withSeconds && (
              <>
                <TimePickerSeparator />
                <TimePickerSegment segment="second" />
              </>
            )}
            {hourCycle === 12 && (
              <TimePickerSegment segment="period" className="ml-1" />
            )}
          </>
        )}
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
    </TimePickerContext.Provider>
  )
}

function rangeOf(segment: TimePickerSegmentType, hourCycle: 12 | 24) {
  if (segment === "hour") return hourCycle === 12 ? [1, 12] : [0, 23]
  if (segment === "period") return [0, 1]
  return [0, 59]
}

function moveFocus(from: HTMLElement, direction: 1 | -1) {
  const group = from.closest("[data-slot=time-picker]")
  if (!group) return
  const segments = Array.from(
    group.querySelectorAll<HTMLInputElement>(
      "[data-slot=time-picker-segment]:not(:disabled)"
    )
  )
  segments[segments.indexOf(from as HTMLInputElement) + direction]?.focus()
}

function TimePickerSegment({
  segment,
  className,
  id,
  onKeyDown,
  onFocus,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "defaultValue"> & {
  segment: TimePickerSegmentType
}) {
  const {
    segments,
    setSegment,
    hourCycle,
    minuteStep,
    disabled,
    readOnly,
    firstSegmentId,
    typing,
  } = useTimePicker("TimePickerSegment")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [min, max] = rangeOf(segment, hourCycle)
  const current = segments[segment]
  const isPeriod = segment === "period"
  const empty = current === null

  const display = empty
    ? "––"
    : isPeriod
      ? String(current)
      : pad(current as number)

  // The whole segment stays selected, the way native date fields behave.
  React.useLayoutEffect(() => {
    const input = inputRef.current
    if (input && document.activeElement === input) input.select()
  }, [display])

  const typeDigit = (digit: number, input: HTMLInputElement) => {
    const buffer =
      typing.current.segment === segment
        ? typing.current.digits + digit
        : String(digit)
    let number = Number(buffer)

    if (buffer.length === 2 && (number > max || number < min)) {
      // Two digits that make no sense start over from the second one.
      number = digit
      typing.current = { segment, digits: String(digit) }
    } else {
      typing.current = { segment, digits: buffer }
    }

    const digits = typing.current.digits
    if (number >= min && number <= max) setSegment(segment, number as never)
    else if (digits.length === 1) setSegment(segment, null as never)

    // Advance once no further digit could keep the number in range.
    if (digits.length === 2 || Number(digits) * 10 > max) {
      typing.current = { segment: null, digits: "" }
      moveFocus(input, 1)
    }
  }

  const step = (direction: 1 | -1) => {
    if (isPeriod) {
      setSegment("period", current === "PM" ? "AM" : "PM")
      return
    }
    const size = segment === "hour" ? 1 : minuteStep
    if (current === null) {
      setSegment(segment, (direction === 1 ? min : max) as never)
      return
    }
    const span = max - min + 1
    const value = current as number
    // Snap to the step grid first, then wrap around the range.
    const snapped =
      direction === 1
        ? Math.floor((value - min) / size) * size + size
        : Math.ceil((value - min) / size) * size - size
    setSegment(segment, ((((snapped % span) + span) % span) + min) as never)
  }

  return (
    <input
      ref={inputRef}
      id={id ?? (segment === "hour" ? firstSegmentId : undefined)}
      type="text"
      role="spinbutton"
      inputMode={isPeriod ? "text" : "numeric"}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      enterKeyHint="next"
      data-slot="time-picker-segment"
      data-segment={segment}
      data-placeholder={empty || undefined}
      aria-label={LABELS[segment]}
      aria-valuemin={isPeriod ? undefined : min}
      aria-valuemax={isPeriod ? undefined : max}
      aria-valuenow={isPeriod || empty ? undefined : (current as number)}
      aria-valuetext={empty ? "Empty" : display}
      aria-readonly={readOnly || undefined}
      disabled={disabled}
      readOnly={readOnly}
      value={display}
      className={cn(
        "h-6 px-0.5 rounded-sm text-center tabular-nums caret-transparent outline-none selection:bg-transparent",
        "w-[calc(2ch+0.25rem)] data-[segment=period]:w-[calc(2.6ch+0.25rem)]",
        "data-placeholder:text-muted-foreground",
        "focus:bg-item-selected focus:text-brand",
        "disabled:cursor-not-allowed",
        className
      )}
      onFocus={(event) => {
        onFocus?.(event)
        typing.current = { segment: null, digits: "" }
        event.currentTarget.select()
      }}
      onMouseUp={(event) => {
        event.preventDefault()
        event.currentTarget.select()
      }}
      onChange={(event) => {
        onChange?.(event)
        // Virtual keyboards report keys as "Unidentified", so read the text.
        if (readOnly) return
        const typed = event.target.value.slice(-1)
        if (isPeriod) {
          if (/a/i.test(typed)) setSegment("period", "AM")
          else if (/p/i.test(typed)) setSegment("period", "PM")
        } else if (/\d/.test(typed)) {
          typeDigit(Number(typed), event.currentTarget)
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const input = event.currentTarget

        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault()
            moveFocus(input, -1)
            return
          case "ArrowRight":
            event.preventDefault()
            moveFocus(input, 1)
            return
          case ":":
          case ".":
          case " ":
            event.preventDefault()
            moveFocus(input, 1)
            return
        }

        if (readOnly || event.metaKey || event.ctrlKey || event.altKey) return

        switch (event.key) {
          case "ArrowUp":
          case "ArrowDown":
            event.preventDefault()
            typing.current = { segment: null, digits: "" }
            step(event.key === "ArrowUp" ? 1 : -1)
            return
          case "Home":
          case "End":
            if (isPeriod) return
            event.preventDefault()
            setSegment(segment, (event.key === "Home" ? min : max) as never)
            return
          case "Backspace":
          case "Delete":
            event.preventDefault()
            typing.current = { segment: null, digits: "" }
            if (empty && event.key === "Backspace") moveFocus(input, -1)
            else setSegment(segment, null as never)
            return
        }

        if (isPeriod && /^[ap]$/i.test(event.key)) {
          event.preventDefault()
          setSegment("period", /a/i.test(event.key) ? "AM" : "PM")
        } else if (!isPeriod && /^\d$/.test(event.key)) {
          event.preventDefault()
          typeDigit(Number(event.key), input)
        }
      }}
      {...props}
    />
  )
}

function TimePickerSeparator({
  className,
  children = ":",
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="time-picker-separator"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { TimePicker, TimePickerSegment, TimePickerSeparator }
export type { TimePickerProps, TimePickerSegmentType }
