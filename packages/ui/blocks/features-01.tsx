import {
  ActivityIcon,
  ArrowRightIcon,
  BellRingIcon,
  GaugeIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  TimerIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const features = [
  {
    icon: ActivityIcon,
    title: "Run history",
    description:
      "Every run is stored with its arguments, logs and return value for 30 days. Search by job ID, queue or customer.",
  },
  {
    icon: RotateCcwIcon,
    title: "Retries with backoff",
    description:
      "Set limits per queue. Tracewell backs off exponentially and gives up early when a run keeps failing for the same reason.",
  },
  {
    icon: BellRingIcon,
    title: "Alerts with an owner",
    description:
      "Each queue belongs to a team. Failures page that team directly instead of a shared channel nobody reads.",
  },
  {
    icon: TimerIcon,
    title: "Cron monitors",
    description:
      "Your 2am ledger export checks in when it finishes. If it runs late or stays silent, you hear about it at 2:05.",
  },
  {
    icon: GaugeIcon,
    title: "Queue depth",
    description:
      "Track backlog and wait time per queue, and add workers before a slow email queue starts delaying receipts.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Redaction on your side",
    description:
      "Card numbers, tokens and email addresses are stripped from payloads on your servers before anything reaches ours.",
  },
]

export default function Features01() {
  return (
    <section className="py-20 sm:py-28">
      <div className="px-4 sm:px-6 mx-auto w-full max-w-[75rem]">
        <div className="gap-6 lg:grid-cols-[1fr_auto] lg:items-end grid grid-cols-1">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand">Platform</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.035em] text-balance">
              Know a job failed
              <span className="block text-muted-foreground">
                before a customer emails you.
              </span>
            </h2>
          </div>
          <div className="max-w-sm gap-5 lg:pb-1.5 flex flex-col items-start">
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">
              One SDK call per worker. Tracewell picks up the queues you already
              run and starts reporting within a minute.
            </p>
            <Button
              asChild
              variant="outline"
              shape="pill"
              size="sm"
              className="px-3.5"
            >
              <a href="#">
                See how setup works
                <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-14 sm:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-border ring-1 ring-border">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group gap-4 p-6 sm:p-8 flex flex-col bg-background transition-colors hover:bg-muted/40 dark:hover:bg-muted/30"
            >
              <span className="size-10 shadow-xs group-hover:-translate-y-0.5 flex items-center justify-center rounded-xl bg-card text-foreground ring-1 ring-border transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none dark:bg-muted/40">
                <feature.icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <div className="gap-1.5 flex flex-col">
                <h3 className="text-base font-medium tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
