"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type BannerContextValue = { dismiss: () => void }

const BannerContext = React.createContext<BannerContextValue | null>(null)

const bannerVariants = cva(
  [
    "group/banner gap-x-3 gap-y-2 px-4 py-3 text-sm leading-5 sm:flex-nowrap relative flex w-full flex-wrap items-center rounded-xl border",
    "[&>svg:not([class*='size-'])]:size-5 [&>svg]:shrink-0",
  ],
  {
    variants: {
      // Banners announce, they do not report status — that is Alert's job. So
      // the axis is emphasis, from a quiet card to a full inverted strip.
      variant: {
        default:
          "shadow-xs bg-card text-card-foreground [&>svg]:text-muted-foreground",
        secondary:
          "border-transparent bg-muted text-foreground [&>svg]:text-muted-foreground",
        brand:
          "border-item-selected-border bg-brand-subtle text-foreground [&>svg]:text-brand",
        // Inverted flips the roles its children read, so a Button or a link
        // placed inside renders against the dark (or, in dark mode, light)
        // strip without any per-child overrides.
        inverted: [
          "border-transparent bg-inverted text-inverted-foreground [&>svg]:text-muted-foreground",
          "[--background:var(--inverted)] [--card-foreground:var(--inverted-foreground)] [--card:var(--inverted)] [--foreground:var(--inverted-foreground)]",
          "[--primary-foreground:var(--inverted)] [--primary:var(--inverted-foreground)]",
          "[--border:color-mix(in_oklab,var(--inverted-foreground)_15%,transparent)] [--muted-foreground:color-mix(in_oklab,var(--inverted-foreground)_65%,transparent)]",
          "[--item-outline-hover:color-mix(in_oklab,var(--inverted-foreground)_10%,transparent)] [--item-outline:transparent]",
          "[--item-secondary-hover:color-mix(in_oklab,var(--inverted-foreground)_15%,transparent)] [--item-secondary:color-mix(in_oklab,var(--inverted-foreground)_10%,transparent)]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type BannerProps = React.ComponentProps<"div"> &
  VariantProps<typeof bannerVariants> & {
    /** Controlled visibility. Leave unset to let `BannerClose` hide it. */
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
  }

function Banner({
  className,
  variant = "default",
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  ...props
}: BannerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen

  const context = React.useMemo(
    () => ({
      dismiss: () => {
        if (openProp === undefined) setUncontrolledOpen(false)
        onOpenChange?.(false)
      },
    }),
    [onOpenChange, openProp]
  )

  if (!open) return null

  return (
    <BannerContext.Provider value={context}>
      <div
        role="region"
        aria-roledescription="banner"
        data-slot="banner"
        data-variant={variant}
        className={cn(bannerVariants({ variant, className }))}
        {...props}
      />
    </BannerContext.Provider>
  )
}

function BannerContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner-content"
      className={cn(
        "min-w-0 gap-x-2 gap-y-0.5 sm:flex-row sm:flex-wrap sm:items-baseline flex flex-1 flex-col",
        className
      )}
      {...props}
    />
  )
}

function BannerTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="banner-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function BannerDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="banner-description"
      className={cn(
        "[&_a]:font-medium text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-3",
        className
      )}
      {...props}
    />
  )
}

function BannerActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="banner-actions"
      className={cn("gap-2 flex shrink-0 items-center", className)}
      {...props}
    />
  )
}

function BannerClose({
  variant = "ghost",
  size = "icon-sm",
  children,
  onClick,
  "aria-label": ariaLabel = "Dismiss",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const context = React.useContext(BannerContext)

  return (
    <Button
      type="button"
      data-slot="banner-close"
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      className={cn("-my-1 -mr-1.5 shrink-0", className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) context?.dismiss()
      }}
      {...props}
    >
      {children ?? <XIcon />}
    </Button>
  )
}

export {
  Banner,
  BannerActions,
  BannerClose,
  BannerContent,
  BannerDescription,
  BannerTitle,
  bannerVariants,
}
export type { BannerProps }
