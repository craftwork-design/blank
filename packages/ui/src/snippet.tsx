// Based on Kibo UI snippet (https://github.com/shadcnblocks/kibo/blob/3d63cdb15b79d972e3dc38a10997987672f9b263/packages/snippet/index.tsx)
// Copyright (c) 2023 — Present shadcnblocks. Licensed under MIT. Modified for Blank.
"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Snippet({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="snippet"
      className={cn(
        "group/snippet min-w-0 shadow-xs flex w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function SnippetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="snippet-header"
      className={cn(
        "h-10 gap-2 pr-1 pl-3 flex shrink-0 items-center justify-between border-b bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

function SnippetTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="snippet-tabs-list"
      className={cn(
        "min-w-0 gap-3 flex h-full flex-1 items-stretch overflow-x-auto [scrollbar-width:none]",
        className
      )}
      {...props}
    />
  )
}

function SnippetTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="snippet-tabs-trigger"
      className={cn(
        "gap-1.5 text-sm leading-5 font-medium relative flex shrink-0 cursor-pointer items-center whitespace-nowrap text-muted-foreground transition-colors outline-none",
        "hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:decoration-brand focus-visible:underline-offset-4",
        "data-[state=active]:text-foreground",
        "after:inset-x-0 after:bottom-0 after:h-0.5 after:absolute after:rounded-full after:bg-brand after:opacity-0 after:transition-opacity data-[state=active]:after:opacity-100",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function SnippetTabsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="snippet-tabs-content"
      className={cn(
        "px-4 py-3 font-mono text-[13px] leading-6 overflow-x-auto outline-none [scrollbar-width:thin] focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-inset",
        className
      )}
      {...props}
    >
      <code
        data-slot="snippet-code"
        className="block w-max min-w-full whitespace-pre text-foreground"
      >
        {children}
      </code>
    </TabsPrimitive.Content>
  )
}

/** Reads the command of the active tab, so one button serves every tab. */
function readActiveCommand(button: HTMLElement) {
  const code = button
    .closest("[data-slot=snippet]")
    ?.querySelector<HTMLElement>(
      "[data-slot=snippet-tabs-content][data-state=active] [data-slot=snippet-code]"
    )
  return code?.textContent ?? ""
}

function SnippetCopyButton({
  value,
  timeout = 2000,
  onCopy,
  onError,
  variant = "ghost",
  size = "icon-sm",
  className,
  onClick,
  "aria-label": ariaLabel = "Copy command",
  ...props
}: React.ComponentProps<typeof Button> & {
  /** Text to copy. Defaults to the command in the active tab. */
  value?: string
  /** How long the check mark stays, in milliseconds. */
  timeout?: number
  onCopy?: (value: string) => void
  onError?: (error: unknown) => void
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), timeout)
    return () => window.clearTimeout(timer)
  }, [copied, timeout])

  return (
    <Button
      type="button"
      data-slot="snippet-copy-button"
      data-copied={copied}
      variant={variant}
      size={size}
      aria-label={copied ? "Copied" : ariaLabel}
      className={cn("group/snippet-copy relative shrink-0", className)}
      onClick={async (event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const text = value ?? readActiveCommand(event.currentTarget)
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          onCopy?.(text)
        } catch (error) {
          setCopied(false)
          onError?.(error)
        }
      }}
      {...props}
    >
      <CopyIcon className="transition-[opacity,scale] duration-200 group-data-[copied=true]/snippet-copy:scale-50 group-data-[copied=true]/snippet-copy:opacity-0 motion-reduce:transition-none" />
      <CheckIcon className="absolute scale-50 text-success-foreground opacity-0 transition-[opacity,scale] duration-200 group-data-[copied=true]/snippet-copy:scale-100 group-data-[copied=true]/snippet-copy:opacity-100 motion-reduce:transition-none" />
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </Button>
  )
}

export {
  Snippet,
  SnippetCopyButton,
  SnippetHeader,
  SnippetTabsContent,
  SnippetTabsList,
  SnippetTabsTrigger,
}
