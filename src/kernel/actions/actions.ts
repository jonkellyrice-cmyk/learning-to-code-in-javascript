// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.FILE.002" intent="Kernel actions slice: general-purpose action vocabulary for kernel module hosting and orchestration with ordered section anchors" kind="file" tags="kernel,actions,general-purpose,v0.2,sections"

/**
 * kernel/actions/actions.ts
 * ------------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type {
  ISODateString,
  KernelEvent,
  KernelLogEntry,
  KernelModuleId,
  KernelStatus,
} from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.PRIMITIVES.002" intent="Primitives: minimal general-purpose KernelAction union for kernel hosting, orchestration, logging, and event dispatch" kind="section" tags="kernel,actions,primitives"

export type KernelAction =
  | {
      readonly type: "KERNEL_SET_STATUS";
      readonly status: KernelStatus;
      readonly now: ISODateString;
    }
  | {
      readonly type: "KERNEL_SET_ACTIVE_MODULE";
      readonly moduleId: KernelModuleId | null;
      readonly now: ISODateString;
    }
  | {
      readonly type: "KERNEL_REGISTER_MODULE";
      readonly moduleId: KernelModuleId;
      readonly now: ISODateString;
    }
  | {
      readonly type: "KERNEL_RECORD_ERROR";
      readonly message: string;
      readonly now: ISODateString;
    }
  | {
      readonly type: "KERNEL_APPEND_LOG";
      readonly entry: KernelLogEntry;
      readonly now: ISODateString;
    }
  | {
      readonly type: "KERNEL_DISPATCH_EVENT";
      readonly event: KernelEvent;
      readonly now: ISODateString;
    };

// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.HELPERS.002" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,actions,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.COMPOSITION.002" intent="Composition: higher-level action composition helpers (none yet)" kind="section" tags="kernel,actions,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.EXPORTS.002" intent="Exports: explicit public surface for actions slice" kind="section" tags="kernel,actions,exports"

// NOTE: exports are defined inline above (KernelAction).

// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.ACTIONS.FILE.002"