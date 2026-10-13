// Assembles the two registries from registry/items/*.json.
//
// One file per item keeps parallel work conflict-free and lets the docs site
// read the catalog without parsing a 4,000-line file. `meta.tier` decides
// which registry an item ships in:
//
//   free → registry.json      → apps/docs/public/r        (public)
//   pro  → registry.pro.json  → apps/docs/registry/pro    (served behind a licence check)
//
// Two things happen on the way:
//
// 1. registry/items/theme.json is regenerated from the token stylesheet, so
//    `npx shadcn add @blank/theme` merges Blank's palette and semantic roles
//    into the consumer's own :root/.dark instead of fighting shadcn's defaults.
// 2. Bare registryDependencies that name a Blank item are namespaced
//    ("button" → "@blank/button"), so installing a Blank component never pulls
//    in shadcn's version of a part it composes.
//
// Run with `pnpm registry:items` (or as part of `pnpm registry:build`).

import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const itemsDir = path.join(root, "registry/items")
const stylesheet = path.join(root, "packages/ui/styles/globals.css")

// Where the registries are served. Absolute URLs end up inside the `blank`
// init item, so a preview deploy builds with its own origin:
//   BLANK_REGISTRY_URL=https://blank-3-ten.vercel.app pnpm registry:build
const SITE = (process.env.BLANK_REGISTRY_URL ?? "https://useblank.design").replace(/\/$/, "")

const base = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  homepage: SITE,
}

// ---------------------------------------------------------------------------
// Theme item from the token stylesheet.
// ---------------------------------------------------------------------------

/** Splits CSS into top-level `{ selector, body }` blocks; comments removed. */
function blocks(css) {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const out = []
  let depth = 0
  let start = 0
  let selector = ""
  for (let i = 0; i < source.length; i++) {
    const ch = source[i]
    if (ch === "{") {
      if (depth === 0) {
        selector = source.slice(start, i).trim()
        start = i + 1
      }
      depth++
    } else if (ch === "}") {
      depth--
      if (depth === 0) {
        out.push({ selector, body: source.slice(start, i) })
        start = i + 1
      }
    } else if (ch === ";" && depth === 0) {
      // Statement at-rules such as @custom-variant — skipped.
      start = i + 1
    }
  }
  return out
}

/** Parses a rule body into declarations and nested rules. */
function ruleObject(body) {
  const object = {}
  const nested = blocks(body)
  let flat = body
  for (const block of nested) {
    object[block.selector] = ruleObject(block.body)
    flat = flat.replace(`${block.selector}{${block.body}}`, "")
    flat = flat.replace(block.body, "")
  }
  for (const declaration of declarations(nested.length ? stripNested(body) : body)) {
    object[declaration.name] = declaration.value
  }
  return object
}

function stripNested(body) {
  let out = ""
  let depth = 0
  let last = 0
  for (let i = 0; i < body.length; i++) {
    if (body[i] === "{") {
      if (depth === 0) {
        // Drop the selector that precedes this block, back to the last ; or }.
        const prefix = body.slice(last, i)
        const cut = Math.max(prefix.lastIndexOf(";"), prefix.lastIndexOf("}"))
        out += prefix.slice(0, cut + 1)
      }
      depth++
    } else if (body[i] === "}") {
      depth--
      if (depth === 0) last = i + 1
    }
  }
  return out + body.slice(last)
}

function declarations(body) {
  return body
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.includes(":"))
    .map((part) => {
      const index = part.indexOf(":")
      return {
        name: part.slice(0, index).trim(),
        value: part
          .slice(index + 1)
          .replace(/\s+/g, " ")
          .replace(/\(\s+/g, "(")
          .replace(/\s+\)/g, ")")
          .trim(),
      }
    })
}

function vars(body) {
  return Object.fromEntries(
    declarations(body)
      .filter((d) => d.name.startsWith("--"))
      .map((d) => [d.name.slice(2), d.value])
  )
}

