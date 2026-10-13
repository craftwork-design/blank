# Blank

React components for shadcn, in Blank's design language. Light and dark from
one token sheet, Tailwind v4, React 19.

Components install into your project with the shadcn CLI, and you own the files
afterwards. Nothing is imported from a runtime package: no version to keep in
step, no wrapper to fight when a design needs something the component did not
anticipate.

**Site and live previews:** https://blank-3-ten.vercel.app (moving to
useblank.design)

## Get started

Set a project up for Blank in one step. It adds the `@blank` registry to
`components.json`, merges the token sheet into your stylesheet and writes
`cn()`:

```bash
npx shadcn@latest init https://blank-3-ten.vercel.app/r/blank.json
```

Then add what you need:

```bash
npx shadcn@latest add @blank/button @blank/dialog @blank/marquee
```

Already on shadcn? Add the registry to `components.json` and install the theme
on its own:

```json
{
  "registries": {
    "@blank": "https://blank-3-ten.vercel.app/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @blank/theme
```

Requirements: React 19, Tailwind CSS v4, shadcn CLI 4 or newer.

## What's inside

114 components, every one with light and dark built in:

| Group | Count | Examples |
| --- | --- | --- |
| Forms | 31 | button, input, select, combobox, tags input, color picker, time picker, multi-select, file upload, rating |
| Overlays | 11 | dialog, sheet, drawer, popover, dropdown menu, command, tooltip |
| Navigation | 6 | sidebar, tabs, navigation menu, breadcrumb, pagination, stepper |
| Data display | 18 | table, chart, card, timeline, tracker, bar list, file tree, code block, snippet |
| Feedback | 7 | alert, toast, progress, skeleton, banner, empty |
| Layout | 4 | resizable, scroll area, separator |
| Animations | 23 | marquee, number ticker, border beam, animated beam, text animate, word rotate, blur fade, grid and dot patterns, tilt and spotlight cards |
| Marketing | 5 | bento grid, feature card, pricing card, announcement, compare slider |
| Mockups | 9 | Safari, iPhone, Android, MacBook and iPad frames, terminal and code windows |

Plus five starter blocks (hero, features, pricing, CTA, footer) and the
`@blank/theme` token sheet.

Every primitive keeps shadcn's exported names, part structure and prop names,
so a block copied from anywhere in the shadcn ecosystem renders the way its
author intended.

## Tokens

`packages/ui/styles/globals.css` has two layers. The palette holds every raw
value; the semantic layer names roles (`background`, `primary`, `brand`,
`muted`, `border`, status roles…) and points them at palette steps. Components
only reference roles, so retheming means editing the semantic layer.

Two accents: `primary` is the action colour, `brand` is the identity colour
used for focus, selection and checked state.

## Repository

| Path | What it is |
| --- | --- |
| `packages/ui/src` | component sources, exactly as the CLI writes them into your project |
| `packages/ui/blocks` | starter blocks |
| `packages/ui/styles/globals.css` | the token sheet |
| `registry/items/*.json` | one registry item per component |
| `scripts/build-registry.mjs` | assembles `registry.json`, the theme item and the init item |

```bash
pnpm registry:build   # → public/r/*.json
```

## Blank Pro

Pro components (globe, kanban, data grid, dock, coverflow, morphing dialog…)
and 46 Pro blocks for marketing sites and app screens are sold separately and
install from a licence-gated `@blank-pro` registry. See the
[pricing page](https://blank-3-ten.vercel.app/pricing).

## Licence

MIT, see [LICENSE](LICENSE). Some components are adapted from other MIT and
Apache-2.0 projects; their notices are in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Made by [Craftwork](https://craftwork.design).
