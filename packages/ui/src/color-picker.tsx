// Based on Dice UI color-picker (https://github.com/sadmann7/diceui/blob/ea7c91f8c17689f84b928f513de4404784e89792/docs/registry/bases/radix/ui/color-picker.tsx)
// Copyright (c) 2024 Sadman Sakib. Licensed under MIT. Modified for Blank.
"use client"

import * as React from "react"
import { PipetteIcon } from "lucide-react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* -----------------------------------------------------------------------------
 * Color math. The picker edits HSV (hue keeps its value when saturation or
 * brightness reach zero) and reports hex. The literal colors below describe
 * the color model itself, not the theme, so they are the one place in Blank
 * where a component spells out color values.
 * -------------------------------------------------------------------------- */

type ColorFormat = "hex" | "rgb" | "hsl"
type Rgb = { r: number; g: number; b: number }
type Hsv = { h: number; s: number; v: number }

const HUE_GRADIENT =
  "linear-gradient(to right, rgb(255 0 0), rgb(255 255 0) 16.66%, rgb(0 255 0) 33.33%, rgb(0 255 255) 50%, rgb(0 0 255) 66.66%, rgb(255 0 255) 83.33%, rgb(255 0 0))"
const SATURATION_GRADIENT =
  "linear-gradient(to top, rgb(0 0 0), transparent), linear-gradient(to right, rgb(255 255 255), transparent)"

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function parseHex(input: string): Rgb | null {
  const match = input.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!match) return null
  const hex =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((char) => char + char)
          .join("")
      : match[1]
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  }
}

function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`
}

// Unrounded, so a hex value survives the round trip through HSV unchanged.
function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn)
  const delta = max - Math.min(rn, gn, bn)
  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
  }
  h *= 60
  if (h < 0) h += 360
  return {
    h,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  }
}

function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const sn = s / 100
  const vn = v / 100
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return vn - vn * sn * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  }
}

function rgbToHsl({ r, g, b }: Rgb) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const delta = max - min
  let h = 0
  let s = 0
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  const sn = s / 100
  const ln = l / 100
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  }
}

function formatColor(rgb: Rgb, format: ColorFormat) {
  if (format === "rgb") return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  if (format === "hsl") {
    const { h, s, l } = rgbToHsl(rgb)
    return `hsl(${h}, ${s}%, ${l}%)`
  }
  return rgbToHex(rgb)
}

/* -------------------------------------------------------------------------- */

type ColorPickerContextValue = {
  hsv: Hsv
  rgb: Rgb
  hex: string
  setHsv: (hsv: Hsv) => void
  setRgb: (rgb: Rgb) => void
  format: ColorFormat
  setFormat: (format: ColorFormat) => void
  disabled: boolean
  inline: boolean
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(
  null
)

function useColorPicker(part: string) {
  const context = React.useContext(ColorPickerContext)
  if (!context) throw new Error(`${part} must be used within <ColorPicker>`)
  return context
}

type ColorPickerProps = {
  /** A hex color, `#rrggbb` or `#rgb`. */
  value?: string
  defaultValue?: string
  /** Always called with a lowercase `#rrggbb` string. */
  onValueChange?: (value: string) => void
  /** The format the input edits in. The value stays hex either way. */
  format?: ColorFormat
  defaultFormat?: ColorFormat
  onFormatChange?: (format: ColorFormat) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
  /** Render the content in place instead of in a popover. */
  inline?: boolean
  disabled?: boolean
  /** Submits the hex value in a hidden input under this name. */
  name?: string
  children?: React.ReactNode
}

