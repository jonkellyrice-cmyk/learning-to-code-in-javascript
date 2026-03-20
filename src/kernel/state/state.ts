// MDV_BLOCK:BEGIN id="KERNEL.STATE.FILE.002" intent="Kernel state slice: pure initialization for general-purpose KernelState with ordered section anchors" kind="file" tags="kernel,state,general-purpose,v0.2,sections"

/**
 * kernel/state/state.ts
 * ---------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { ISODateString, KernelState } from "../types";
import { KERNEL_SCHEMA_VERSION } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.PRIMITIVES.002" intent="Primitives: pure state constructors and foundational state primitives for general-purpose kernel state" kind="section" tags="kernel,state,primitives"

export function makeInitialState(now: ISODateString): KernelState {
  return {
    schemaVersion: KERNEL_SCHEMA_VERSION,
    status: "idle",
    activeModuleId: null,
    modulesById: {},
    moduleOrder: [],
    lastUpdatedAt: now,
    lastError: null,
  };
}

// MDV_BLOCK:END id="KERNEL.STATE.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.HELPERS.002" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,state,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.STATE.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.COMPOSITION.002" intent="Composition: higher-level state composition helpers (none yet)" kind="section" tags="kernel,state,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.STATE.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.EXPORTS.002" intent="Exports: explicit public surface for state slice" kind="section" tags="kernel,state,exports"

// NOTE: exports are defined inline above (makeInitialState).
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="KERNEL.STATE.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.STATE.FILE.002"