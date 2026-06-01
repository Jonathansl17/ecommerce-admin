---
name: project-structure-guard
description: Executes changes in any codebase while respecting its real structure, prioritizing reuse of existing modules (hooks, components, utilities, services, classes), and avoiding unrequested actions. Stack-agnostic — works with React/Next/Vue/Vanilla JS/TS, Unity C#, or any other project.
disable-model-invocation: true
argument-hint: <task> [--stack=<auto|react|next|vue|vanilla|unity|node|other>] [--strict-scope] [--allow-suggestions]
---

# Project Structure Guard (Generic)

Use this skill to implement changes in any repository without breaking its structure or doing out-of-scope work. The skill is **stack-agnostic**: it discovers the project conventions before acting, instead of assuming them.

## Objective

1. Follow the existing project structure and conventions, whatever they are.
2. Reuse modules (hooks, components, utilities, services, classes, prefabs) before creating new ones.
3. Execute only what the user requests, without extra actions.

## Input

Receives the task in `ARGUMENTS`.

Optional flags:
- `--stack=<value>`: forces a stack instead of auto-detecting. Useful when discovery is ambiguous.
- `--strict-scope`: rejects ANY change outside the explicit request, even small adjacent fixes.
- `--allow-suggestions`: allows listing optional improvements at the end (default: on).

If there are no `ARGUMENTS`, request a single brief clarification and do not edit anything until it is provided.

---

## Phase 0: Mandatory Discovery (always, read-only)

Before proposing changes or editing files, perform this analysis. **Do not skip.**

### 0.1 — Detect stack and tooling

Read whichever of these exist (skip silently if absent):

- `package.json` → dependencies, scripts, framework signals (`next`, `react`, `vue`, `vite`, `astro`, etc.)
- `tsconfig.json` / `jsconfig.json` → path aliases, baseUrl, module resolution
- `vite.config.*` / `next.config.*` / `nuxt.config.*` / `webpack.config.*` → bundler aliases
- `*.csproj` / `Assets/` / `ProjectSettings/` → Unity project signals
- `pyproject.toml` / `requirements.txt` / `Cargo.toml` / `go.mod` → other ecosystems
- `pnpm-workspace.yaml` / `turbo.json` / `nx.json` / `lerna.json` → monorepo signals

Output of this step: a short internal map of `{ stack, language, aliases, isMonorepo, packageManager }`.

### 0.2 — Detect convention documents

Look for project-level conventions in (in order):
- `CLAUDE.md`, `AGENTS.md` at repo root
- `.agents/**/SKILL.md`, `.cursor/rules/**`, `.github/copilot-instructions.md`
- `CONTRIBUTING.md`, `ARCHITECTURE.md`, `docs/architecture*`, `docs/conventions*`
- `README.md` (only the structure/conventions section)

If found, **these override generic assumptions**.

### 0.3 — Map entry points and barrels

Locate the main module index/barrel files based on the detected stack:

