// Adapted from Magic UI "Shimmer Button" (MIT, © Magic UI) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/shimmer-button.tsx
import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * A button with a spark of light travelling around its edge. It is Blank's
 * `Button` underneath — same sizes, same shapes — with two extra layers: a
 * spinning conic gradient, and a backdrop that inherits the button's own
 * fill and covers everything but a thin rim.
 *
 * Only the `default` and `outline` steps have an opaque fill for the
 * backdrop to inherit, so those are the two variants on offer.
 */
function ShimmerButton({
  className,
  style,
  variant = "default",
  size = "default",
  shape = "pill",
  shimmerColor = "var(--brand)",
  shimmerSize = "1.5px",
  shimmerDuration = "3s",
  children,
  ...props
}: React.ComponentProps<"button"> &
  Omit<VariantProps<typeof buttonVariants>, "variant"> & {
    variant?: "default" | "outline"
    /** Color of the spark. Any CSS color; defaults to the brand token. */
    shimmerColor?: string
    /** Width of the lit rim. */
    shimmerSize?: string
    /** Time for the spark to cross the button once. */
    shimmerDuration?: string
  }) {
  return (
    <button
      data-slot="shimmer-button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      style={
        {
          "--shimmer-color": shimmerColor,
          "--shimmer-cut": shimmerSize,
          "--shimmer-speed": shimmerDuration,
          "--shimmer-spread": "90deg",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        buttonVariants({ variant, size, shape }),
        "relative isolate active:translate-y-px motion-reduce:active:translate-y-0",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="shimmer-button-spark"
        className="pointer-events-none absolute inset-0 -z-30 overflow-visible blur-[2px] @container-[size]"
      >
        <span className="absolute inset-0 aspect-square h-[100cqh] animate-[shimmer-slide_var(--shimmer-speed)_ease-in-out_infinite_alternate] motion-reduce:animate-none">
          <span className="absolute -inset-full w-auto rotate-0 animate-[spin-around_calc(var(--shimmer-speed)*2)_linear_infinite] [background:conic-gradient(from_calc(270deg-(var(--shimmer-spread)*0.5)),transparent_0,var(--shimmer-color)_var(--shimmer-spread),transparent_var(--shimmer-spread))] motion-reduce:animate-none" />
        </span>
      </span>
      <span
        aria-hidden
        data-slot="shimmer-button-backdrop"
        className="pointer-events-none absolute inset-(--shimmer-cut) -z-20 rounded-[inherit] bg-inherit"
      />
      {children}
    </button>
  )
}

export { ShimmerButton }