function ColorPicker({
  value: valueProp,
  defaultValue = "#000000",
  onValueChange,
  format: formatProp,
  defaultFormat = "hex",
  onFormatChange,
  open,
  defaultOpen,
  onOpenChange,
  modal,
  inline = false,
  disabled = false,
  name,
  children,
}: ColorPickerProps) {
  const [hsv, setHsvState] = React.useState<Hsv>(() =>
    rgbToHsv(parseHex(valueProp ?? defaultValue) ?? { r: 0, g: 0, b: 0 })
  )
  const [uncontrolledFormat, setUncontrolledFormat] =
    React.useState<ColorFormat>(defaultFormat)
  const format = formatProp ?? uncontrolledFormat

  const rgb = React.useMemo(() => hsvToRgb(hsv), [hsv])
  const hex = React.useMemo(() => rgbToHex(rgb), [rgb])

  // Follow a controlled value without losing the hue of greys and blacks.
  const lastEmitted = React.useRef(hex)
  React.useEffect(() => {
    if (valueProp === undefined) return
    const parsed = parseHex(valueProp)
    if (!parsed || rgbToHex(parsed) === lastEmitted.current) return
    const next = rgbToHsv(parsed)
    lastEmitted.current = rgbToHex(parsed)
    setHsvState((current) =>
      next.s === 0 || next.v === 0 ? { ...next, h: current.h } : next
    )
  }, [valueProp])

  const setHsv = React.useCallback(
    (next: Hsv) => {
      if (disabled) return
      const clamped = {
        h: clamp(next.h, 0, 360),
        s: clamp(next.s, 0, 100),
        v: clamp(next.v, 0, 100),
      }
      setHsvState(clamped)
      const nextHex = rgbToHex(hsvToRgb(clamped))
      if (nextHex !== lastEmitted.current) {
        lastEmitted.current = nextHex
        onValueChange?.(nextHex)
      }
    },
    [disabled, onValueChange]
  )

  const setRgb = React.useCallback(
    (next: Rgb) => {
      const nextHsv = rgbToHsv(next)
      setHsv(
        nextHsv.s === 0 || nextHsv.v === 0 ? { ...nextHsv, h: hsv.h } : nextHsv
      )
    },
    [setHsv, hsv.h]
  )

  const setFormat = React.useCallback(
    (next: ColorFormat) => {
      if (formatProp === undefined) setUncontrolledFormat(next)
      onFormatChange?.(next)
    },
    [formatProp, onFormatChange]
  )

  const context = React.useMemo<ColorPickerContextValue>(
    () => ({
      hsv,
      rgb,
      hex,
      setHsv,
      setRgb,
      format,
      setFormat,
      disabled,
      inline,
    }),
    [hsv, rgb, hex, setHsv, setRgb, format, setFormat, disabled, inline]
  )

  const hidden = name ? (
    <input type="hidden" name={name} value={hex} disabled={disabled} />
  ) : null

  return (
    <ColorPickerContext.Provider value={context}>
      {inline ? (
        children
      ) : (
        <Popover
          data-slot="color-picker"
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          modal={modal}
        >
          {children}
        </Popover>
      )}
      {hidden}
    </ColorPickerContext.Provider>
  )
}

function ColorPickerTrigger({
  className,
  children,
  asChild,
  disabled,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { hex, disabled: pickerDisabled } = useColorPicker(
    "ColorPickerTrigger"
  )

  return (
    <PopoverTrigger asChild disabled={disabled || pickerDisabled}>
      {asChild ? (
        children
      ) : (
        <Button
          data-slot="color-picker-trigger"
          variant="outline"
          className={cn("pl-2 font-mono uppercase", className)}
          {...props}
        >
          {children ?? (
            <>
              <ColorPickerSwatch className="size-6 rounded-md" />
              {hex}
            </>
          )}
        </Button>
      )}
    </PopoverTrigger>
  )
}

function ColorPickerContent({
  className,
  align = "start",
  children,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  const { inline } = useColorPicker("ColorPickerContent")
  const classes = cn("w-64 gap-3 p-3 flex flex-col", className)

  if (inline) {
    // In place there is no popover to position, so only the box renders.
    return (
      <div
        data-slot="color-picker-content"
        className={cn(
          "rounded-xl border border-border bg-popover text-popover-foreground",
          classes
        )}
        id={props.id}
        style={props.style}
      >
        {children}
      </div>
    )
  }

  return (
    <PopoverContent
      data-slot="color-picker-content"
      align={align}
      className={classes}
      {...props}
    >
      {children}
    </PopoverContent>
  )
}

function ColorPickerArea({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  const { hsv, hex, setHsv, disabled } = useColorPicker("ColorPickerArea")
  const areaRef = React.useRef<HTMLDivElement>(null)
  const thumbRef = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)

  const moveTo = (clientX: number, clientY: number) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    setHsv({
      h: hsv.h,
      s: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      v: clamp(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100),
    })
  }

  return (
    <div
      ref={areaRef}
      data-slot="color-picker-area"
      data-disabled={disabled || undefined}
      className={cn(
        "h-36 relative w-full shrink-0 cursor-crosshair touch-none rounded-lg select-none data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: `hsl(${hsv.h} 100% 50%)`,
        backgroundImage: SATURATION_GRADIENT,
      }}
      onPointerDown={(event) => {
        if (disabled || event.button !== 0) return
        event.preventDefault()
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        moveTo(event.clientX, event.clientY)
        thumbRef.current?.focus({ preventScroll: true })
      }}
      onPointerMove={(event) => {
        if (dragging.current) moveTo(event.clientX, event.clientY)
      }}
      onPointerUp={(event) => {
        dragging.current = false
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
      }}
      {...props}
    >
      <div
        ref={thumbRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsv.s)}
        aria-valuetext={`Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`}
        aria-disabled={disabled || undefined}
        data-slot="color-picker-area-thumb"
        className="size-4 pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-overlay-foreground shadow-md ring-1 ring-overlay outline-none focus-visible:ring-3 focus-visible:ring-focus-ring"
        style={{
          left: `${hsv.s}%`,
          top: `${100 - hsv.v}%`,
          backgroundColor: hex,
        }}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 10 : 1
          const next = { ...hsv, s: Math.round(hsv.s), v: Math.round(hsv.v) }
          switch (event.key) {
            case "ArrowLeft":
              next.s -= step
              break
            case "ArrowRight":
              next.s += step
              break
            case "ArrowUp":
              next.v += step
              break
            case "ArrowDown":
              next.v -= step
              break
            case "PageUp":
              next.v += 10
              break
            case "PageDown":
              next.v -= 10
              break
            case "Home":
              next.s = 0
              break
            case "End":
              next.s = 100
              break
            default:
              return
          }
          event.preventDefault()
          setHsv(next)
        }}
      />
    </div>
  )
}