| Stack | Typical locations to scan |
|---|---|
| React/Next | `src/components/index.*`, `app/components/index.*`, `src/hooks/index.*`, `src/lib/index.*` |
| Vue/Nuxt | `components/`, `composables/`, `stores/`, `utils/` |
| Vanilla JS/TS | `src/index.*`, `src/modules/`, `src/utils/` |
| Unity (C#) | `Assets/Scripts/**`, `Assets/Prefabs/**`, `Packages/manifest.json`, ScriptableObjects |
| Node backend | `src/services/`, `src/controllers/`, `src/repositories/`, `src/middlewares/` |

If barrel files exist, **read them** — they are the canonical public API of each layer.

### 0.4 — Map the impacted area

Based on the task, identify:
- Pages, routes, scenes, or screens involved
- Related components / scripts / classes
- Related hooks / composables / services / managers
- Constants, types, DTOs, utils, store/state involved
- Tests adjacent to the affected files

### 0.5 — Generate reuse map

Before editing, list:
1. **Existing modules that can be reused** as-is.
2. **Existing modules that can be extended** (new prop, new param, new overload).
3. **Real gaps** — only where no reasonable alternative exists.

---

## Reuse Rules (mandatory, stack-agnostic)

1. **Reuse from the project's public API first.** This means barrel exports (`@/components`, `@/hooks`, `~/composables`, etc.) or, in non-JS stacks, the established namespace/folder (`MyGame.Interaction.*`, `app.services.*`, etc.).
2. If a module with **equivalent behavior** exists, reuse it.
3. If the difference is small, **extend** the existing module via props/params/options/overloads instead of creating a new one.
4. Create a new module only when:
   - No reasonable option exists to extend/reuse, **and**
   - The requirement clearly needs it, **and**
   - The new module follows the project's existing patterns (naming, folder layout, file conventions).
5. Avoid duplicating logic for state, forms, session, navigation, tables, input handling, persistence, networking, or any cross-cutting concern that is already encapsulated.

**Tie-breaker:** if in doubt between creating new vs reusing, **choose reuse**.

---

## Structure and Style Rules

1. **Respect the project's path aliases** as detected in Phase 0.1. Do not introduce new aliases without explicit request.
2. **Respect the framework's routing/entry pattern** (Next App Router, Pages Router, Vue Router, Unity scene composition, etc.) as detected.
3. **Respect the project's UI/abstraction wrappers.** If the project has its own `Button`, `Section`, `BaseInteractable`, `BaseService`, etc., use them instead of raw primitives.
4. **Prefer centralized constants/enums** when they already exist. Do not introduce hardcoded literals if a constants module is in use.
5. **Preserve internal component/module patterns.** If a component has a `hooks/`, `utils/`, `constants/`, `types/` subfolder structure, keep modifying within that pattern. Do not flatten or restructure it.
6. **Match the project's language conventions** (naming case, file naming, comment style, language of identifiers).

---

## Strict Scope Control (very important)

Do not perform actions that were not explicitly requested.

**Prohibited without explicit request:**
- Large refactors or massive renaming
- Cosmetic changes in unrelated files (formatting, reordering imports, etc.)
- Reorganizing folder structure based on preference
- Installing, updating, or removing dependencies
- Changing global configurations (eslint, prettier, tsconfig, bundler config, CI, etc.)
- Running migrations, codemods, or risky scripts
- Adding logging, telemetry, or analytics not asked for
- "Modernizing" syntax (e.g., class → hooks, var → const) outside the affected lines

If you detect improvements outside scope, **list them as optional suggestions at the end** without implementing them (unless `--allow-suggestions=false`).

If `--strict-scope` is passed, do not even include suggestions — only the requested change.

---

## Execution Protocol

1. **Initial summary** (short, structured):
   - Detected stack and key conventions
   - Found structure relevant to the task
   - Reuse options identified (component/hook/service X can be reused/extended)
   - Exact scope to be modified (file list)

2. **Minimal plan** scoped strictly to the request.

3. **Implement** the minimal necessary changes.

4. **Focused verification** related only to the task:
   - Type-check the affected area if the project uses TS
   - Run tests adjacent to changed files if a test runner is configured
   - For Unity: confirm references/serialized fields aren't broken
   - Do **not** run a full build, full test suite, or full lint unless explicitly asked

5. **Deliver result** including:
   - What was **reused** (with paths)
   - What was **extended** and how (with paths)
   - What was **created new** and why it was necessary
   - Explicit confirmation that **no out-of-scope changes were made**
   - Optional: suggestions block (only if `--allow-suggestions` and not `--strict-scope`)

---

## Stack-specific notes (apply only when relevant)

### React / Next.js / Vue
- Reuse hooks/composables before writing inline state logic.
- Respect `'use client'` / `'use server'` boundaries in Next App Router.
- For React: when adding state, evaluate `useState` vs `useReducer` vs existing context/store before introducing a new state source.

### Vanilla JS/TS
- Respect existing module boundaries; do not collapse layered architecture into single files.
- Keep side effects isolated in the same layer where they already live.

### Unity / C#
- Reuse existing `MonoBehaviour`s, `ScriptableObject`s, and prefabs before creating new assets.
- Respect the project's separation between input, interaction, logic, state, and presentation layers if it exists.
- Do not change `[SerializeField]` signatures of components used in scenes/prefabs without explicit request — it breaks references.
- Prefer extending existing managers/services over creating parallel ones.

### Node / backend
- Reuse existing repositories, services, middlewares, validators, and DTOs.
- Respect the existing layering (controller → service → repository) and do not bypass it.

---

## Failure modes to avoid

- ❌ Creating `useFoo` when `useFooData` already does 90% of the work.
- ❌ Adding a new `Button` variant file when the existing `Button` accepts a `variant` prop.
- ❌ "While I was here, I also fixed…" — never. List it as a suggestion instead.
- ❌ Assuming the project uses a convention from another project you've seen.
- ❌ Editing config files to make your change work, instead of conforming to existing config.
