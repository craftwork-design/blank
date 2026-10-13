import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const featureCardVariants = cva(
  "group/feature-card min-w-0 relative flex flex-col overflow-hidden text-card-foreground",
  {
    variants: {
      // `default` is a bordered card; `ghost` drops the surface so a row of
      // features sits directly on a section background.
      variant: {
        default: "shadow-xs rounded-2xl border bg-card",
        ghost: "gap-5 bg-transparent",
      },
      orientation: {
        vertical: "",
        horizontal: "sm:flex-row",
      },
    },
    // The media edge that meets the content depends on both axes at once.
    compoundVariants: [
      {
        variant: "default",
        orientation: "vertical",
        className: "*:data-[slot=feature-card-media]:border-b",
      },
      {
        variant: "default",
        orientation: "horizontal",
        className:
          "sm:*:data-[slot=feature-card-media]:border-r sm:*:data-[slot=feature-card-media]:border-b-0 *:data-[slot=feature-card-media]:border-b",
      },
      { variant: "ghost", orientation: "horizontal", className: "sm:gap-8" },
    ],
    defaultVariants: {
      variant: "default",
      orientation: "vertical",
    },
  }
)

function FeatureCard({
  className,
  variant = "default",
  orientation = "vertical",
  ...props
}: React.ComponentProps<"article"> & VariantProps<typeof featureCardVariants>) {
  return (
    <article
      data-slot="feature-card"
      data-variant={variant}
      data-orientation={orientation}
      className={cn(featureCardVariants({ variant, orientation, className }))}
      {...props}
    />
  )
}

/** Holds an image or any composed visual; images fill it and ease in on hover. */
function FeatureCardMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feature-card-media"
      className={cn(
        "relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted",
        "group-data-[variant=ghost]/feature-card:rounded-xl group-data-[variant=ghost]/feature-card:border",
        "group-data-[orientation=horizontal]/feature-card:sm:aspect-auto group-data-[orientation=horizontal]/feature-card:sm:w-1/2 group-data-[orientation=horizontal]/feature-card:sm:min-h-56 group-data-[orientation=horizontal]/feature-card:sm:self-stretch",
        "[&>img]:inset-0 [&>img]:ease-out [&>img]:absolute [&>img]:size-full [&>img]:object-cover [&>img]:transition-transform [&>img]:duration-500 group-hover/feature-card:[&>img]:scale-[1.03] motion-reduce:[&>img]:transition-none",
        className
      )}
      {...props}
    />
  )
}

function FeatureCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feature-card-content"
      className={cn(
        "gap-4 p-6 flex flex-1 flex-col",
        "group-data-[variant=ghost]/feature-card:p-0 group-data-[orientation=horizontal]/feature-card:justify-center",
        className
      )}
      {...props}
    />
  )
}

/** A framed icon for feature grids that do not carry an image. */
function FeatureCardIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feature-card-icon"
      className={cn(
        "size-10 [&_svg:not([class*='size-'])]:size-5 shadow-xs flex shrink-0 items-center justify-center rounded-xl border bg-background text-foreground",
        className
      )}
      {...props}
    />
  )
}

function FeatureCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feature-card-header"
      className={cn("gap-1.5 flex flex-col", className)}
      {...props}
    />
  )
}

function FeatureCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="feature-card-title"
      className={cn(
        "text-lg leading-7 font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
}

function FeatureCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="feature-card-description"
      className={cn(
        "text-sm leading-6 text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function FeatureCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feature-card-footer"
      className={cn("gap-2 mt-auto flex flex-wrap items-center", className)}
      {...props}
    />
  )
}

export {
  FeatureCard,
  FeatureCardContent,
  FeatureCardDescription,
  FeatureCardFooter,
  FeatureCardHeader,
  FeatureCardIcon,
  FeatureCardMedia,
  FeatureCardTitle,
  featureCardVariants,
}
