# GitHub Copilot Instructions — SolidStart Frontend Boilerplate

## Core Tech Stack
- Framework: SolidStart v2 (SolidJS 1.9)
- UI Primitives: Ark UI (`@ark-ui/solid`) + Tailwind CSS v4 + Class Variance Authority (CVA)
- State & Data Fetching: TanStack Solid Query v5 & Solid Table v9
- Forms & Validation: Formisch (`@formisch/solid`) + Valibot (`valibot`)
- Icons: `lucide-solid`

## Ark UI Documentation (LLMs.txt)
- Full SolidJS Documentation: https://ark-ui.com/llms-solid.txt
- Component Endpoints: https://ark-ui.com/llms.txt/components/{component}?framework=solid
- Component Index: https://ark-ui.com/llms.txt
- Local Quick Index: `.agents/skills/ark-ui/references/components-index.md`

## Critical Rules
1. **Never destructure props**: SolidJS fine-grained reactivity tracks property access. Always use `splitProps(props, [...])` or direct `props.*`.
2. **Ark UI Primitives**: Build accessible UI in `src/components/ui/` using `@ark-ui/solid/<component>`.
3. **Semantic Tokens**: Use Tailwind v4 design tokens (`bg-background`, `text-foreground`, `border-border`, etc.). Never hardcode hex values.
4. **Path Alias**: Always import internal modules using `~` (e.g. `~/components/ui/button`, `~/lib/utils`).
