"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Editor chrome on top of Radix Tabs: one tab per file, one content panel per
 * tab, so a multi-file snippet switches like the editor it imitates.
 */
function CodeWindow({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="code-window"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg",
        className
      )}
      {...props}
    />
  )
}

/** Window controls followed by the file tabs passed as children. */
function CodeWindowHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-window-header"
      className={cn(
        "h-10 gap-4 pl-3.5 flex shrink-0 items-stretch border-b bg-muted",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="gap-2 flex shrink-0 items-center">
        <span className="size-3 rounded-full bg-danger-primary" />
        <span className="size-3 rounded-full bg-warning-primary" />
        <span className="size-3 rounded-full bg-success-primary" />
      </span>
      <TabsPrimitive.List
        data-slot="code-window-tabs"
        className="-mb-px flex min-w-0 items-stretch overflow-x-auto [scrollbar-width:none]"
      >
        {children}
      </TabsPrimitive.List>
    </div>
  )
}

function CodeWindowTab({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="code-window-tab"
      className={cn(
        "gap-1.5 px-3 font-medium relative inline-flex shrink-0 items-center border-x border-transparent text-xs whitespace-nowrap text-muted-foreground transition-colors outline-none",
        "hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-inset",
        "data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:text-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function CodeWindowContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="code-window-content"
      className={cn("min-h-0 grow overflow-auto outline-none", className)}
      {...props}
    />
  )
}

/**
 * The code itself. A string child is split into numbered lines; to colour
 * tokens, compose `CodeWindowLine`s yourself and keep the numbering.
 */
function CodeWindowCode({
  className,
  lineNumbers = true,
  children,
  ...props
}: React.ComponentProps<"pre"> & {
  lineNumbers?: boolean
}) {
  return (
    <pre
      data-slot="code-window-code"
      data-line-numbers={lineNumbers}
      className={cn(
        "group/code-window-code py-4 leading-6 w-max min-w-full font-mono text-[13px] [counter-reset:line]",
        className
      )}
      {...props}
    >
      <code className="grid">
        {typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => (
                <CodeWindowLine key={index}>{line || " "}</CodeWindowLine>
              ))
          : children}
      </code>
    </pre>
  )
}

function CodeWindowLine({
  className,
  highlighted = false,
  ...props
}: React.ComponentProps<"span"> & {
  /** Tints the line, for the part of a snippet the reader should look at. */
  highlighted?: boolean
}) {
  return (
    <span
      data-slot="code-window-line"
      data-highlighted={highlighted}
      className={cn(
        "pr-6 pl-4 min-h-6 block whitespace-pre [counter-increment:line]",
        "before:mr-5 before:w-5 before:inline-block before:text-right before:text-muted-foreground/60 before:content-[counter(line)] before:select-none",
        "group-data-[line-numbers=false]/code-window-code:before:hidden",
        "data-[highlighted=true]:bg-item-selected data-[highlighted=true]:shadow-[inset_2px_0_0_var(--brand)]",
        className
      )}
      {...props}
    />
  )
}

export {
  CodeWindow,
  CodeWindowHeader,
  CodeWindowTab,
  CodeWindowContent,
  CodeWindowCode,
  CodeWindowLine,
}
