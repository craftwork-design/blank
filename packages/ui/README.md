# @blank/ui

Component sources for the blank registry. Each file under `src/` is written
exactly as it will land in a consumer project — `@/lib/utils`,
`@/components/ui/*`, `@/hooks/*` — so `shadcn build` ships it byte for byte
with no rewriting step in between.

The package is not built and has no tsconfig of its own: it is typechecked
through `apps/docs`, which resolves those same aliases against its own tree.
