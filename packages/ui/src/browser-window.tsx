import * as React from "react"
import { LockIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type BrowserWindowVariant = "default" | "inset"

/**
 * `default` puts the page flush under the toolbar, like a real window. `inset`
 * floats it in a rounded frame, which reads better as a marketing visual where
 * the chrome is decoration rather than the subject.
 */
function BrowserWindow({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: BrowserWindowVariant }) {
  return (
    <div
      data-slot="browser-window"
      data-variant={variant}
      className={cn(
        "group/browser-window min-w-0 shadow-lg flex w-full flex-col overflow-hidden rounded-xl border bg-muted text-foreground",
        className
      )}
      {...props}
    />
  )
}

function BrowserWindowHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="browser-window-header"
      className={cn(
        "h-11 gap-3 px-3.5 grid shrink-0 grid-cols-[1fr_minmax(0,auto)_1fr] items-center",
        "group-data-[variant=default]/browser-window:border-b",
        className
      )}
      {...props}
    />
  )
}

/** The three window buttons. Neutral at rest, they take color while the window is hovered. */
function BrowserWindowControls({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="browser-window-controls"
      aria-hidden="true"
      className={cn("gap-1.5 flex items-center justify-self-start", className)}
      {...props}
    >
      <span className="size-3 rounded-full bg-muted-foreground/25 transition-colors group-hover/browser-window:bg-danger-primary" />
      <span className="size-3 rounded-full bg-muted-foreground/25 transition-colors group-hover/browser-window:bg-warning-primary" />
      <span className="size-3 rounded-full bg-muted-foreground/25 transition-colors group-hover/browser-window:bg-success-primary" />
    </div>
  )
}

function BrowserWindowAddress({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="browser-window-address"
      className={cn(
        "h-7 min-w-0 gap-1.5 px-3 text-xs leading-4 font-medium max-w-72 shadow-xs sm:w-72 flex w-full items-center justify-center justify-self-center rounded-lg bg-background text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-3 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <LockIcon aria-hidden="true" />
      <span className="truncate">{children}</span>
    </div>
  )
}

function BrowserWindowActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="browser-window-actions"
      className={cn(
        "gap-1 [&_svg:not([class*='size-'])]:size-4 flex items-center justify-self-end text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function BrowserWindowContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="browser-window-content"
      className={cn(
        "min-h-0 relative flex-auto overflow-hidden bg-background",
        "group-data-[variant=inset]/browser-window:mx-2 group-data-[variant=inset]/browser-window:mb-2 group-data-[variant=inset]/browser-window:shadow-xs group-data-[variant=inset]/browser-window:rounded-lg group-data-[variant=inset]/browser-window:border",
        className
      )}
      {...props}
    />
  )
}

export {
  BrowserWindow,
  BrowserWindowActions,
  BrowserWindowAddress,
  BrowserWindowContent,
  BrowserWindowControls,
  BrowserWindowHeader,
}
export type { BrowserWindowVariant }
