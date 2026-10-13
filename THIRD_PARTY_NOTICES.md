# Third-party notices

Blank adapts a number of open-source components. Every adapted file names its
source in a header comment and its registry item carries `meta.source`. All of
them were rewritten for Blank — tokens instead of colours, Blank's component
rules, accessibility and reduced-motion handling — so treat each listed file as
a modified version of its original.

Only sources under permissive licences (MIT, Apache-2.0) were used. Libraries
whose licences forbid redistribution or ported versions (React Bits, Canvas UI,
Animate UI, shadcnblocks free blocks, Aceternity UI, Hover.dev and others) were
deliberately excluded.

## MIT-licensed sources

| Project | Copyright | Used for |
| --- | --- | --- |
| [Magic UI](https://github.com/magicuidesign/magicui) | Copyright (c) Magic UI | animated-beam, animated-grid-pattern, bento-grid, blur-fade, border-beam, dock (Pro), dot-pattern, file-tree, flickering-grid, globe (Pro), grid-pattern, hero-video-dialog (Pro), interactive-hover-button, light-rays (Pro), marquee, noise-texture, number-ticker, orbiting-circles, particles (Pro), progressive-blur, scroll-progress, scroll-text-reveal (Pro), shimmer-button, shiny-text, spotlight-card, text-animate, typing-animation, word-rotate |
| [Smooth UI](https://github.com/educlopez/smoothui) | Copyright (c) 2024 Eduardo Calvo | copy-button, coverflow (Pro), floating-navbar (Pro), magnetic-button (Pro), scramble-text |
| [BeUI](https://github.com/starc007/ui-components) | Copyright (c) 2026 Saurabh Chauhan | tilt-card, use-hover-capable |
| [MicroKit](https://github.com/henriquegpb/microkit) | Copyright (c) 2026 Henrique Barone | glide-menu (Pro) |
| [Dice UI](https://github.com/sadmann7/diceui) @ `ea7c91f8c1` | Copyright (c) 2024 Sadman Sakib | color-picker, compare-slider, file-upload, kanban (Pro), rating, tags-input, time-picker |
| [Origin UI](https://github.com/cosscom/coss/tree/0ac96b5353780c19d3122a86cac67ef0551f33ce/apps/origin) — `apps/origin` only | Copyright (c) 2025 coss.com, originally Copyright (c) 2025 Origin UI | multi-select, stepper, timeline |
| [Kibo UI](https://github.com/shadcnblocks/kibo) @ `3d63cdb15b` | Copyright (c) 2023 — Present shadcnblocks | announcement, snippet |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) @ `120f64f6ca` | Copyright (c) 2024 ibelick | animated-background, morphing-dialog (Pro) |
| [Cult UI](https://github.com/nolly-studio/cult-ui) | Copyright (c) 2023 Jordan-Gilliam | dynamic-island (Pro) |
| [Fancy Components](https://github.com/danielpetho/fancy) | Copyright (c) 2024 Daniel Petho | text-rotate (Pro) |
| [ReUI](https://github.com/keenthemes/reui) | Copyright (c) 2025 Keenthemes Inc | data-grid (Pro) |

The coss monorepo root is AGPL-3.0; nothing outside its MIT-licensed
`apps/origin` folder was used.

### MIT License

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## Apache-2.0-licensed sources

| Project | Copyright | Used for |
| --- | --- | --- |
| [Tremor](https://github.com/tremorlabs/tremor) @ `ca4d588f47` (Tremor Raw v1.0.0) | Copyright © 2025 Tremor | tracker, bar-list |

Licensed under the Apache License, Version 2.0
(<https://www.apache.org/licenses/LICENSE-2.0>). Both files were **modified**
for Blank: tailwind-variants and Tailwind palette colours replaced with Blank
semantic tokens, `@radix-ui/react-hover-card` replaced with Blank's Tooltip,
`forwardRef` removed, keyboard and list semantics added, link rows no longer
nested in buttons. Each modified file carries a notice saying so. The upstream
repository has no NOTICE file at this commit. Distributed on an "AS IS" basis,
without warranties or conditions of any kind.
