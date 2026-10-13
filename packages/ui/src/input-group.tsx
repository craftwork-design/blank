"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input, type InputProps } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const inputGroupVariants = cva(
  "group/input-group min-w-0 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 relative flex w-full items-center transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[[data-slot=input-group-control]:disabled]:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-focus-ring has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-error-ring has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:has-[[data-slot][aria-invalid=true]]:ring-error-ring",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-input-field shadow-field hover:border-input-hover has-[[data-slot=input-group-control]:disabled]:bg-input-disabled has-[[data-slot=input-group-control]:disabled]:shadow-none",
        secondary: "border border-transparent bg-item-secondary",
      },
      // Same scale and radii as Input, so a group and a bare input line up.
      size: {
        sm: "h-8 rounded-lg",
        default: "h-10 rounded-xl",
        lg: "h-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function InputGroup({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>) {
  return (
    <div
      data-slot="input-group"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      role="group"
      className={cn(inputGroupVariants({ variant, size }), className)}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "gap-2 py-1.5 text-sm font-medium [&>svg:not([class*='size-'])]:size-4 flex h-auto cursor-text items-center justify-center text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)]",
  {
    variants: {
      align: {
        "inline-start":
          "pl-2.5 group-data-[size=sm]/input-group:has-[>svg]:pl-2 has-[>button]:pl-1 order-first",
        "inline-end":
          "pr-2.5 group-data-[size=sm]/input-group:has-[>svg]:pr-2 has-[>button]:pr-1 order-last",
        "block-start":
          "py-2.5 pr-2.5 pl-3.5 group-has-[>input]/input-group:pt-2 order-first w-full justify-start",
        "block-end":
          "p-2.5 group-has-[>input]/input-group:pb-2 order-last w-full justify-start",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // Click-to-focus is a pointer affordance; the input it focuses is already
    // in the tab order, so the addon must not become a tab stop itself.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      className={cn("rounded-[calc(var(--radius)-3px)] shadow-none", className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 flex items-center text-muted-foreground [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: InputProps) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        "group-data-[size=sm]/input-group:h-8 group-data-[size=lg]/input-group:h-12 group-data-[size=lg]/input-group:text-base",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "py-2 flex-1 resize-none rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
