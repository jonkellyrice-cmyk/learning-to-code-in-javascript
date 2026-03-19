// MDV_BLOCK:BEGIN id="KERNEL.STATE.FILE.001" intent="Kernel state slice: pure initialization for KernelState with ordered section anchors" kind="file" tags="kernel,state,v0.1,sections"

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

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.PRIMITIVES.001" intent="Primitives: pure state constructors and foundational state primitives" kind="section" tags="kernel,state,primitives"

export function makeInitialState(_now: ISODateString): KernelState {
  return {
    schemaVersion: KERNEL_SCHEMA_VERSION,

    entitiesById: {},
    entityOrder: [],
    activeEntityId: null,

    itemsByEntityId: {},

    // --- Kernel module host (generic extensibility slot)
    modulesById: {},
    moduleOrder: [],
  };
}

// MDV_BLOCK:END id="KERNEL.STATE.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.HELPERS.001" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,state,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.STATE.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.COMPOSITION.001" intent="Composition: higher-level state composition helpers (none yet)" kind="section" tags="kernel,state,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.STATE.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.STATE.SECTION.EXPORTS.001" intent="Exports: explicit public surface for state slice" kind="section" tags="kernel,state,exports"

// NOTE: exports are defined inline above (makeInitialState).
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="KERNEL.STATE.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.STATE.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/state/state.ts