"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

function TerminalWindow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-window"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg",
        className
      )}
      {...props}
    />
  )
}

/** The title bar. Its children are the centered window title. */
function TerminalWindowHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-window-header"
      className={cn(
        "relative flex h-10 shrink-0 items-center border-b bg-muted px-3.5",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="flex gap-2">
        <span className="size-3 rounded-full bg-danger-primary" />
        <span className="size-3 rounded-full bg-warning-primary" />
        <span className="size-3 rounded-full bg-success-primary" />
      </span>
      <span
        data-slot="terminal-window-title"
        className="inset-x-20 font-medium pointer-events-none absolute truncate text-center text-xs text-muted-foreground"
      >
        {children}
      </span>
    </div>
  )
}

function TerminalWindowBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="terminal-window-body"
      className={cn(
        "min-h-0 p-4 leading-6 grow overflow-auto font-mono text-[13px]",
        className
      )}
      {...props}
    />
  )
}

const terminalLineVariants = cva("group/terminal-line gap-2 flex min-w-0", {
  variants: {
    variant: {
      command: "text-foreground",
      output: "text-muted-foreground",
      success: "text-success-foreground",
      warning: "text-warning-foreground",
      error: "text-danger-foreground",
    },
  },
  defaultVariants: {
    variant: "command",
  },
})

/**
 * One line of the session. A `command` line leads with the prompt; every other
 * variant is output and keeps the prompt out of the DOM's visible flow.
 */
function TerminalLine({
  className,
  variant = "command",
  prompt = "$",
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof terminalLineVariants> & {
    prompt?: React.ReactNode
  }) {
  return (
    <div
      data-slot="terminal-line"
      data-variant={variant}
      className={cn(terminalLineVariants({ variant, className }))}
      {...props}
    >
      <span
        data-slot="terminal-line-prompt"
        aria-hidden="true"
        className="hidden shrink-0 text-brand select-none group-data-[variant=command]/terminal-line:inline"
      >
        {prompt}
      </span>
      <span className="min-w-0 break-words whitespace-pre-wrap">{children}</span>
    </div>
  )
}

/**
 * Types its text out once it scrolls into view. The full string is laid out
 * invisibly underneath, so the line never reflows while it types, and screen
 * readers get the whole command at once. Reduced motion shows it complete.
 */
function TerminalTyping({
  className,
  children,
  delay = 0,
  speed = 45,
  onComplete,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  children: string
  /** Milliseconds to wait after the line enters the viewport. */
  delay?: number
  /** Milliseconds per character. */
  speed?: number
  onComplete?: () => void
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(0)
  const typed = useTransform(count, (value) =>
    children.slice(0, Math.round(value))
  )
  const [done, setDone] = React.useState(false)
  const onCompleteRef = React.useRef(onComplete)
  onCompleteRef.current = onComplete

  React.useEffect(() => {
    if (reduceMotion) {
      count.set(children.length)
      setDone(true)
      onCompleteRef.current?.()
      return
    }
    if (!inView) return

    count.set(0)
    setDone(false)
    const controls = animate(count, children.length, {
      duration: (children.length * speed) / 1000,
      delay: delay / 1000,
      ease: "linear",
      onComplete: () => {
        setDone(true)
        onCompleteRef.current?.()
      },
    })
    return () => controls.stop()
  }, [children, count, delay, inView, reduceMotion, speed])

  return (
    <span
      ref={ref}
      data-slot="terminal-typing"
      data-state={done ? "done" : "typing"}
      className={cn("group/terminal-typing inline-grid", className)}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="invisible [grid-area:1/1]">
        {children}
      </span>
      <span aria-hidden="true" className="[grid-area:1/1]">
        <motion.span>{typed}</motion.span>
        <motion.span
          data-slot="terminal-typing-caret"
          className="ml-px h-[1.15em] w-[0.6em] inline-block translate-y-[0.2em] bg-foreground/70 group-data-[state=done]/terminal-typing:hidden"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 1,
            times: [0, 0.5, 0.5, 1],
            repeat: Infinity,
          }}
        />
      </span>
    </span>
  )
}

export {
  TerminalWindow,
  TerminalWindowHeader,
  TerminalWindowBody,
  TerminalLine,
  TerminalTyping,
  terminalLineVariants,
}
