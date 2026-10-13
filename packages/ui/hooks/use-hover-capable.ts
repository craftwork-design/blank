// Adapted from BeUI (MIT, © 2026 Saurabh Chauhan) — https://github.com/starc007/ui-components
import * as React from "react"

const HOVER_QUERY = "(hover: hover) and (pointer: fine)"

function subscribe(onChange: () => void) {
  const query = window.matchMedia(HOVER_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * True only on devices with a real hover — a mouse or a trackpad. A tap on a
 * touch screen leaves a phantom `:hover` behind, so pointer-follow effects
 * (tilt, magnetic pull, dock magnification) gate on this. False on the server.
 */
function useHoverCapable() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false
  )
}

export { useHoverCapable }
