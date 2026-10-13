"use client"

import * as React from "react"
import { CheckIcon, RssIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const columns = [
  {
    title: "Product",
    links: [
      { label: "Alert routing" },
      { label: "On-call schedules" },
      { label: "Status pages" },
      { label: "Incident timeline" },
      { label: "Pricing" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation" },
      { label: "API reference" },
      { label: "Terraform provider" },
      { label: "Integrations" },
      { label: "Changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About" },
      { label: "Customers" },
      { label: "Careers", badge: "Hiring" },
      { label: "Blog" },
      { label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy" },
      { label: "Terms" },
      { label: "Security" },
      { label: "DPA" },
      { label: "Subprocessors" },
    ],
  },
]

// Platform marks are inline paths so the block stays dependency-free.
const socials = [
  {
    label: "Tidewell on X",
    path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z",
  },
  {
    label: "Tidewell on GitHub",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    label: "Tidewell on YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
]

function Logo() {
  return (
    <a href="#" className="inline-flex items-center gap-2.5" aria-label="Tidewell home">
      <span className="flex size-8 items-center justify-center rounded-[10px] bg-foreground text-background">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
          <path
            d="M3 9.5c2.25 0 2.25-2 4.5-2s2.25 2 4.5 2 2.25-2 4.5-2 2.25 2 4.5 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M3 15.5c2.25 0 2.25-2 4.5-2s2.25 2 4.5 2 2.25-2 4.5-2 2.25 2 4.5 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".5"
          />
        </svg>
      </span>
      <span className="text-[17px] font-semibold tracking-tight">Tidewell</span>
    </a>
  )
}

function Newsletter() {
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSubscribed(true)
      }}
      className="mt-10"
    >
      <Field className="gap-3">
        <FieldLabel htmlFor="footer-01-email">Product updates</FieldLabel>
        <div className="flex gap-2">
          <Input
            id="footer-01-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            disabled={subscribed}
            className="rounded-full px-4"
          />
          <Button
            type="submit"
            shape="pill"
            variant={subscribed ? "secondary" : "default"}
            disabled={subscribed}
            className="px-4"
          >
            {subscribed ? (
              <>
                <CheckIcon data-icon="inline-start" />
                Subscribed
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
        <FieldDescription className="text-[13px]">
          One email a month about what shipped.
        </FieldDescription>
      </Field>
    </form>
  )
}

export default function Footer01() {
  return (
    <footer className="border-t border-border bg-background px-4 pt-16 pb-10 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              On-call schedules, alert routing and status pages for teams that
              keep production running.
            </p>
            <Newsletter />
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[13px] font-medium text-foreground">
                  {column.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                        {"badge" in link && link.badge && (
                          <Badge variant="brand" size="xs" shape="pill" className="px-1.5">
                            {link.badge}
                          </Badge>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:gap-6">
            <p>© 2026 Tidewell Labs, Inc.</p>
            <a
              href="#"
              className="inline-flex w-fit items-center gap-2 transition-colors hover:text-foreground"
            >
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-success-primary opacity-60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-success-primary" />
              </span>
              All systems operational
            </a>
          </div>

          <div className="-ml-2 flex items-center gap-1 sm:ml-0">
            {socials.map((social) => (
              <Button
                key={social.label}
                asChild
                variant="ghost"
                size="icon-sm"
                shape="pill"
              >
                <a href="#" aria-label={social.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                    <path d={social.path} />
                  </svg>
                </a>
              </Button>
            ))}
            <Button asChild variant="ghost" size="icon-sm" shape="pill">
              <a href="#" aria-label="Changelog RSS feed">
                <RssIcon />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
