// Adapted from Magic UI "Bento Grid" (MIT, © Magic UI) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/bento-grid.tsx
import * as React from "react"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * A three-column grid of fixed-height rows. Cards span all three columns by
 * default; give them `md:col-span-1` / `md:col-span-2` (and `row-span-2`) to
 * build the layout.
 */
function BentoGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bento-grid"
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * One tile. `background` fills the card behind the copy — an illustration, a
 * live component, a pattern. On wide screens the copy lifts on hover to make
 * room for the call to action; below `lg` the link is always visible.
 */
function BentoCard({
  className,
  name,
  description,
  Icon,
  href,
  cta,
  background,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: React.ReactNode
  description?: React.ReactNode
  /** An icon component, e.g. one from lucide-react. */
  Icon?: React.ElementType
  href?: string
  cta?: React.ReactNode
  background?: React.ReactNode
}) {
  return (
    <div
      data-slot="bento-card"
      className={cn(
        "group/bento-card relative col-span-3 flex flex-col justify-end overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-sm",
        "dark:shadow-[inset_0_-20px_80px_-20px_var(--color-item-secondary)]",
        className
      )}
      {...props}
    >
      {background ? (
        <div
          data-slot="bento-card-background"
          className="absolute inset-0 overflow-hidden"
        >
          {background}
        </div>
      ) : null}
      <div
        data-slot="bento-card-content"
        className="pointer-events-none relative z-10 flex flex-col gap-1 p-6 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none lg:group-focus-within/bento-card:-translate-y-10 lg:group-hover/bento-card:-translate-y-10"
      >
        {Icon ? (
          <Icon
            aria-hidden
            strokeWidth={1.5}
            className="mb-2 size-10 origin-left text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/bento-card:scale-75 motion-reduce:transition-none"
          />
        ) : null}
        <h3 className="text-lg leading-7 font-semibold tracking-tight">
          {name}
        </h3>
        {description ? (
          <p className="max-w-lg text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {href && cta ? (
        <div
          data-slot="bento-card-cta"
          className="relative z-10 px-6 pb-5 transition-[translate,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-10 lg:opacity-0 lg:group-focus-within/bento-card:translate-y-0 lg:group-focus-within/bento-card:opacity-100 lg:group-hover/bento-card:translate-y-0 lg:group-hover/bento-card:opacity-100"
        >
          <Button
            variant="link"
            size="sm"
            asChild
            className="h-auto px-0 has-data-[icon=inline-end]:pr-0"
          >
            <a href={href}>
              {cta}
              <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
            </a>
          </Button>
        </div>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-300 group-hover/bento-card:bg-item-secondary/40"
      />
    </div>
  )
}

export { BentoGrid, BentoCard }
