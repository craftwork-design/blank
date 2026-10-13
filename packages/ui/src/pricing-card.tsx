import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function PricingCard({
  className,
  featured = false,
  ...props
}: React.ComponentProps<"article"> & {
  /** Lifts the plan you want most people to pick. */
  featured?: boolean
}) {
  return (
    <article
      data-slot="pricing-card"
      data-featured={featured}
      className={cn(
        "group/pricing-card min-w-0 gap-6 p-6 shadow-xs relative flex flex-col rounded-2xl border bg-card text-card-foreground",
        "data-[featured=true]:shadow-md data-[featured=true]:border-item-selected-border data-[featured=true]:bg-brand-subtle",
        className
      )}
      {...props}
    />
  )
}

function PricingCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-header"
      className={cn(
        "gap-1.5 grid auto-rows-min has-data-[slot=pricing-card-action]:grid-cols-[1fr_auto]",
        className
      )}
      {...props}
    />
  )
}

function PricingCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="pricing-card-title"
      className={cn(
        "text-lg leading-7 font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
}

function PricingCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="pricing-card-description"
      className={cn(
        "text-sm leading-5 col-start-1 text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Top-right of the header: a "Most popular" badge, a toggle, a menu. */
function PricingCardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function PricingCardPrice({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-price"
      className={cn(
        "gap-x-1.5 flex flex-wrap items-baseline whitespace-nowrap",
        className
      )}
      {...props}
    />
  )
}

function PricingCardValue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pricing-card-value"
      className={cn(
        "text-5xl font-semibold tracking-tight leading-none text-foreground tabular-nums",
        "[&_[data-slot=pricing-card-currency]]:mr-0.5 [&_[data-slot=pricing-card-currency]]:text-2xl [&_[data-slot=pricing-card-currency]]:align-top [&_[data-slot=pricing-card-currency]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PricingCardCurrency({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pricing-card-currency"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PricingCardPeriod({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pricing-card-period"
      className={cn("text-sm leading-5 text-muted-foreground", className)}
      {...props}
    />
  )
}

function PricingCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-content"
      className={cn("gap-4 flex flex-1 flex-col", className)}
      {...props}
    />
  )
}

function PricingCardFeatures({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pricing-card-features"
      className={cn("gap-3 grid", className)}
      {...props}
    />
  )
}

/** A line in the plan. `included={false}` keeps it visible but crossed out. */
function PricingCardFeature({
  className,
  included = true,
  children,
  ...props
}: React.ComponentProps<"li"> & { included?: boolean }) {
  return (
    <li
      data-slot="pricing-card-feature"
      data-included={included}
      className={cn(
        "group/pricing-card-feature gap-3 text-sm leading-5 flex items-start text-foreground",
        "data-[included=false]:text-muted-foreground",
        "[&>svg:not([class*='size-'])]:size-5 [&>svg]:shrink-0",
        className
      )}
      {...props}
    >
      <CheckIcon
        aria-hidden="true"
        className="text-brand group-data-[included=false]/pricing-card-feature:hidden"
      />
      <MinusIcon
        aria-hidden="true"
        className="hidden text-muted-foreground/70 group-data-[included=false]/pricing-card-feature:block"
      />
      <span className="min-w-0 flex-1">
        {children}
        {included ? null : <span className="sr-only"> (not included)</span>}
      </span>
    </li>
  )
}

function PricingCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-card-footer"
      className={cn("gap-2 flex flex-col *:w-full", className)}
      {...props}
    />
  )
}

export {
  PricingCard,
  PricingCardAction,
  PricingCardContent,
  PricingCardCurrency,
  PricingCardDescription,
  PricingCardFeature,
  PricingCardFeatures,
  PricingCardFooter,
  PricingCardHeader,
  PricingCardPeriod,
  PricingCardPrice,
  PricingCardTitle,
  PricingCardValue,
}