function ColorPickerHueSlider({
  className,
  ...props
}: Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange" | "min" | "max"
>) {
  const { hsv, setHsv, disabled } = useColorPicker("ColorPickerHueSlider")

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-hue-slider"
      min={0}
      max={360}
      step={1}
      value={[hsv.h]}
      onValueChange={([h]) => setHsv({ ...hsv, h: h ?? 0 })}
      disabled={disabled}
      className={cn(
        "h-4 relative flex w-full touch-none items-center select-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className="h-3 relative w-full grow overflow-hidden rounded-full"
        style={{ backgroundImage: HUE_GRADIENT }}
      >
        <SliderPrimitive.Range className="absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label="Hue"
        className="size-4 block rounded-full border-2 border-overlay-foreground shadow-md ring-1 ring-overlay outline-none focus-visible:ring-3 focus-visible:ring-focus-ring"
        style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
      />
    </SliderPrimitive.Root>
  )
}

function ColorPickerSwatch({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { hex } = useColorPicker("ColorPickerSwatch")

  return (
    <div
      role="img"
      aria-label={`Current color ${hex}`}
      data-slot="color-picker-swatch"
      className={cn(
        "size-8 shrink-0 rounded-lg border border-border shadow-xs",
        className
      )}
      style={{ backgroundColor: hex, forcedColorAdjust: "none", ...style }}
      {...props}
    />
  )
}

type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>
}

function subscribeNoop() {
  return () => {}
}

function ColorPickerEyeDropper({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { setRgb, disabled } = useColorPicker("ColorPickerEyeDropper")
  const supported = React.useSyncExternalStore(
    subscribeNoop,
    () => "EyeDropper" in window,
    () => false
  )

  if (!supported) return null

  return (
    <Button
      data-slot="color-picker-eye-dropper"
      variant="outline"
      size="icon-sm"
      aria-label="Pick a color from the screen"
      disabled={disabled}
      className={className}
      onClick={async (event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const EyeDropper = (
          window as unknown as { EyeDropper: EyeDropperConstructor }
        ).EyeDropper
        try {
          const result = await new EyeDropper().open()
          const parsed = parseHex(result.sRGBHex)
          if (parsed) setRgb(parsed)
        } catch {
          // The user dismissed the picker.
        }
      }}
      {...props}
    >
      {children ?? <PipetteIcon />}
    </Button>
  )
}

function ColorPickerFormatSelect({
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, "children">) {
  const { format, setFormat, disabled } = useColorPicker(
    "ColorPickerFormatSelect"
  )

  return (
    <Select
      value={format}
      onValueChange={(next) => setFormat(next as ColorFormat)}
      disabled={disabled}
    >
      <SelectTrigger
        data-slot="color-picker-format-select"
        size="sm"
        aria-label="Color format"
        className={cn("w-18 shrink-0", className)}
        {...props}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="min-w-18">
        <SelectItem value="hex">HEX</SelectItem>
        <SelectItem value="rgb">RGB</SelectItem>
        <SelectItem value="hsl">HSL</SelectItem>
      </SelectContent>
    </Select>
  )
}

function ChannelInput({
  label,
  value,
  max,
  onCommit,
  disabled,
}: {
  label: string
  value: number
  max: number
  onCommit: (value: number) => void
  disabled: boolean
}) {
  const [draft, setDraft] = React.useState(String(value))
  React.useEffect(() => setDraft(String(value)), [value])

  return (
    <Input
      size="sm"
      inputMode="numeric"
      aria-label={label}
      value={draft}
      disabled={disabled}
      className="min-w-0 px-1.5 font-mono text-center tabular-nums"
      onChange={(event) => {
        const text = event.target.value.replace(/[^\d]/g, "").slice(0, 3)
        setDraft(text)
        if (text !== "") onCommit(clamp(Number(text), 0, max))
      }}
      onBlur={() => setDraft(String(value))}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 1
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault()
          onCommit(
            clamp(value + (event.key === "ArrowUp" ? step : -step), 0, max)
          )
        }
      }}
    />
  )
}

