"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type TargetAndTransition,
} from "motion/react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

type ExpandableContextValue = {
  open: boolean
  toggle: () => void
}

const ExpandableContext = React.createContext<ExpandableContextValue | null>(
  null
)

function useExpandable() {
  const context = React.useContext(ExpandableContext)
  if (!context) {
    throw new Error("Expandable parts must be used within <Expandable>.")
  }
  return context
}

type ExpandableProps = React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  asChild?: boolean
}

/**
 * A surface that grows in place. The root only owns the open state and puts it
 * in the DOM as `data-state`, so its own size can follow with plain CSS —
 * `w-80 data-[state=open]:w-96` — while `ExpandableContent` springs its
 * height open.
 */
function Expandable({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  asChild = false,
  className,
  ...props
}: ExpandableProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const context = React.useMemo(
    () => ({
      open,
      toggle: () => {
        if (openProp === undefined) setUncontrolledOpen(!open)
        onOpenChange?.(!open)
      },
    }),
    [onOpenChange, open, openProp]
  )

  const Comp = asChild ? Slot.Root : "div"

  return (
    <ExpandableContext.Provider value={context}>
      <Comp
        data-slot="expandable"
        data-state={open ? "open" : "closed"}
        className={cn("group/expandable", className)}
        {...props}
      />
    </ExpandableContext.Provider>
  )
}

function ExpandableTrigger({
  asChild = false,
  className,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const { open, toggle } = useExpandable()
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-slot="expandable-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      className={cn("cursor-pointer outline-none", className)}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) toggle()
      }}
      {...props}
    />
  )
}

const presets = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  blur: {
    hidden: { opacity: 0, filter: "blur(6px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  "slide-up": { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } },
  "slide-down": {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
} satisfies Record<
  string,
  { hidden: TargetAndTransition; visible: TargetAndTransition }
>

type ExpandablePreset = keyof typeof presets

type ExpandableContentProps = Omit<
  HTMLMotionProps<"div">,
  "children" | "initial" | "animate" | "exit"
> & {
  children?: React.ReactNode
  /** How the revealed content itself enters, on top of the height spring. */
  preset?: ExpandablePreset
  /** Reveal direct children one after another. */
  stagger?: boolean
  /** Seconds between staggered children. */
  staggerDelay?: number
}

const heightSpring = { type: "spring", bounce: 0.15, duration: 0.45 } as const

function ExpandableContent({
  preset = "fade",
  stagger = false,
  staggerDelay = 0.06,
  className,
  children,
  ...props
}: ExpandableContentProps) {
  const { open } = useExpandable()
  const reduceMotion = useReducedMotion()
  const variants = presets[preset]

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="content"
          data-slot="expandable-content"
          className={cn("overflow-hidden", className)}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={reduceMotion ? { duration: 0 } : heightSpring}
          {...props}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: stagger ? {} : variants.hidden,
              visible: stagger
                ? { transition: { staggerChildren: staggerDelay } }
                : variants.visible,
            }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
          >
            {stagger
              ? React.Children.map(children, (child) =>
                  child == null || child === false ? null : (
                    <motion.div
                      variants={variants}
                      transition={
                        reduceMotion ? { duration: 0 } : { duration: 0.25 }
                      }
                    >
                      {child}
                    </motion.div>
                  )
                )
              : children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export { Expandable, ExpandableContent, ExpandableTrigger, useExpandable }
export type { ExpandableContentProps, ExpandablePreset, ExpandableProps }
