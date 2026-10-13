"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/* -----------------------------------------------------------------------------
 * A small built-in highlighter for the languages a docs page or a marketing
 * page actually shows: JS/TS/JSX, shell and JSON. Anything heavier (Shiki,
 * Prism) can render its own markup as `CodeBlockCode` children instead.
 * -------------------------------------------------------------------------- */

type TokenKind =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "function"
  | "tag"
  | "attribute"
  | "property"
  | "command"
  | "flag"
  | "package"

type Token = { text: string; kind?: TokenKind }

const scriptPattern =
  /(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(?<string>"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\[\s\S]|[^`\\])*`)|(?<tag>(?<=<\/?)[A-Za-z][\w.]*)|(?<keyword>\b(?:import|from|export|default|function|return|const|let|var|type|interface|extends|implements|async|await|if|else|for|while|of|in|new|class|true|false|null|undefined|as|typeof|this|satisfies)\b)|(?<number>\b\d+(?:\.\d+)?\b)|(?<function>\b[A-Za-z_$][\w$]*(?=\s*\())|(?<attribute>\b[A-Za-z][\w-]*(?==[{"']))/g

const shellPattern =
  /(?<comment>#[^\n]*)|(?<string>"(?:\\.|[^"\\\n])*"|'[^'\n]*')|(?<command>^[ \t]*[\w./-]+)|(?<flag>(?<=\s)--?[\w-]+)|(?<package>(?<=\s)@[\w./@-]+)/gm

const jsonPattern =
  /(?<property>"(?:\\.|[^"\\])*"(?=\s*:))|(?<string>"(?:\\.|[^"\\])*")|(?<number>-?\b\d+(?:\.\d+)?\b|\btrue\b|\bfalse\b|\bnull\b)/g

const patterns: Record<string, RegExp> = {
  js: scriptPattern,
  jsx: scriptPattern,
  ts: scriptPattern,
  tsx: scriptPattern,
  javascript: scriptPattern,
  typescript: scriptPattern,
  bash: shellPattern,
  sh: shellPattern,
  shell: shellPattern,
  zsh: shellPattern,
  json: jsonPattern,
}

function tokenize(code: string, language?: string): Token[] {
  const pattern = language ? patterns[language.toLowerCase()] : undefined
  if (!pattern) return [{ text: code }]

  const tokens: Token[] = []
  let cursor = 0
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0
    const kind = Object.entries(match.groups ?? {}).find(
      ([, value]) => value !== undefined
    )?.[0] as TokenKind | undefined
    if (index > cursor) tokens.push({ text: code.slice(cursor, index) })
    tokens.push({ text: match[0], kind })
    cursor = index + match[0].length
  }
  if (cursor < code.length) tokens.push({ text: code.slice(cursor) })
  return tokens
}

/** Splits a token stream into lines without breaking a token's color. */
function toLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokens) {
    token.text.split("\n").forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ text: part, kind: token.kind })
    })
  }
  return lines
}

// Each role reads a semantic token through a variable, so a consumer can
// retheme the syntax colors on any ancestor without touching this file.
const tokenClasses: Record<TokenKind, string> = {
  keyword: "text-(--code-keyword)",
  string: "text-(--code-string)",
  number: "text-(--code-number)",
  comment: "text-(--code-comment) italic",
  function: "text-(--code-function)",
  tag: "text-(--code-function)",
  attribute: "text-(--code-number)",
  property: "text-(--code-function)",
  command: "text-(--code-keyword)",
  flag: "text-(--code-number)",
  package: "text-(--code-function)",
}

/* -------------------------------------------------------------------------- */