function themeItem() {
  const css = fs.readFileSync(stylesheet, "utf8")
  const light = {}
  const dark = {}
  const theme = {}
  const rules = {}

  for (const block of blocks(css)) {
    if (block.selector === ":root") Object.assign(light, vars(block.body))
    else if (block.selector === ".dark") Object.assign(dark, vars(block.body))
    else if (block.selector === "@theme inline") Object.assign(theme, vars(block.body))
    else rules[block.selector] = ruleObject(block.body)
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "theme",
    type: "registry:theme",
    title: "Blank Theme",
    description:
      "Blank's palette, semantic roles for light and dark, Tailwind theme mapping and base layer. Install it once, before any component.",
    cssVars: { theme, light, dark },
    css: rules,
    meta: {
      tier: "free",
      generated: "scripts/build-registry.mjs from packages/ui/styles/globals.css",
    },
  }
}

fs.writeFileSync(
  path.join(itemsDir, "theme.json"),
  JSON.stringify(themeItem(), null, 2) + "\n"
)

// `npx shadcn@latest init <site>/r/blank.json` sets a project up for Blank in
// one step: components.json gains the @blank and @blank-pro registries, the
// theme is merged into the stylesheet and cn() is written to lib/utils.
const blankItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "blank",
  type: "registry:base",
  title: "Blank",
  description:
    "Sets a project up for Blank: the @blank and @blank-pro registries, the light and dark token sheet, and cn().",
  extends: "none",
  config: {
    style: "blank",
    iconLibrary: "lucide",
    registries: {
      "@blank": `${SITE}/r/{name}.json`,
      "@blank-pro": {
        url: `${SITE}/r/pro/{name}.json`,
        headers: { Authorization: "Bearer ${BLANK_LICENSE_KEY}" },
      },
    },
  },
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge", "lucide-react", "radix-ui", "tw-animate-css"],
  registryDependencies: [`${SITE}/r/theme.json`],
  files: [{ path: "packages/ui/lib/utils.ts", type: "registry:lib", target: "lib/utils.ts" }],
  meta: { tier: "free", generated: "scripts/build-registry.mjs" },
}

fs.writeFileSync(
  path.join(itemsDir, "blank.json"),
  JSON.stringify(blankItem, null, 2) + "\n"
)

// ---------------------------------------------------------------------------
// Registries.
// ---------------------------------------------------------------------------

const items = fs
  .readdirSync(itemsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const item = JSON.parse(fs.readFileSync(path.join(itemsDir, file), "utf8"))
    if (item.name !== file.replace(/\.json$/, "")) {
      throw new Error(
        `registry/items/${file}: name "${item.name}" does not match the file name`
      )
    }
    for (const f of item.files ?? []) {
      if (!fs.existsSync(path.join(root, f.path))) {
        throw new Error(`registry/items/${file}: missing source ${f.path}`)
      }
    }
    delete item.$schema
    return item
  })

const tierOf = (item) => item.meta?.tier ?? "free"
const tiers = new Map(items.map((item) => [item.name, tierOf(item)]))

for (const item of items) {
  if (!item.registryDependencies) continue
  item.registryDependencies = item.registryDependencies.map((dep) => {
    const name = dep.replace(/^@blank(-pro)?\//, "")
    const tier = tiers.get(name)
    if (!tier) return dep // shadcn built-ins such as "utils", or URLs
    if (tierOf(item) === "free" && tier === "pro") {
      throw new Error(`${item.name} is free but depends on Pro item ${name}`)
    }
    return tier === "pro" ? `@blank-pro/${name}` : `@blank/${name}`
  })
}

// Hooks, libs and the theme first, then everything else alphabetically — the
// order the CLI lists them in.
const rank = (item) =>
  ["registry:base", "registry:theme", "registry:hook", "registry:lib"].includes(item.type) ? 0 : 1
items.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name))

const free = items.filter((item) => tierOf(item) === "free")
const pro = items.filter((item) => tierOf(item) === "pro")

const write = (file, registry) =>
  fs.writeFileSync(path.join(root, file), JSON.stringify(registry, null, 2) + "\n")

write("registry.json", { ...base, name: "blank", items: free })
write("registry.pro.json", { ...base, name: "blank-pro", items: pro })

console.log(
  `registry.json: ${free.length} items · registry.pro.json: ${pro.length} items`
)
