// MDV_BLOCK:BEGIN id="DATA.TABLE.EXAMPLE.FILE.001" intent="Example callable/static table stub for procedural generation" kind="file" tags="data,tables,stub"

/**
 * data/tables/exampletable.ts
 * ---------------------------
 * Policy:
 * - Data or deterministic callables only.
 * - No IO, no side effects.
 * - No app/kernel/engine imports.
 * - Intended to be reusable across engines/skills.
 */

// MDV_BLOCK:BEGIN id="DATA.TABLE.EXAMPLE.SECTION.PRIMITIVES.001" intent="Primitives: minimal example table data" kind="section" tags="data,tables,primitives"

export type ExampleTableEntry = string;

export const exampleTable: readonly ExampleTableEntry[] = [
  "alpha",
  "beta",
  "gamma",
] as const;

// MDV_BLOCK:END id="DATA.TABLE.EXAMPLE.SECTION.PRIMITIVES.001"


// MDV_BLOCK:BEGIN id="DATA.TABLE.EXAMPLE.SECTION.HELPERS.001" intent="Helpers: optional deterministic helpers (none yet)" kind="section" tags="data,tables,helpers"
// (no helpers yet)
// MDV_BLOCK:END id="DATA.TABLE.EXAMPLE.SECTION.HELPERS.001"


// MDV_BLOCK:BEGIN id="DATA.TABLE.EXAMPLE.SECTION.COMPOSITION.001" intent="Composition: higher-level table compositions (none yet)" kind="section" tags="data,tables,composition"
// (no composition yet)
// MDV_BLOCK:END id="DATA.TABLE.EXAMPLE.SECTION.COMPOSITION.001"


// MDV_BLOCK:BEGIN id="DATA.TABLE.EXAMPLE.SECTION.EXPORTS.001" intent="Exports: explicit public surface for example table" kind="section" tags="data,tables,exports"

// NOTE: exports are defined inline above.

// MDV_BLOCK:END id="DATA.TABLE.EXAMPLE.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="DATA.TABLE.EXAMPLE.FILE.001"