"use client"

import * as React from "react"

import type { InputProps } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

/**
 * Keeps digits and one decimal point, and caps the fraction at `precision`.
 * Commas are read as grouping separators, so a pasted "1,299.00" survives.
 */
function sanitizePrice(raw: string, precision: number) {
  const cleaned = raw.replace(/,/g, "").replace(/[^\d.]/g, "")
  if (precision === 0) {
    return cleaned.replace(/\./g, "")
  }
  const [whole, ...rest] = cleaned.split(".")
  if (rest.length === 0) {
    return whole
  }
  return `${whole}.${rest.join("").slice(0, precision)}`
}

type InputPriceProps = Omit<InputProps, "type" | "size"> & {
  /** The symbol before the amount. */
  currency?: React.ReactNode
  /** An optional currency code after the amount, e.g. "USD". */
  code?: React.ReactNode
  /** Digits allowed after the decimal point; 0 accepts whole numbers only. */
  precision?: number
  size?: React.ComponentProps<typeof InputGroup>["size"]
  /** Called with the sanitized amount as a string. */
  onValueChange?: (value: string) => void
}

function InputPrice({
  className,
  currency = "$",
  code,
  precision = 2,
  size = "default",
  disabled,
  onChange,
  onValueChange,
  ...props
}: InputPriceProps) {
  return (
    <InputGroup
      data-slot="input-price"
      size={size}
      data-disabled={disabled}
      className={className}
    >
      <InputGroupAddon>
        <InputGroupText data-slot="input-price-currency">
          {currency}
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        type="text"
        inputMode={precision > 0 ? "decimal" : "numeric"}
        autoComplete="off"
        disabled={disabled}
        size={size}
        className="tabular-nums"
        onChange={(event) => {
          const next = sanitizePrice(event.target.value, precision)
          if (next !== event.target.value) {
            event.target.value = next
          }
          onChange?.(event)
          onValueChange?.(next)
        }}
        {...props}
      />
      {code ? (
        <InputGroupAddon align="inline-end">
          <InputGroupText data-slot="input-price-code">{code}</InputGroupText>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}

export { InputPrice }
export type { InputPriceProps }
