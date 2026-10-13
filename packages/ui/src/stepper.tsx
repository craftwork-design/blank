// Based on Origin UI stepper (https://github.com/cosscom/coss/blob/0ac96b5353780c19d3122a86cac67ef0551f33ce/apps/origin/registry/default/ui/stepper.tsx)
// Copyright (c) 2025 coss.com, originally Copyright (c) 2025 Origin UI.
// Licensed under MIT (apps/origin/LICENSE.md). Modified for Blank.
"use client"

import * as React from "react"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

type StepState = "active" | "completed" | "inactive"

type StepperContextValue = {
  activeStep: number
  setActiveStep: (step: number) => void
  orientation: "horizontal" | "vertical"
  /** The step whose trigger is in the tab order. */
  tabStop: number
  registerStep: (step: number) => () => void
}

type StepperItemContextValue = {
  step: number
  state: StepState
  disabled: boolean
  loading: boolean
}

const StepperContext = React.createContext<StepperContextValue | null>(null)
const StepperItemContext = React.createContext<StepperItemContextValue | null>(
  null
)

function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) throw new Error("useStepper must be used within <Stepper>")
  return context
}

function useStepperItem() {
  const context = React.useContext(StepperItemContext)
  if (!context) {
    throw new Error("Stepper parts must be used within <StepperItem>")
  }
  return context
}

type StepperProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** The active step, counted from 1. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
}

function Stepper({
  value,
  defaultValue = 1,
  onValueChange,
  orientation = "horizontal",
  className,
  onKeyDown,
  ...props
}: StepperProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const activeStep = value ?? uncontrolled

  const setActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) setUncontrolled(step)
      onValueChange?.(step)
    },
    [value, onValueChange]
  )

  // Items register their step so the tab stop survives an active step past
  // the last one (a finished flow) or before the first.
  const [steps, setSteps] = React.useState<number[]>([])
  const registerStep = React.useCallback((step: number) => {
    setSteps((current) =>
      current.includes(step) ? current : [...current, step]
    )
    return () => setSteps((current) => current.filter((item) => item !== step))
  }, [])
  const tabStop =
    steps.length === 0 || steps.includes(activeStep)
      ? activeStep
      : activeStep > Math.max(...steps)
        ? Math.max(...steps)
        : Math.min(...steps)

  const context = React.useMemo(
    () => ({ activeStep, setActiveStep, orientation, tabStop, registerStep }),
    [activeStep, setActiveStep, orientation, tabStop, registerStep]
  )

  return (
    <StepperContext.Provider value={context}>
      <div
        data-slot="stepper"
        data-orientation={orientation}
        aria-orientation={orientation}
        className={cn(
          "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          const target = event.target as HTMLElement
          if (target.getAttribute("data-slot") !== "stepper-trigger") return

          const horizontal = orientation === "horizontal"
          const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
          const next = horizontal ? (rtl ? "ArrowLeft" : "ArrowRight") : "ArrowDown"
          const prev = horizontal ? (rtl ? "ArrowRight" : "ArrowLeft") : "ArrowUp"
          if (![next, prev, "Home", "End"].includes(event.key)) return

          // Roving focus between triggers; Enter or Space activates a step.
          const triggers = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "[data-slot=stepper-trigger]:not(:disabled)"
            )
          )
          const index = triggers.indexOf(target)
          const destination =
            event.key === "Home"
              ? triggers[0]
              : event.key === "End"
                ? triggers[triggers.length - 1]
                : triggers[index + (event.key === next ? 1 : -1)]
          if (!destination) return
          event.preventDefault()
          destination.focus()
        }}
        {...props}
      />
    </StepperContext.Provider>
  )
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  step: number
  /** Mark the step done even when it is not behind the active one. */
  completed?: boolean
  disabled?: boolean
  /** Show a spinner in the indicator while the step is active. */
  loading?: boolean
}) {
  const { activeStep, registerStep } = useStepper()
  React.useEffect(() => registerStep(step), [registerStep, step])
  const state: StepState =
    completed || step < activeStep
      ? "completed"
      : step === activeStep
        ? "active"
        : "inactive"
  const isLoading = loading && step === activeStep

  return (
    <StepperItemContext.Provider
      value={{ step, state, disabled, loading: isLoading }}
    >
      <div
        data-slot="stepper-item"
        data-state={state}
        data-disabled={disabled || undefined}
        data-loading={isLoading || undefined}
        className={cn(
          "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </StepperItemContext.Provider>
  )
}

function StepperTrigger({
  asChild = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { tabStop, setActiveStep } = useStepper()
  const { step, state, disabled } = useStepperItem()
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      type="button"
      data-slot="stepper-trigger"
      data-state={state}
      aria-current={state === "active" ? "step" : undefined}
      tabIndex={step === tabStop ? 0 : -1}
      disabled={disabled}
      className={cn(
        "gap-3 inline-flex items-center rounded-full text-left outline-none focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) setActiveStep(step)
      }}
      {...props}
    />
  )
}

function StepperIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { state, step, loading } = useStepperItem()

  return (
    <span
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        "size-7 text-xs font-medium relative flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground tabular-nums transition-colors",
        "data-[state=active]:bg-brand data-[state=active]:text-brand-foreground data-[state=active]:ring-4 data-[state=active]:ring-item-selected",
        "data-[state=completed]:bg-brand data-[state=completed]:text-brand-foreground",
        "group-data-disabled/step:opacity-50",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="transition-[opacity,scale] group-data-loading/step:scale-0 group-data-loading/step:opacity-0 group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0 motion-reduce:transition-none">
            {step}
          </span>
          <CheckIcon
            aria-hidden="true"
            className="size-4 absolute scale-0 opacity-0 transition-[opacity,scale] group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100 motion-reduce:transition-none"
          />
          {loading && (
            <LoaderCircleIcon
              aria-hidden="true"
              className="size-4 absolute animate-spin motion-reduce:animate-none"
            />
          )}
        </>
      )}
    </span>
  )
}

function StepperTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="stepper-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function StepperDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="stepper-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="stepper-separator"
      className={cn(
        "m-0.5 rounded-full bg-border transition-colors group-data-[state=completed]/step:bg-brand",
        "group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1",
        "group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5",
        className
      )}
      {...props}
    />
  )
}

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  useStepper,
}
export type { StepperProps, StepState }
