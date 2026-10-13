import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Cta01() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-card px-6 py-16 text-center ring-1 ring-border shadow-[0_1px_2px_0_color-mix(in_oklab,var(--foreground)_4%,transparent)] sm:px-12 sm:py-24 dark:bg-muted/25 dark:shadow-[inset_0_1px_0_0_color-mix(in_oklab,var(--foreground)_6%,transparent)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_50%_120%,var(--item-selected),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-item-selected-border to-transparent"
        />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl sm:leading-[1.05]">
            Page the right person.{" "}
            <br className="hidden sm:inline" />
            <span className="text-muted-foreground">Let everyone else sleep.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-pretty text-muted-foreground">
            Connect your alerts, import on-call rotations from a spreadsheet and
            route your first incident in under ten minutes.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              shape="pill"
              size="lg"
              className="px-6 has-data-[icon=inline-end]:pr-5"
            >
              Start free trial
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button shape="pill" size="lg" variant="outline" className="px-6">
              Talk to an engineer
            </Button>
          </div>

          <p className="mt-6 text-[13px] text-muted-foreground">
            Free for 14 days. No credit card. Up to 5 responders free forever.
          </p>
        </div>
      </div>
    </section>
  )
}
