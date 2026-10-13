"use client"

// Adapted from Smooth UI "Button Copy" (MIT, © 2024 Eduardo Calvo) — https://github.com/educlopez/smoothui/tree/main/packages/smoothui/components/button-copy
import * as React from "react"
import { CheckIcon, CopyIcon, XIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CopyState = "idle" | "copied" | "error"

const ICON_TRANSITION = { type: "spring", bounce: 0, duration: 0.3 } as const

/**
 * Copies `value` to the clipboard and confirms it: the icon morphs into a
 * check, the tooltip says so, and a polite live region announces it. With
 * `onCopy` the copying is yours — return a promise and a rejection shows the
 * error state instead.
 */
function CopyButton({
  value,
  onCopy,
  timeout = 2000,
  label = "Copy",
  copiedLabel = "Copied",
  errorLabel = "Copy failed",
  tooltip = true,
  variant = "ghost",
  size = "icon-sm",
  onClick,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "value" | "onCopy"> & {
  /** Text written to the clipboard. */
  value?: string
  /** Runs after `value` is written, or does the copying when there is no `value`. */
  onCopy?: () => void | Promise<void>
  /** How long the copied state lasts, in ms. */
  timeout?: number
  label?: string
  copiedLabel?: string
  errorLabel?: string
  /** Show the label in a tooltip. Icon-only buttons should keep it. */
  tooltip?: boolean
}) {
  const [state, setState] = React.useState<CopyState>("idle")
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    if (state === "idle") return
    const timer = setTimeout(() => setState("idle"), timeout)
    return () => clearTimeout(timer)
  }, [state, timeout])

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return
    try {
      if (value !== undefined) await navigator.clipboard.writeText(value)
      await onCopy?.()
      setState("copied")
    } catch {
      setState("error")
    }
  }

  const text =
    state === "copied" ? copiedLabel : state === "error" ? errorLabel : label

  const button = (
    <Button
      data-slot="copy-button"
      data-copy-state={state}
      variant={variant}
      size={size}
      aria-label={children ? undefined : text}
      onClick={handleClick}
      {...props}
    >
      <span
        data-slot="copy-button-icon"
        data-icon={children ? "inline-start" : undefined}
        className="relative grid place-items-center *:[grid-area:1/1]"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={state}
            className="grid place-items-center"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.4, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.4, filter: "blur(4px)" }
            }
            transition={reduceMotion ? { duration: 0 } : ICON_TRANSITION}
          >
            {state === "copied" ? (
              <CheckIcon />
            ) : state === "error" ? (
              <XIcon />
            ) : (
              <CopyIcon />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      {children}
    </Button>
  )

  // Announced from outside the button, so it never becomes part of its name.
  const status = (
    <span aria-live="polite" className="sr-only">
      {state === "idle" ? "" : text}
    </span>
  )

  if (!tooltip) {
    return (
      <>
        {button}
        {status}
      </>
    )
  }

  return (
    <>
      <Tooltip
        open={tooltipOpen || state !== "idle"}
        onOpenChange={setTooltipOpen}
      >
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
      {status}
    </>
  )
}

export { CopyButton }
