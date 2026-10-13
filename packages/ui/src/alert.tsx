import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  [
    "group/alert gap-0.5 relative grid w-full rounded-xl border bg-card text-left text-card-foreground",
    "has-data-[slot=alert-action]:pr-18 has-data-[slot=alert-action]:relative",
    "has-[>svg]:gap-x-2 has-[>svg]:grid-cols-[auto_1fr]",
    "*:[svg]:translate-y-0.5 *:[svg]:row-span-2 *:[svg]:shrink-0",
  ],
  {
    variants: {
      // Status tints the leading icon only; the surface stays neutral.
      variant: {
        default: "*:[svg]:text-muted-foreground",
        info: "*:[svg]:text-info-foreground",
        success: "*:[svg]:text-success-foreground",
        warning: "*:[svg]:text-warning-foreground",
        destructive: "*:[svg]:text-destructive",
      },
      size: {
        default: "px-4 py-3 text-sm *:[svg:not([class*='size-'])]:size-5",
        sm: "px-3 py-2 text-sm *:[svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Alert({
  className,
  variant,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-size={size}
      role="alert"
      className={cn(alertVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2",
        "group-data-[size=default]/alert:text-base group-data-[size=default]/alert:leading-6",
        "group-data-[size=sm]/alert:text-sm group-data-[size=sm]/alert:leading-5",
        "[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm leading-5 md:text-pretty [&_p:not(:last-child)]:mb-4 text-balance text-muted-foreground [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("top-2 right-2 absolute", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
