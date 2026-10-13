"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type Billing = "monthly" | "yearly"

interface Tier {
  id: string
  name: string
  description: string
  price: Record<Billing, number>
  cta: string
  featuresLead?: string
  features: string[]
  highlighted?: boolean
}

const tiers: Tier[] = [
  {
    id: "hobby",
    name: "Hobby",
    description: "For a personal site or side project.",
    price: { monthly: 0, yearly: 0 },
    cta: "Start for free",
    featuresLead: "Includes",
    features: [
      "10k pageviews a month",
      "2 websites",
      "30 days of data",
      "Live dashboard and goals",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For teams that ship and measure weekly.",
    price: { monthly: 19, yearly: 16 },
    cta: "Start 14-day trial",
    featuresLead: "Everything in Hobby, plus",
    features: [
      "250k pageviews a month",
      "Unlimited websites",
      "2 years of data",
      "Funnels and revenue goals",
      "Weekly reports in Slack",
    ],
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    description: "For companies running several products.",
    price: { monthly: 79, yearly: 66 },
    cta: "Start 14-day trial",
    featuresLead: "Everything in Growth, plus",
    features: [
      "2M pageviews a month",
      "Unlimited data retention",
      "SSO with Google and Okta",
      "Roles and shared dashboards",
      "Support replies within 4 hours",
    ],
  },
]

const ease = [0.22, 1, 0.36, 1] as const

/** Rolls only the digits that change, so 19 → 16 moves one column. */
function RollingNumber({ value }: { value: number }) {
  const reduceMotion = useReducedMotion()
  const digits = String(value).split("")

  return (
    <span className="inline-flex overflow-hidden tabular-nums">
      {digits.map((digit, index) => (
        <span
          key={index}
          className="relative inline-flex justify-center overflow-hidden"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={digit}
              initial={reduceMotion ? false : { y: "70%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduceMotion ? undefined : { y: "-70%", opacity: 0 }}
              transition={{ duration: 0.45, ease, delay: index * 0.04 }}
              className="inline-block"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

function BillingToggle({
  value,
  onChange,
}: {
  value: Billing
  onChange: (value: Billing) => void
}) {
  const reduceMotion = useReducedMotion()
  const id = React.useId()
  const options: { value: Billing; label: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ]

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => next && onChange(next as Billing)}
      variant="ghost"
      size="sm"
      shape="pill"
      spacing={1}
      aria-label="Billing period"
      className="rounded-full bg-item-secondary p-1"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="relative overflow-visible px-4 data-[state=on]:bg-transparent"
        >
          {value === option.value && (
            <motion.span
              layoutId={`${id}-billing`}
              aria-hidden="true"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 34 }
              }
              className="absolute inset-0 rounded-full bg-background shadow-xs ring-1 ring-border"
            />
          )}
          <span className="relative">{option.label}</span>
          {option.value === "yearly" && (
            <Badge
              variant="brand"
              size="xs"
              shape="pill"
              className="relative ml-1"
            >
              −16%
            </Badge>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

function PriceCard({ tier, billing }: { tier: Tier; billing: Billing }) {
  const price = tier.price[billing]
  const isFree = tier.price.monthly === 0

  return (
    <div
      data-highlighted={tier.highlighted || undefined}
      className={cn(
        "group/tier relative flex flex-col rounded-3xl bg-card p-6 ring-1 ring-border sm:p-8 md:p-6 lg:p-8",
        "shadow-[0_1px_2px_0_color-mix(in_oklab,var(--foreground)_4%,transparent)]",
        "dark:bg-muted/25 dark:shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--foreground)_6%,transparent)]",
        "data-highlighted:ring-item-selected-border data-highlighted:bg-[radial-gradient(120%_50%_at_50%_0%,var(--item-selected),transparent)]",
        "data-highlighted:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--brand)_25%,transparent)]"
      )}
    >
      {tier.highlighted && (
        <span
          aria-hidden="true"
          className="absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-brand to-transparent"
        />
      )}

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{tier.name}</h3>
        {tier.highlighted && (
          <Badge variant="brand" size="sm" shape="pill" className="px-2">
            Most popular
          </Badge>
        )}
      </div>
      <p className="mt-2 text-sm leading-6 text-pretty text-muted-foreground md:min-h-12 xl:min-h-0">
        {tier.description}
      </p>

      <div className="mt-8 flex items-end gap-2">
        <span className="sr-only">${price}</span>
        <span
          aria-hidden="true"
          className="flex items-start text-5xl font-semibold tracking-[-0.04em]"
        >
          <span className="mt-1.5 mr-0.5 text-2xl font-medium tracking-normal text-muted-foreground">
            $
          </span>
          <RollingNumber value={price} />
        </span>
        <span className="pb-1.5 text-sm leading-5 text-muted-foreground">
          {isFree ? "forever" : "per month"}
        </span>
      </div>
      <p className="mt-1.5 h-5 text-[13px] leading-5 text-muted-foreground">
        {isFree
          ? "No card required"
          : billing === "yearly"
            ? `$${tier.price.yearly * 12} billed yearly`
            : "Billed monthly"}
      </p>

      <Button
        shape="pill"
        variant={tier.highlighted ? "default" : "outline"}
        className="mt-8 w-full"
      >
        {tier.cta}
      </Button>

      <div className="mt-8 border-t border-border pt-6">
        {tier.featuresLead && (
          <p className="mb-4 text-[13px] font-medium text-foreground">
            {tier.featuresLead}
          </p>
        )}
        <ul className="flex flex-col gap-3">
          {tier.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm leading-5 text-muted-foreground"
            >
              <CheckIcon
                aria-hidden="true"
                className="mt-px size-4 shrink-0 text-muted-foreground group-data-highlighted/tier:text-brand"
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Pricing01() {
  const [billing, setBilling] = React.useState<Billing>("yearly")

  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl sm:leading-[1.05]">
            Pay for pageviews.
            <br />
            <span className="text-muted-foreground">Not for seats.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-pretty text-muted-foreground">
            Every plan includes unlimited team members, a 1 KB cookie-free
            script and full data export. Upgrade or downgrade from the
            dashboard.
          </p>
          <div className="mt-8">
            <BillingToggle value={billing} onChange={setBilling} />
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3 lg:gap-6">
          {tiers.map((tier) => (
            <PriceCard key={tier.id} tier={tier} billing={billing} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Over your limit for a month? We email you first and keep tracking.{" "}
          <a
            href="#"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Compare all features
          </a>
        </p>
      </div>
    </section>
  )
}
