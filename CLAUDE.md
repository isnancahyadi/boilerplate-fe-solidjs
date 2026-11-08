# Claude Code Instructions — SolidStart Frontend Boilerplate

## Commands
- Dev Server: `pnpm dev`
- Build: `pnpm build`
- Unit Test: `pnpm test`
- E2E Test: `pnpm test:e2e`
- Lint & Format Check: `pnpm check` (or `pnpm exec biome check src`)
- Commit: `pnpm git:commit` (Conventional Commits via Commitizen)

## Ark UI Documentation (LLMs.txt)
- Full SolidJS Documentation: `https://ark-ui.com/llms-solid.txt`
- Component Markdown Endpoints: `https://ark-ui.com/llms.txt/components/{component}?framework=solid`
- Full Index: `https://ark-ui.com/llms.txt`
- Local Skill & Quick Index: `.agents/skills/ark-ui/SKILL.md` (and `.agents/skills/ark-ui/references/components-index.md`)

## Key Rules
1. **Never destructure props** in SolidJS components. Always use `splitProps(props, [...])`.
2. **Ark UI primitives** belong in `src/components/ui/` with pure copy-paste ownership.
3. **Tailwind CSS v4 semantic tokens** (`bg-background`, `border-border`, etc.) combined with `cva` and `cn()`.
4. Follow living rules in `AGENTS.md` and architecture in `ARCHITECTURE.md`.
