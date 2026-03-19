// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.FILE.001" intent="Kernel effects slice: v0.1 effect-as-data definitions with ordered section anchors" kind="file" tags="kernel,effects,v0.1,sections"

/**
 * kernel/effects/effects.ts
 * ------------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 * - Effects are data-only descriptions. No side effects, no IO.
 */

import type { KernelState } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.PRIMITIVES.001" intent="Primitives: effect type union for v0.1 (data-only)" kind="section" tags="kernel,effects,primitives"

export type KernelEffect =
  | {
      readonly type: "PERSIST_STATE";
      readonly state: KernelState;
    }
  | {
      readonly type: "LOG";
      readonly level: "debug" | "info" | "warn" | "error";
      readonly message: string;
      readonly data?: unknown;
    };

// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.HELPERS.001" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,effects,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.COMPOSITION.001" intent="Composition: higher-level effect compositions (none yet)" kind="section" tags="kernel,effects,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.EXPORTS.001" intent="Exports: explicit public surface for effects slice" kind="section" tags="kernel,effects,exports"

// NOTE: exports are defined inline above.

// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.EFFECTS.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/kernel/effects/effects.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/effects/effects.ts