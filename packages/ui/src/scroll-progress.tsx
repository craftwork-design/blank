// Adapted from Magic UI (MIT, © Magic UI) — https://magicui.design/docs/components/scroll-progress
"use client"

import * as React from "react"
import { motion, useScroll, type HTMLMotionProps } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A hairline that fills as the page — or `container`, when given — scrolls.
 * It is pinned to the top of the viewport by default; inside a scroller,
 * position it yourself, e.g. `sticky top-0`. The bar moves only when the
 * reader scrolls, so it has no reduced-motion variant.
 */
function ScrollProgress({
  container,
  className,
  style,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & {
  /** Track this scrollable element instead of the page. */
  container?: React.RefObject<HTMLElement | null>
}) {
  const { scrollYProgress } = useScroll(container ? { container } : undefined)

  return (
    <motion.div
      data-slot="scroll-progress"
      aria-hidden="true"
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand",
        className
      )}
      style={{ scaleX: scrollYProgress, ...style }}
      {...props}
    />
  )
}

export { ScrollProgress }
