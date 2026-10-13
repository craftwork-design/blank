"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type ChevronProps,
  type DayButton,
  type Locale,
  type RootProps,
} from "react-day-picker"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-2 [--cell-size:--spacing(8)] bg-background [--cell-radius:var(--radius-md)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        "[&_button]:!border-transparent [&_button]:shadow-none",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "gap-4 md:flex-row relative flex flex-col",
          defaultClassNames.months
        ),
        month: cn("gap-4 flex w-full flex-col", defaultClassNames.month),
        nav: cn(
          "inset-x-0 top-0 gap-1 absolute flex w-full items-center justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "p-0 size-(--cell-size) select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "p-0 size-(--cell-size) select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "gap-1.5 text-sm font-medium flex h-(--cell-size) w-full items-center justify-center",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "inset-0 absolute bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : "gap-1 text-sm [&>svg]:size-3.5 flex items-center rounded-(--cell-radius) [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "p-0 font-normal flex-1 text-center text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        // Row gap keeps multi-week ranges as stacked capsules instead of one solid block.
        week: cn("mt-1.5 flex w-full items-center", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        // Match day-cell height to the circular button so range fills read as pills, not squares.
        day: cn(
          "group/day p-0 relative flex h-(--cell-size) w-full flex-1 items-center justify-center text-center select-none",
          defaultClassNames.day
        ),
        // Capsule per week: round the true start/end and the Sun/Sat edges of long ranges.
        range_start: cn(
          "rounded-l-full bg-item-secondary last:rounded-r-full",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "bg-item-secondary first:rounded-l-full last:rounded-r-full",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-r-full bg-item-secondary first:rounded-l-full",
          defaultClassNames.range_end
        ),
        today: cn("font-semibold text-brand", defaultClassNames.today),
        outside: cn(
          "text-muted-foreground/60 aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarRoot({ className, rootRef, ...props }: RootProps) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  )
}

function CalendarChevron({ className, orientation, ...props }: ChevronProps) {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
  }

  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} {...props} />
  }

  return <ChevronDownIcon className={cn("size-4", className)} {...props} />
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus()
    }
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-slot="calendar-day"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "text-sm font-normal relative z-10 flex size-(--cell-size) items-center justify-center rounded-full leading-none text-foreground transition-colors outline-none select-none",
        "hover:bg-item-secondary",
        "focus-visible:ring-3 focus-visible:ring-focus-ring",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-3 group-data-[focused=true]/day:ring-focus-ring",
        "data-[selected-single=true]:bg-brand data-[selected-single=true]:text-brand-foreground data-[selected-single=true]:hover:bg-brand",
        "data-[range-start=true]:bg-brand data-[range-start=true]:text-brand-foreground data-[range-start=true]:hover:bg-brand",
        "data-[range-end=true]:bg-brand data-[range-end=true]:text-brand-foreground data-[range-end=true]:hover:bg-brand",
        "data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground data-[range-middle=true]:hover:bg-transparent",
        "disabled:pointer-events-none disabled:opacity-50",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
