"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type QuantityStepperContextValue = {
  value: number
  min: number
  max: number
  step: number
  disabled: boolean
  setValue: (value: number) => void
}

const QuantityStepperContext =
  React.createContext<QuantityStepperContextValue | null>(null)

function useQuantityStepper() {
  const context = React.useContext(QuantityStepperContext)
  if (!context) {
    throw new Error(
      "QuantityStepper parts must be used within <QuantityStepper>."
    )
  }
  return context
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const quantityStepperVariants = cva(
  [
    "group/quantity-stepper inline-flex w-fit shrink-0 items-center overflow-hidden border transition-[color,box-shadow,border-color]",
    "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-focus-ring",
    "data-[disabled=true]:opacity-50",
  ],
  {
    variants: {
      variant: {
        secondary: "border-transparent bg-item-secondary",
        outline: "shadow-xs border-border bg-item-outline",
      },
      size: {
        sm: "h-8",
        default: "h-10",
        lg: "h-12",
      },
      shape: {
        rounded: "",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      { shape: "rounded", size: "sm", className: "rounded-lg" },
      { shape: "rounded", size: "default", className: "rounded-xl" },
      { shape: "rounded", size: "lg", className: "rounded-xl" },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "default",
      shape: "rounded",
    },
  }
)

type QuantityStepperProps = Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> &
  VariantProps<typeof quantityStepperVariants> & {
    value?: number
    defaultValue?: number
    onValueChange?: (value: number) => void
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }

function QuantityStepper({
  className,
  variant = "secondary",
  size = "default",
  shape = "rounded",
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  disabled = false,
  children,
  ...props
}: QuantityStepperProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = clamp(valueProp ?? uncontrolled, min, max)

  const setValue = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, min, max)
      if (valueProp === undefined) setUncontrolled(clamped)
      if (clamped !== value) onValueChange?.(clamped)
    },
    [max, min, onValueChange, value, valueProp]
  )

  const context = React.useMemo(
    () => ({ value, min, max, step, disabled, setValue }),
    [disabled, max, min, setValue, step, value]
  )

  return (
    <QuantityStepperContext.Provider value={context}>
      <div
        role="group"
        data-slot="quantity-stepper"
        data-variant={variant}
        data-size={size}
        data-shape={shape}
        data-disabled={disabled}
        className={cn(
          quantityStepperVariants({ variant, size, shape, className })
        )}
        {...props}
      >
        {children ?? (
          <>
            <QuantityStepperDecrement />
            <QuantityStepperInput />
            <QuantityStepperIncrement />
          </>
        )}
      </div>
    </QuantityStepperContext.Provider>
  )
}

const stepButtonClasses = [
  "flex h-full shrink-0 cursor-pointer items-center justify-center text-foreground transition-colors outline-none",
  "hover:bg-item-secondary focus-visible:bg-item-secondary-hover",
  "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50 disabled:hover:bg-transparent",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "aspect-square [&_svg:not([class*='size-'])]:size-5 group-data-[size=sm]/quantity-stepper:[&_svg:not([class*='size-'])]:size-4",
]

function QuantityStepperDecrement({
  className,
  children,
  onClick,
  "aria-label": ariaLabel = "Decrease",
  ...props
}: React.ComponentProps<"button">) {
  const { value, min, step, disabled, setValue } = useQuantityStepper()

  return (
    <button
      type="button"
      data-slot="quantity-stepper-decrement"
      aria-label={ariaLabel}
      disabled={disabled || value <= min}
      className={cn(stepButtonClasses, className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setValue(value - step)
      }}
      {...props}
    >
      {children ?? <MinusIcon />}
    </button>
  )
}

function QuantityStepperIncrement({
  className,
  children,
  onClick,
  "aria-label": ariaLabel = "Increase",
  ...props
}: React.ComponentProps<"button">) {
  const { value, max, step, disabled, setValue } = useQuantityStepper()

  return (
    <button
      type="button"
      data-slot="quantity-stepper-increment"
      aria-label={ariaLabel}
      disabled={disabled || value >= max}
      className={cn(stepButtonClasses, className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) setValue(value + step)
      }}
      {...props}
    >
      {children ?? <PlusIcon />}
    </button>
  )
}

/**
 * The value is typed into a real input: it commits on blur or Enter, and the
 * arrow keys step it — the keyboard contract of a native number field without
 * the native spinner.
 */
function QuantityStepperInput({
  className,
  "aria-label": ariaLabel = "Quantity",
  onBlur,
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "type">) {
  const { value, min, max, step, disabled, setValue } = useQuantityStepper()
  const [draft, setDraft] = React.useState<string | null>(null)

  function commit() {
    if (draft === null) return
    const parsed = Number.parseInt(draft, 10)
    setValue(Number.isNaN(parsed) ? value : parsed)
    setDraft(null)
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      role="spinbutton"
      data-slot="quantity-stepper-input"
      aria-label={ariaLabel}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={Number.isFinite(max) ? max : undefined}
      disabled={disabled}
      value={draft ?? String(value)}
      className={cn(
        "min-w-0 text-sm leading-5 font-medium h-full bg-transparent text-center text-foreground tabular-nums outline-none disabled:cursor-not-allowed",
        "group-data-[size=sm]/quantity-stepper:w-8 group-data-[size=default]/quantity-stepper:w-10 group-data-[size=lg]/quantity-stepper:w-12 group-data-[size=lg]/quantity-stepper:text-base",
        className
      )}
      onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ""))}
      onBlur={(event) => {
        commit()
        onBlur?.(event)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        if (event.key === "Enter") commit()
        if (event.key === "ArrowUp") {
          event.preventDefault()
          setDraft(null)
          setValue(value + step)
        }
        if (event.key === "ArrowDown") {
          event.preventDefault()
          setDraft(null)
          setValue(value - step)
        }
      }}
      {...props}
    />
  )
}

export {
  QuantityStepper,
  QuantityStepperDecrement,
  QuantityStepperIncrement,
  QuantityStepperInput,
  quantityStepperVariants,
  useQuantityStepper,
}
export type { QuantityStepperProps }
