"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs gap-2 flex data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  [
    "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground",
    "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  ],
  {
    variants: {
      variant: {
        fill: "gap-1 bg-transparent",
        line: "gap-1 rounded-none bg-transparent",
        segmented: "p-0.5 bg-item-secondary",
      },
      size: {
        sm: "group-data-[orientation=horizontal]/tabs:h-8",
        default: "group-data-[orientation=horizontal]/tabs:h-10",
        lg: "group-data-[orientation=horizontal]/tabs:h-12",
      },
      shape: {
        rounded: "",
        pill: "rounded-full",
      },
    },
    // Trigger radius lives here because it depends on variant x size x shape at once;
    // stacked `group-data-*` variants would resolve to nested ancestors, not one element.
    compoundVariants: [
      {
        variant: "segmented",
        shape: "rounded",
        size: "sm",
        className: "rounded-lg",
      },
      {
        variant: "segmented",
        shape: "rounded",
        size: "default",
        className: "rounded-xl",
      },
      {
        variant: "segmented",
        shape: "rounded",
        size: "lg",
        className: "rounded-xl",
      },
      {
        variant: "fill",
        shape: "rounded",
        size: "sm",
        className: "[&>[data-slot=tabs-trigger]]:rounded-lg",
      },
      {
        variant: "fill",
        shape: "rounded",
        size: "default",
        className: "[&>[data-slot=tabs-trigger]]:rounded-xl",
      },
      {
        variant: "fill",
        shape: "rounded",
        size: "lg",
        className: "[&>[data-slot=tabs-trigger]]:rounded-xl",
      },
      {
        variant: "segmented",
        shape: "rounded",
        size: "sm",
        className: "[&>[data-slot=tabs-trigger]]:rounded-md",
      },
      {
        variant: "segmented",
        shape: "rounded",
        size: "default",
        className: "[&>[data-slot=tabs-trigger]]:rounded-lg",
      },
      {
        variant: "segmented",
        shape: "rounded",
        size: "lg",
        className: "[&>[data-slot=tabs-trigger]]:rounded-lg",
      },
      {
        variant: "fill",
        shape: "pill",
        className: "[&>[data-slot=tabs-trigger]]:rounded-full",
      },
      {
        variant: "segmented",
        shape: "pill",
        className: "[&>[data-slot=tabs-trigger]]:rounded-full",
      },
    ],
    defaultVariants: {
      variant: "fill",
      size: "default",
      shape: "rounded",
    },
  }
)

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> &
  Omit<VariantProps<typeof tabsListVariants>, "variant"> & {
    /** `default` is shadcn's name for the default style and renders as `fill`. */
    variant?: VariantProps<typeof tabsListVariants>["variant"] | "default"
  }

function TabsList({
  className,
  variant = "fill",
  size = "default",
  shape = "rounded",
  ...props
}: TabsListProps) {
  // An alias, not a style: resolve it once so the DOM and the triggers only
  // ever see the canonical name.
  const resolvedVariant = variant === "default" ? "fill" : variant

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={resolvedVariant}
      data-size={size}
      data-shape={shape}
      className={cn(
        tabsListVariants({ variant: resolvedVariant, size, shape, className })
      )}
      {...props}
    />
  )
}

const tabsTriggerClasses = [
  "relative inline-flex h-full flex-1 items-center justify-center border border-transparent",
  "font-medium whitespace-nowrap text-foreground/60 transition-all outline-none",
  "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
  "hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring",
  "disabled:pointer-events-none disabled:opacity-50",
  "dark:text-muted-foreground dark:hover:text-foreground",
  "data-[state=active]:text-foreground",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  // Sizes come from the list so a trigger never has to repeat them.
  "group-data-[size=sm]/tabs-list:gap-1 group-data-[size=sm]/tabs-list:px-2 group-data-[size=sm]/tabs-list:text-sm group-data-[size=sm]/tabs-list:leading-5",
  "group-data-[size=default]/tabs-list:gap-1.5 group-data-[size=default]/tabs-list:px-3 group-data-[size=default]/tabs-list:text-base group-data-[size=default]/tabs-list:leading-6",
  "group-data-[size=lg]/tabs-list:gap-1.5 group-data-[size=lg]/tabs-list:px-4 group-data-[size=lg]/tabs-list:text-base group-data-[size=lg]/tabs-list:leading-6",
  "group-data-[size=sm]/tabs-list:[&_svg:not([class*='size-'])]:size-4",
  "group-data-[size=default]/tabs-list:[&_svg:not([class*='size-'])]:size-5",
  "group-data-[size=lg]/tabs-list:[&_svg:not([class*='size-'])]:size-5",
  // Fill: transparent rail, the active tab carries the surface.
  "group-data-[variant=fill]/tabs-list:data-[state=active]:bg-item-secondary",
  // Segmented: grey rail, the active tab lifts to the background surface.
  "group-data-[variant=segmented]/tabs-list:data-[state=active]:bg-background group-data-[variant=segmented]/tabs-list:data-[state=active]:shadow-xs",
  // Line: no surface, a brand underline marks the active tab.
  "group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:bg-transparent",
  "after:absolute after:bg-brand after:opacity-0 after:transition-opacity",
  "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-0 group-data-[orientation=horizontal]/tabs:after:h-0.5",
  "group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5",
  "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
]

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerClasses, className)}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
