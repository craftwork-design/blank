"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

// Size is declared once on the item; the trigger and the content read it back
// through group-data, so the three parts can never disagree.
function AccordionItem({
  className,
  size = "lg",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item> & {
  size?: "lg" | "md"
}) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-size={size}
      className={cn(
        "group/accordion-item border-border not-last:border-b",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger gap-3 py-2.5 font-medium [&_svg:not([class*='size-'])]:size-4 relative flex flex-1 items-start justify-between rounded-lg border border-transparent text-left text-foreground transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          "text-lg group-data-[size=md]/accordion-item:text-base group-data-[size=md]/accordion-item:leading-6 leading-[26px]",
          className
        )}
        {...props}
      >
        <span className="min-w-0 flex-1">{children}</span>
        {/* The trigger is items-start so long titles wrap from the top; the
            icon drops by half the leftover line height to sit on the first
            line's centre whatever the size. */}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="mt-[calc((1lh_-_1rem)/2)] ml-auto shrink-0 text-muted-foreground group-aria-expanded/accordion-trigger:hidden"
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          className="mt-[calc((1lh_-_1rem)/2)] ml-auto hidden shrink-0 text-muted-foreground group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        "text-base leading-6 group-data-[size=md]/accordion-item:text-sm group-data-[size=md]/accordion-item:leading-5"
      )}
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-2.5 [&>p]:m-0 [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
