// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.FILE.001" intent="Kernel invariants slice: v0.1 state validation rules (pure) with ordered section anchors" kind="file" tags="kernel,invariants,v0.1,sections"

/**
 * kernel/invariants/invariants.ts
 * -------------------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 * - Invariants are pure checks: no side effects, no IO.
 */

import type { KernelState, Result } from "../types";
import { KERNEL_SCHEMA_VERSION } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.PRIMITIVES.001" intent="Primitives: minimal state validation (returns Result<void, string[]>)" kind="section" tags="kernel,invariants,primitives"

export function validateState(state: KernelState): Result<void, readonly string[]> {
  const errors: string[] = [];

  if (state.schemaVersion !== KERNEL_SCHEMA_VERSION) {
    errors.push(`schemaVersion mismatch: expected ${KERNEL_SCHEMA_VERSION}, got ${state.schemaVersion}`);
  }

  if (errors.length > 0) return { ok: false, error: errors };
  return { ok: true, value: undefined };
}

// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.HELPERS.001" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,invariants,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.COMPOSITION.001" intent="Composition: higher-level invariant compositions (none yet)" kind="section" tags="kernel,invariants,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.EXPORTS.001" intent="Exports: explicit public surface for invariants slice" kind="section" tags="kernel,invariants,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.INVARIANTS.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/invariants/invariants.ts