// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.FILE.001" intent="Kernel errors slice stub: reserved for future typed diagnostics and error codes" kind="file" tags="kernel,errors,v0.1,sections"

/**
 * kernel/errors/errors.ts
 * -----------------------
 * Policy:
 * - Types only (no IO, no side effects).
 * - Errors describe *why something failed*, not *what happened*.
 * - Intended for deterministic, machine-checkable error handling.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.PRIMITIVES.001" intent="Primitives: error codes and minimal error shapes (none yet)" kind="section" tags="kernel,errors,primitives"
// (no primitives yet)
// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.PRIMITIVES.001"


// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.HELPERS.001" intent="Helpers: constructors/guards (avoid unless zero-runtime and reduces churn)" kind="section" tags="kernel,errors,helpers"
// (no helpers yet)
// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.HELPERS.001"


// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.COMPOSITION.001" intent="Composition: higher-level error composition utilities (none yet)" kind="section" tags="kernel,errors,composition"
// (no composition yet)
// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.COMPOSITION.001"


// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.EXPORTS.001" intent="Exports: explicit public surface for errors slice" kind="section" tags="kernel,errors,exports"
// NOTE: exports intentionally empty for v0.1 stub.
// This anchor exists for future controlled re-exports.
// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.ERRORS.FILE.001"