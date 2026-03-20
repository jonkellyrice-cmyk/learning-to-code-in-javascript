// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.FILE.002" intent="Kernel effects slice: general-purpose effect-as-data definitions for kernel hosting with ordered section anchors" kind="file" tags="kernel,effects,general-purpose,v0.2,sections"

/**
 * kernel/effects/effects.ts
 * ------------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 * - Effects are data-only descriptions. No side effects, no IO.
 */

import type {
  KernelEvent,
  KernelLogEntry,
  KernelModuleId,
  KernelState,
} from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.PRIMITIVES.002" intent="Primitives: general-purpose effect type union for kernel hosting (data-only)" kind="section" tags="kernel,effects,primitives"

export type KernelEffect =
  | {
      readonly type: "KERNEL_PERSIST_STATE";
      readonly state: KernelState;
    }
  | {
      readonly type: "KERNEL_APPEND_LOG";
      readonly entry: KernelLogEntry;
    }
  | {
      readonly type: "KERNEL_EMIT_EVENT";
      readonly event: KernelEvent;
    }
  | {
      readonly type: "KERNEL_NOTIFY_MODULE_UPDATED";
      readonly moduleId: KernelModuleId;
      readonly state: KernelState;
    }
  | {
      readonly type: "KERNEL_REPORT_ERROR";
      readonly message: string;
      readonly state: KernelState;
    };

// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.HELPERS.002" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,effects,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.COMPOSITION.002" intent="Composition: higher-level effect compositions for common kernel host effect groups (none yet)" kind="section" tags="kernel,effects,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.EFFECTS.SECTION.EXPORTS.002" intent="Exports: explicit public surface for effects slice" kind="section" tags="kernel,effects,exports"

// NOTE: exports are defined inline above.

// MDV_BLOCK:END id="KERNEL.EFFECTS.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.EFFECTS.FILE.002"