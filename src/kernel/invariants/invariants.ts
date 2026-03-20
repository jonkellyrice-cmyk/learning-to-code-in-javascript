// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.FILE.002" intent="Kernel invariants slice: general-purpose kernel hosting state validation rules (pure) with ordered section anchors" kind="file" tags="kernel,invariants,general-purpose,v0.2,sections"

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

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.PRIMITIVES.002" intent="Primitives: minimal general-purpose kernel hosting state validation (returns Result<void, string[]>)" kind="section" tags="kernel,invariants,primitives"

export function validateState(state: KernelState): Result<void, readonly string[]> {
  const errors: string[] = [];

  if (state.schemaVersion !== KERNEL_SCHEMA_VERSION) {
    errors.push(
      `schemaVersion mismatch: expected ${KERNEL_SCHEMA_VERSION}, got ${state.schemaVersion}`,
    );
  }

  if (
    state.activeModuleId !== null &&
    !(String(state.activeModuleId) in state.modulesById)
  ) {
    errors.push(
      `activeModuleId is not registered: ${String(state.activeModuleId)}`,
    );
  }

  const seenModuleIds = new Set<string>();

  for (const moduleId of state.moduleOrder) {
    const moduleKey = String(moduleId);

    if (seenModuleIds.has(moduleKey)) {
      errors.push(`duplicate module id in moduleOrder: ${moduleKey}`);
      continue;
    }

    seenModuleIds.add(moduleKey);

    if (!(moduleKey in state.modulesById)) {
      errors.push(`moduleOrder references missing module: ${moduleKey}`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, error: errors };
  }

  return { ok: true, value: undefined };
}

// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.HELPERS.002" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,invariants,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.COMPOSITION.002" intent="Composition: higher-level invariant compositions (none yet)" kind="section" tags="kernel,invariants,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.INVARIANTS.SECTION.EXPORTS.002" intent="Exports: explicit public surface for invariants slice" kind="section" tags="kernel,invariants,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="KERNEL.INVARIANTS.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.INVARIANTS.FILE.002"