function ColorPickerInput({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  const { hex, rgb, hsv, format, setRgb, disabled } =
    useColorPicker("ColorPickerInput")
  const [draft, setDraft] = React.useState(hex)
  React.useEffect(() => setDraft(hex), [hex])

  const commitHex = (text: string) => {
    const parsed = parseHex(text)
    if (parsed) setRgb(parsed)
    else setDraft(hex)
  }

  return (
    <div
      data-slot="color-picker-input"
      data-format={format}
      className={cn("gap-1 min-w-0 flex flex-1 items-center", className)}
      {...props}
    >
      {format === "hex" && (
        <Input
          size="sm"
          aria-label="Hex color"
          value={draft}
          disabled={disabled}
          spellCheck={false}
          maxLength={7}
          className="font-mono uppercase"
          onChange={(event) => {
            setDraft(event.target.value)
            if (/^#?[0-9a-f]{6}$/i.test(event.target.value.trim())) {
              commitHex(event.target.value)
            }
          }}
          onBlur={(event) => commitHex(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitHex(event.currentTarget.value)
          }}
        />
      )}
      {format === "rgb" &&
        (["r", "g", "b"] as const).map((channel) => (
          <ChannelInput
            key={channel}
            label={{ r: "Red", g: "Green", b: "Blue" }[channel]}
            value={rgb[channel]}
            max={255}
            disabled={disabled}
            onCommit={(next) => setRgb({ ...rgb, [channel]: next })}
          />
        ))}
      {format === "hsl" &&
        (() => {
          const hsl = rgbToHsl(rgb)
          // Keep the picker's hue for greys, where HSL has none of its own.
          const h = hsl.s === 0 ? Math.round(hsv.h) : hsl.h
          return (
            [
              ["h", "Hue", 360],
              ["s", "Saturation", 100],
              ["l", "Lightness", 100],
            ] as const
          ).map(([channel, label, max]) => (
            <ChannelInput
              key={channel}
              label={label}
              value={channel === "h" ? h : hsl[channel]}
              max={max}
              disabled={disabled}
              onCommit={(next) =>
                setRgb(hslToRgb({ ...hsl, h, [channel]: next }))
              }
            />
          ))
        })()}
    </div>
  )
}

function ColorPickerPresets({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-label="Preset colors"
      data-slot="color-picker-presets"
      className={cn("gap-1.5 flex flex-wrap", className)}
      {...props}
    />
  )
}

function ColorPickerPreset({
  value,
  className,
  style,
  onClick,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & {
  /** A hex color. */
  value: string
}) {
  const { hex, setRgb, disabled } = useColorPicker("ColorPickerPreset")
  const parsed = parseHex(value)
  const normalized = parsed ? rgbToHex(parsed) : value

  return (
    <button
      type="button"
      data-slot="color-picker-preset"
      aria-label={normalized}
      aria-pressed={normalized === hex}
      disabled={disabled || !parsed}
      className={cn(
        "size-6 shrink-0 rounded-md border border-border shadow-xs transition-shadow outline-none focus-visible:ring-3 focus-visible:ring-focus-ring aria-pressed:ring-2 aria-pressed:ring-ring aria-pressed:ring-offset-2 aria-pressed:ring-offset-popover disabled:opacity-50",
        className
      )}
      style={{ backgroundColor: normalized, forcedColorAdjust: "none", ...style }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && parsed) setRgb(parsed)
      }}
      {...props}
    />
  )
}

export {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerPreset,
  ColorPickerPresets,
  ColorPickerSwatch,
  ColorPickerTrigger,
  formatColor,
}
export type { ColorFormat, ColorPickerProps }
