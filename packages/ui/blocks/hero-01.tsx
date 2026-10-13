"use client"

import * as React from "react"
import {
  ArrowRightIcon,
  BellIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  LayersIcon,
  ListChecksIcon,
  LockIcon,
  PlusIcon,
  RocketIcon,
  SearchIcon,
  SettingsIcon,
  TimerIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge, BadgeGroup } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Status = "succeeded" | "failed" | "retrying" | "running" | "scheduled"

const jobs: {
  name: string
  queue: string
  status: Status
  note?: string
  duration: string
  started: string
  owner: string
}[] = [
  {
    name: "billing.charge_invoice",
    queue: "billing",
    status: "succeeded",
    duration: "1.42s",
    started: "12s ago",
    owner: "MK",
  },
  {
    name: "email.send_receipt",
    queue: "email",
    status: "running",
    duration: "0.38s",
    started: "now",
    owner: "JL",
  },
  {
    name: "webhooks.deliver",
    queue: "webhooks",
    status: "retrying",
    note: "2 of 5",
    duration: "30.0s",
    started: "1m ago",
    owner: "AR",
  },
  {
    name: "billing.sync_tax_rates",
    queue: "billing",
    status: "failed",
    note: "TimeoutError",
    duration: "4.07s",
    started: "4m ago",
    owner: "MK",
  },
  {
    name: "search.reindex_catalog",
    queue: "search",
    status: "succeeded",
    duration: "48.9s",
    started: "6m ago",
    owner: "SO",
  },
  {
    name: "exports.nightly_ledger",
    queue: "exports",
    status: "scheduled",
    duration: "—",
    started: "in 2h",
    owner: "DP",
  },
  {
    name: "webhooks.deliver",
    queue: "webhooks",
    status: "failed",
    note: "HTTP 503",
    duration: "10.0s",
    started: "11m ago",
    owner: "AR",
  },
  {
    name: "email.digest_weekly",
    queue: "email",
    status: "succeeded",
    duration: "12.6s",
    started: "14m ago",
    owner: "JL",
  },
]

const statusLabel: Record<Status, string> = {
  succeeded: "Succeeded",
  failed: "Failed",
  retrying: "Retrying",
  running: "Running",
  scheduled: "Scheduled",
}

const statusVariant = {
  succeeded: "success",
  failed: "destructive",
  retrying: "warning",
  running: "secondary",
  scheduled: "outline",
} as const

const queues = [
  { name: "billing", tone: "bg-success-primary" },
  { name: "email", tone: "bg-success-primary" },
  { name: "webhooks", tone: "bg-warning-primary" },
  { name: "search", tone: "bg-success-primary" },
  { name: "exports", tone: "bg-muted-foreground" },
]

const nav = [
  { label: "Jobs", icon: ListChecksIcon, active: true },
  { label: "Queues", icon: LayersIcon },
  { label: "Cron monitors", icon: TimerIcon },
  { label: "Alerts", icon: BellIcon, count: 2 },
  { label: "Deploys", icon: RocketIcon },
]

const runs = [
  38, 42, 40, 47, 52, 49, 55, 61, 58, 64, 70, 66, 72, 69, 75, 81, 78, 84, 80,
  88, 92, 86, 94, 98,
]
const failures = [
  4, 3, 5, 3, 4, 2, 3, 4, 3, 2, 3, 22, 9, 4, 3, 2, 3, 4, 2, 3, 2, 3, 2, 3,
]

function Bars({ values, spike }: { values: number[]; spike?: boolean }) {
  const max = Math.max(...values)
  return (
    <div aria-hidden="true" className="h-8 flex items-end gap-[3px]">
      {values.map((value, index) => (
        <span
          key={index}
          style={{ height: `${Math.max(8, (value / max) * 100)}%` }}
          className={cn(
            "flex-1 rounded-[2px] bg-foreground/15",
            !spike && index >= values.length - 6 && "bg-foreground/50",
            spike && value === max && "bg-destructive"
          )}
        />
      ))}
    </div>
  )
}

