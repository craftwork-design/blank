// Based on Motion Primitives animated-background (https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/animated-background.tsx)
// Copyright (c) 2024 ibelick. Licensed under MIT. Modified for Blank.
"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"

import { cn } from "@/lib/utils"

type AnimatedBackgroundChild = React.ReactElement<
  React.HTMLAttributes<HTMLElement> & { "data-id"?: string }
>

type AnimatedBackgroundProps = {
  /** Elements that carry a unique `data-id`; anything else passes through untouched. */
  children: AnimatedBackgroundChild | AnimatedBackgroundChild[]
  /** The `data-id` the highlight sits behind. `null` hides it. */
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  /** Follow the pointer and keyboard focus instead of clicks. */
  enableHover?: boolean
  /** Classes for the highlight itself, e.g. its surface and radius. */
  className?: string
  transition?: Transition
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.15,
  duration: 0.3,
}

function AnimatedBackground({
  children,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  enableHover = false,
  className,
  transition = DEFAULT_TRANSITION,
}: AnimatedBackgroundProps) {
  const [uncontrolled, setUncontrolled] = React.useState<string | null>(
    defaultValue
  )
  const activeId = valueProp !== undefined ? valueProp : uncontrolled
  const layoutId = React.useId()
  const reduceMotion = useReducedMotion()

  const setActiveId = (id: string | null) => {
    if (valueProp === undefined) setUncontrolled(id)
    onValueChange?.(id)
  }

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const id = child.props["data-id"]
    if (id === undefined) return child
    const active = activeId === id
    const { onClick, onMouseEnter, onMouseLeave, onFocus, onBlur } =
      child.props

    const interaction = enableHover
      ? {
          onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
            onMouseEnter?.(event)
            setActiveId(id)
          },
          onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
            onMouseLeave?.(event)
            setActiveId(null)
          },
          onFocus: (event: React.FocusEvent<HTMLElement>) => {
            onFocus?.(event)
            setActiveId(id)
          },
          onBlur: (event: React.FocusEvent<HTMLElement>) => {
            onBlur?.(event)
            setActiveId(null)
          },
        }
      : {
          onClick: (event: React.MouseEvent<HTMLElement>) => {
            onClick?.(event)
            setActiveId(id)
          },
        }

    const itemProps: React.HTMLAttributes<HTMLElement> &
      Record<`data-${string}`, string> = {
      ...interaction,
      "data-slot": "animated-background-item",
      "data-active": active ? "true" : "false",
      className: cn("relative isolate", child.props.className),
    }

    return React.cloneElement(
      child,
      itemProps,
      <>
        <AnimatePresence initial={false}>
          {active && (
            <motion.span
              aria-hidden="true"
              data-slot="animated-background"
              layoutId={`animated-background-${layoutId}`}
              className={cn("inset-0 absolute -z-10", className)}
              // Reduced motion keeps the highlight but drops the slide.
              transition={reduceMotion ? { duration: 0 } : transition}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        {child.props.children}
      </>
    )
  })
}

export { AnimatedBackground }
export type { AnimatedBackgroundProps }
