import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  LockIcon,
  PanelLeftIcon,
  PlusIcon,
  RotateCwIcon,
  ShareIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

/** Safari shows the host only: no scheme, no `www.`, no path. */
function hostOf(url: string) {
  return url
    .replace(/^[a-z]+:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0]
}

function SafariFrame({
  url,
  tabs,
  activeTab = 0,
  src,
  alt = "",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Shown as its host in the address field, with a lock unless it is `http://`. */
  url?: string
  /** Renders a tab strip under the toolbar. */
  tabs?: React.ReactNode[]
  /** Index into `tabs` of the tab that owns the viewport. */
  activeTab?: number
  /** A screenshot to fill the viewport instead of `children`. */
  src?: string
  alt?: string
}) {
  return (
    <div
      data-slot="safari-frame"
      className={cn(
        "@container/safari flex w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg",
        className
      )}
      {...props}
    >
      <div
        data-slot="safari-frame-toolbar"
        className="h-11 gap-3 px-3.5 grid shrink-0 grid-cols-[minmax(max-content,1fr)_minmax(0,22rem)_minmax(max-content,1fr)] items-center bg-muted"
      >
        <div className="gap-5 flex items-center">
          <span aria-hidden="true" className="gap-2 flex">
            <span className="size-3 rounded-full bg-danger-primary" />
            <span className="size-3 rounded-full bg-warning-primary" />
            <span className="size-3 rounded-full bg-success-primary" />
          </span>
          <span
            aria-hidden="true"
            className="gap-3 @xl/safari:flex hidden items-center text-muted-foreground [&_svg]:size-4"
          >
            <PanelLeftIcon />
            <span className="gap-1 flex">
              <ChevronLeftIcon />
              <ChevronRightIcon className="opacity-40" />
            </span>
          </span>
        </div>

        <div
          data-slot="safari-frame-address"
          className="h-7 gap-1.5 px-2.5 relative flex min-w-0 items-center justify-center rounded-lg bg-background text-xs text-foreground shadow-xs"
        >
          {url && !/^http:\/\//i.test(url) && (
            <LockIcon
              aria-hidden="true"
              className="size-3 shrink-0 text-muted-foreground"
            />
          )}
          <span className="truncate">{url ? hostOf(url) : null}</span>
          <RotateCwIcon
            aria-hidden="true"
            className="right-2.5 size-3 @md/safari:block absolute hidden text-muted-foreground"
          />
        </div>

        <span
          aria-hidden="true"
          className="gap-4 @xl/safari:flex hidden items-center justify-end text-muted-foreground [&_svg]:size-4"
        >
          <ShareIcon />
          <PlusIcon />
          <CopyIcon />
        </span>
      </div>

      {tabs && tabs.length > 0 && (
        <div
          data-slot="safari-frame-tabs"
          className="h-8 gap-1 px-1.5 pb-1.5 flex shrink-0 bg-muted"
        >
          {tabs.map((tab, index) => (
            <div
              key={index}
              data-slot="safari-frame-tab"
              data-state={index === activeTab ? "active" : "inactive"}
              className="min-w-0 gap-1.5 px-3 flex flex-1 items-center justify-center rounded-md text-xs text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs [&_svg]:size-3.5 [&_svg]:shrink-0"
            >
              <span className="truncate">{tab}</span>
            </div>
          ))}
        </div>
      )}

      <div
        data-slot="safari-frame-viewport"
        className="min-h-0 relative flex-1 overflow-hidden border-t bg-background"
      >
        {src ? <img src={src} alt={alt} className="block w-full" /> : children}
      </div>
    </div>
  )
}

export { SafariFrame }