function ProductWindow() {
  const [filter, setFilter] = React.useState("all")
  const count = (status: Status) =>
    jobs.filter((job) => job.status === status).length
  const rows =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter)

  return (
    <div className="p-1.5 rounded-[22px] bg-muted/60 ring-1 ring-border dark:bg-muted/30">
      <div className="overflow-hidden rounded-2xl bg-background ring-1 ring-border">
        {/* Window chrome */}
        <div className="h-10 gap-3 px-3.5 flex items-center border-b border-border">
          <div className="gap-1.5 flex" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
          </div>
          <div className="h-6 min-w-0 gap-1.5 px-2.5 text-xs sm:w-72 sm:justify-center mx-auto flex items-center rounded-md bg-muted text-muted-foreground">
            <LockIcon className="size-3 shrink-0" />
            <span className="truncate">app.tracewell.dev/jobs</span>
          </div>
          <div className="w-[42px]" aria-hidden="true" />
        </div>

        <div className="flex text-left">
          {/* Sidebar */}
          <aside className="w-56 gap-6 p-3 md:flex hidden shrink-0 flex-col border-r border-border bg-muted/40 dark:bg-muted/20">
            <div className="gap-2 px-1.5 py-1 flex items-center rounded-lg">
              <span className="size-6 font-semibold flex items-center justify-center rounded-md bg-primary text-[11px] text-primary-foreground">
                N
              </span>
              <span className="text-sm font-medium">Northpeak</span>
              <ChevronsUpDownIcon className="size-3.5 ml-auto text-muted-foreground" />
            </div>

            <nav className="gap-0.5 flex flex-col">
              {nav.map((item) => (
                <span
                  key={item.label}
                  data-active={item.active || undefined}
                  className="h-8 gap-2.5 px-2 text-sm flex items-center rounded-lg text-muted-foreground data-active:bg-item-secondary data-active:text-foreground"
                >
                  <item.icon className="size-4" />
                  {item.label}
                  {item.count ? (
                    <Badge variant="destructive" size="xs" className="ml-auto">
                      {item.count}
                    </Badge>
                  ) : null}
                </span>
              ))}
            </nav>

            <div className="gap-0.5 flex flex-col">
              <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">
                Queues
              </p>
              {queues.map((queue) => (
                <span
                  key={queue.name}
                  className="h-7 gap-2.5 px-2 flex items-center rounded-lg font-mono text-[13px] text-muted-foreground"
                >
                  <span className={cn("size-1.5 rounded-full", queue.tone)} />
                  {queue.name}
                </span>
              ))}
            </div>

            <div className="gap-2 px-1.5 mt-auto flex items-center">
              <Avatar size="xs">
                <AvatarFallback color="purple">MK</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Maya Kerr</span>
              <SettingsIcon className="size-3.5 ml-auto text-muted-foreground" />
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 gap-5 p-4 sm:p-5 flex flex-1 flex-col">
            <div className="gap-3 flex items-center">
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight">Jobs</h2>
                <p className="text-xs text-muted-foreground">
                  All queues · last 24 hours
                </p>
              </div>
              <InputGroup size="sm" className="max-w-60 sm:flex ml-auto hidden">
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  size="sm"
                  aria-label="Search jobs"
                  placeholder="Search jobs or IDs"
                />
                <InputGroupAddon align="inline-end">
                  <Kbd>⌘K</Kbd>
                </InputGroupAddon>
              </InputGroup>
              <Button size="sm" className="sm:ml-0 ml-auto">
                <PlusIcon data-icon="inline-start" />
                <span className="sm:inline hidden">New monitor</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>

            <div className="gap-3 sm:grid-cols-3 grid grid-cols-2">
              <div className="gap-3 p-3 flex flex-col rounded-xl ring-1 ring-border">
                <div className="gap-2 flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Runs</span>
                  <span className="text-xs font-medium text-success-foreground">
                    +4.2%
                  </span>
                </div>
                <span className="text-xl font-semibold tracking-tight tabular-nums">
                  182,404
                </span>
                <Bars values={runs} />
              </div>
              <div className="gap-3 p-3 flex flex-col rounded-xl ring-1 ring-border">
                <div className="gap-2 flex items-baseline justify-between">
                  <span className="text-xs whitespace-nowrap text-muted-foreground">
                    Failure rate
                  </span>
                  <span className="text-xs font-medium sm:inline hidden text-muted-foreground">
                    11:00 spike
                  </span>
                </div>
                <span className="text-xl font-semibold tracking-tight tabular-nums">
                  0.31%
                </span>
                <Bars values={failures} spike />
              </div>
              <div className="gap-3 p-3 sm:flex hidden flex-col rounded-xl ring-1 ring-border">
                <div className="gap-2 flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">
                    p95 duration
                  </span>
                  <span className="text-xs font-medium text-success-foreground">
                    −180ms
                  </span>
                </div>
                <span className="text-xl font-semibold tracking-tight tabular-nums">
                  2.84s
                </span>
                <Bars values={[...runs].reverse()} />
              </div>
            </div>

            <div className="gap-2 flex flex-col">
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList
                  variant="segmented"
                  size="sm"
                  className="max-w-full overflow-x-auto"
                >
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="failed">
                    Failed
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {count("failed")}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="retrying">
                    Retrying
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {count("retrying")}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="scheduled"
                    className="sm:inline-flex hidden"
                  >
                    Scheduled
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <table className="text-sm w-full table-fixed">
                <thead>
                  <tr className="text-xs border-b border-border text-left text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Job</th>
                    <th className="w-28 py-2 pr-3 font-medium">Status</th>
                    <th className="w-24 py-2 pr-3 font-medium sm:table-cell hidden text-right">
                      Duration
                    </th>
                    <th className="w-24 py-2 pr-3 font-medium md:table-cell hidden text-right">
                      Started
                    </th>
                    <th className="w-16 py-2 font-medium lg:table-cell hidden text-right">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((job, index) => (
                    <tr
                      key={`${job.name}-${index}`}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2.5 pr-3">
                        <div className="truncate font-mono text-[13px]">
                          {job.name}
                        </div>
                        <div className="text-xs truncate text-muted-foreground">
                          {job.note ?? `queue: ${job.queue}`}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3">
                        <Badge
                          variant={statusVariant[job.status]}
                          size="sm"
                          shape="pill"
                          className="gap-1.5 px-2"
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-1.5 rounded-full bg-current",
                              job.status === "running" &&
                                "animate-pulse motion-reduce:animate-none"
                            )}
                          />
                          {statusLabel[job.status]}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-3 sm:table-cell hidden text-right font-mono text-[13px] text-muted-foreground tabular-nums">
                        {job.duration}
                      </td>
                      <td className="py-2.5 pr-3 md:table-cell hidden text-right text-muted-foreground">
                        {job.started}
                      </td>
                      <td className="py-2.5 lg:table-cell hidden">
                        <Avatar size="xs" className="ml-auto">
                          <AvatarFallback>{job.owner}</AvatarFallback>
                        </Avatar>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero01() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="inset-x-0 top-0 pointer-events-none absolute h-[44rem] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_55%_at_50%_0%,var(--foreground),transparent)] bg-size-[4.5rem_4.5rem] opacity-70"
      />

      <div className="px-4 pt-20 sm:px-6 sm:pt-28 relative mx-auto flex w-full max-w-[75rem] flex-col items-center text-center">
        <a
          href="#"
          className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both max-w-full rounded-full duration-700 outline-none focus-visible:ring-3 focus-visible:ring-focus-ring motion-reduce:animate-none"
        >
          <BadgeGroup className="backdrop-blur max-w-full bg-background/80 transition-colors hover:bg-muted">
            <Badge variant="brand" size="sm" shape="pill" className="px-2">
              New
            </Badge>
            <span className="truncate">Cron monitors are out of beta</span>
            <ChevronRightIcon className="text-muted-foreground" />
          </BadgeGroup>
        </a>

        <h1 className="mt-6 max-w-4xl animate-in font-semibold fade-in slide-in-from-bottom-3 fill-mode-both sm:text-6xl lg:text-7xl text-[2.75rem] leading-[1.02] tracking-[-0.045em] text-balance delay-100 duration-700 motion-reduce:animate-none">
          Every background job, accounted for.
        </h1>

        <p className="mt-6 max-w-xl animate-in text-base leading-relaxed fade-in slide-in-from-bottom-3 fill-mode-both sm:text-lg text-pretty text-muted-foreground delay-200 duration-700 motion-reduce:animate-none">
          Tracewell records every run of your queues and cron jobs, retries the
          ones that fail, and pages the person who owns them. Setup is two lines
          of config.
        </p>

        <div className="mt-9 animate-in gap-3 fade-in slide-in-from-bottom-3 fill-mode-both sm:w-auto sm:flex-row flex w-full flex-col items-center justify-center delay-300 duration-700 motion-reduce:animate-none">
          <Button
            asChild
            size="lg"
            shape="pill"
            className="px-6 sm:w-auto w-full"
          >
            <a href="#">
              Start for free
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            shape="pill"
            variant="outline"
            className="px-6 sm:w-auto w-full"
          >
            <a href="#">Read the docs</a>
          </Button>
        </div>

        <p className="mt-5 animate-in text-sm fade-in fill-mode-both text-muted-foreground delay-500 duration-700 motion-reduce:animate-none">
          Free up to 100,000 runs a month. No card needed.
        </p>
      </div>

      <div className="mt-16 px-4 sm:mt-20 sm:px-6 relative mx-auto w-full max-w-[75rem]">
        <div
          aria-hidden="true"
          className="inset-x-0 -top-24 h-80 max-w-4xl pointer-events-none absolute mx-auto bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_22%,transparent),transparent)]"
        />
        <div className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both relative [mask-image:linear-gradient(to_bottom,var(--foreground)_62%,transparent)] delay-500 duration-1000 motion-reduce:animate-none">
          <ProductWindow />
        </div>
      </div>
    </section>
  )
}