function CodeBlock({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="code-block"
      className={cn(
        "group/code-block min-w-0 shadow-xs relative flex w-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground",
        "[--code-comment:var(--muted-foreground)] [--code-function:var(--info-foreground)] [--code-keyword:var(--brand)]",
        "[--code-number:color-mix(in_oklab,var(--warning-foreground)_70%,var(--foreground))] [--code-string:color-mix(in_oklab,var(--success-foreground)_70%,var(--foreground))]",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "h-11 gap-2 pr-1.5 pl-4 flex shrink-0 items-center border-b bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn(
        "min-w-0 gap-2 text-sm leading-5 font-medium [&_svg:not([class*='size-'])]:size-4 flex flex-1 items-center truncate text-muted-foreground [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="code-block-list"
      className={cn(
        "min-w-0 gap-4 flex h-full flex-1 items-stretch overflow-x-auto [scrollbar-width:none]",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="code-block-trigger"
      className={cn(
        "gap-1.5 text-sm leading-5 font-medium relative flex shrink-0 cursor-pointer items-center whitespace-nowrap text-muted-foreground transition-colors outline-none",
        "hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:decoration-brand focus-visible:underline-offset-4",
        "data-[state=active]:text-foreground",
        "after:inset-x-0 after:bottom-0 after:h-0.5 after:absolute after:rounded-full after:bg-brand after:opacity-0 after:transition-opacity data-[state=active]:after:opacity-100",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function CodeBlockContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="code-block-content"
      className={cn(
        "min-h-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 outline-none",
        className
      )}
      {...props}
    />
  )
}

type CodeBlockCodeProps = Omit<React.ComponentProps<"pre">, "children"> & {
  /** The source to show. Ignored when `children` renders pre-highlighted markup. */
  code?: string
  /** `tsx`, `ts`, `js`, `bash`, `json`… Unknown languages render as plain text. */
  language?: string
  lineNumbers?: boolean
  /** 1-based line numbers to mark, e.g. the lines a step changes. */
  highlightLines?: number[]
  children?: React.ReactNode
}

function CodeBlockCode({
  code = "",
  language,
  lineNumbers = false,
  highlightLines,
  className,
  children,
  ...props
}: CodeBlockCodeProps) {
  const lines = React.useMemo(
    () => toLines(tokenize(code.replace(/\n$/, ""), language)),
    [code, language]
  )
  const marked = React.useMemo(
    () => new Set(highlightLines ?? []),
    [highlightLines]
  )

  return (
    <pre
      data-slot="code-block-code"
      data-language={language}
      data-line-numbers={lineNumbers}
      className={cn(
        "group/code-block-code py-4 leading-6 m-0 overflow-x-auto bg-transparent font-mono text-[13px] text-foreground [scrollbar-width:thin]",
        className
      )}
      {...props}
    >
      <code className="block w-max min-w-full [counter-reset:line]">
        {children ??
          lines.map((tokens, index) => (
            <span
              key={index}
              data-slot="code-block-line"
              data-highlighted={marked.has(index + 1) || undefined}
              className={cn(
                "px-4 min-h-6 block [counter-increment:line]",
                "data-highlighted:bg-item-selected data-highlighted:shadow-[inset_2px_0_0_var(--brand)]",
                "group-data-[line-numbers=true]/code-block-code:before:mr-4 group-data-[line-numbers=true]/code-block-code:before:w-5 group-data-[line-numbers=true]/code-block-code:before:inline-block group-data-[line-numbers=true]/code-block-code:before:text-right group-data-[line-numbers=true]/code-block-code:before:text-muted-foreground/60 group-data-[line-numbers=true]/code-block-code:before:content-[counter(line)] group-data-[line-numbers=true]/code-block-code:before:select-none"
              )}
            >
              {tokens.map((token, tokenIndex) =>
                token.kind ? (
                  <span key={tokenIndex} className={tokenClasses[token.kind]}>
                    {token.text}
                  </span>
                ) : (
                  token.text
                )
              )}
            </span>
          ))}
      </code>
    </pre>
  )
}

/** Reads the code currently on screen, so one button serves every tab. */
function readVisibleCode(button: HTMLElement) {
  const pre = button
    .closest("[data-slot=code-block]")
    ?.querySelector<HTMLElement>("[data-slot=code-block-code]")
  if (!pre) return ""
  const lines = pre.querySelectorAll("[data-slot=code-block-line]")
  return lines.length
    ? Array.from(lines, (line) => line.textContent ?? "").join("\n")
    : (pre.textContent ?? "")
}

function CodeBlockCopy({
  value,
  variant = "ghost",
  size = "icon-sm",
  className,
  onClick,
  "aria-label": ariaLabel = "Copy code",
  ...props
}: React.ComponentProps<typeof Button> & {
  /** Text to copy. Defaults to the code currently shown in the block. */
  value?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  return (
    <Button
      type="button"
      data-slot="code-block-copy"
      data-copied={copied}
      variant={variant}
      size={size}
      aria-label={copied ? "Copied" : ariaLabel}
      className={cn("group/code-block-copy relative shrink-0", className)}
      onClick={async (event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        const text = value ?? readVisibleCode(event.currentTarget)
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
        } catch {
          setCopied(false)
        }
      }}
      {...props}
    >
      <CopyIcon className="transition-[opacity,scale] duration-200 group-data-[copied=true]/code-block-copy:scale-50 group-data-[copied=true]/code-block-copy:opacity-0" />
      <CheckIcon className="absolute scale-50 text-success-foreground opacity-0 transition-[opacity,scale] duration-200 group-data-[copied=true]/code-block-copy:scale-100 group-data-[copied=true]/code-block-copy:opacity-100" />
    </Button>
  )
}

export {
  CodeBlock,
  CodeBlockCode,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockList,
  CodeBlockTitle,
  CodeBlockTrigger,
}
export type { CodeBlockCodeProps }
