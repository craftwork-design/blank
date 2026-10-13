// Adapted from Magic UI "Interactive Hover Button" (MIT, © Magic UI) — https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/interactive-hover-button.tsx
import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/**
 * A button whose dot floods it on hover while the label slides out and comes
 * back with an arrow. It is Blank's `Button` underneath, so sizes and shapes
 * match. The flood is the primary color, so the button starts from one of the
 * lighter steps — `outline`, `secondary` or `ghost`.
 *
 * Keyboard focus plays the same animation as hover.
 */
function InteractiveHoverButton({
  className,
  variant = "outline",
  size = "default",
  shape = "pill",
  children,
  ...props
}: React.ComponentProps<"button"> &
  Omit<VariantProps<typeof buttonVariants>, "variant"> & {
    variant?: "outline" | "secondary" | "ghost"
  }) {
  return (
    <button
      data-slot="interactive-hover-button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(
        buttonVariants({ variant, size, shape }),
        "relative isolate hover:opacity-100",
        className
      )}
      {...props}
    >
      {/* The dot sits in an icon-sized box, so the resting row and the hover
          row (label + arrow) are the same width and both stay centred. */}
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        data-slot="interactive-hover-button-dot"
        className="overflow-visible text-primary transition-transform duration-500 ease-in-out group-hover/button:scale-[100] group-focus-visible/button:scale-[100] motion-reduce:transition-none"
      >
        <circle cx="10" cy="10" r="3.5" fill="currentColor" />
      </svg>
      <span
        data-slot="interactive-hover-button-label"
        className="inline-flex items-center gap-[inherit] transition-[translate,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/button:translate-x-10 group-hover/button:opacity-0 group-focus-visible/button:translate-x-10 group-focus-visible/button:opacity-0 motion-reduce:transition-none"
      >
        {children}
      </span>
      <span
        aria-hidden
        data-slot="interactive-hover-button-hover-label"
        className="absolute inset-0 z-10 flex translate-x-10 items-center justify-center gap-[inherit] text-primary-foreground opacity-0 transition-[translate,opacity] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/button:translate-x-0 group-hover/button:opacity-100 group-focus-visible/button:translate-x-0 group-focus-visible/button:opacity-100 motion-reduce:transition-none"
      >
        {children}
        <ArrowRightIcon className="rtl:rotate-180" />
      </span>
    </button>
  )
}

export { InteractiveHoverButton }
