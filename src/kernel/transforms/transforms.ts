// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.FILE.002" intent="Kernel transforms slice: pure state transition logic for general-purpose kernel hosting actions (no side effects)" kind="file" tags="kernel,transforms,general-purpose,v0.2,sections"

/**
 * kernel/transforms/transforms.ts
 * -------------------------------
 * Policy:
 * - Pure transforms only (no IO, no side effects).
 * - Allowed kernel imports:
 *   - kernel/types (via adapter)
 *   - kernel/actions (type-only via adapter) to accept the action union.
 *   - kernel/events (type-only) to emit canonical KernelEvent[] for module reducers.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { KernelAction } from "../actions";
import type { KernelEvent, KernelModuleId, KernelState } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.PRIMITIVES.002" intent="Primitives: minimal pure transform helpers for immutable general-purpose KernelState updates" kind="section" tags="kernel,transforms,primitives"

export type TransformResult = {
  readonly nextState: KernelState;
  readonly events: readonly KernelEvent[];
};

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.HELPERS.002" intent="Helpers: intentionally minimal; used only to reduce repeated immutable update patterns" kind="section" tags="kernel,transforms,helpers"

function unreachable(x: never): never {
  throw new Error(`Unhandled KernelAction: ${String(x)}`);
}

function moduleOrderIncludes(
  moduleOrder: readonly KernelModuleId[],
  moduleId: KernelModuleId,
): boolean {
  return moduleOrder.some((existingId) => String(existingId) === String(moduleId));
}

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.COMPOSITION.002" intent="Composition: action-specific pure transforms returning next KernelState for general-purpose kernel hosting" kind="section" tags="kernel,transforms,composition"

export function applyKernelActionTransform(
  state: KernelState,
  action: KernelAction,
): TransformResult {
  switch (action.type) {
    case "KERNEL_SET_STATUS":
      return {
        nextState: {
          ...state,
          status: action.status,
          lastUpdatedAt: action.now,
        },
        events: [],
      };

    case "KERNEL_SET_ACTIVE_MODULE":
      return {
        nextState: {
          ...state,
          activeModuleId: action.moduleId,
          lastUpdatedAt: action.now,
        },
        events: [],
      };

    case "KERNEL_REGISTER_MODULE":
      return {
        nextState: {
          ...state,
          modulesById: {
            ...state.modulesById,
            [String(action.moduleId)]:
              state.modulesById[String(action.moduleId)] ?? null,
          },
          moduleOrder: moduleOrderIncludes(state.moduleOrder, action.moduleId)
            ? state.moduleOrder
            : [...state.moduleOrder, action.moduleId],
          lastUpdatedAt: action.now,
        },
        events: [],
      };

    case "KERNEL_RECORD_ERROR":
      return {
        nextState: {
          ...state,
          status: "error",
          lastError: action.message,
          lastUpdatedAt: action.now,
        },
        events: [],
      };

    case "KERNEL_APPEND_LOG":
      return {
        nextState: {
          ...state,
          lastUpdatedAt: action.now,
        },
        events: [],
      };

    case "KERNEL_DISPATCH_EVENT":
      return {
        nextState: {
          ...state,
          lastUpdatedAt: action.now,
        },
        events: [action.event],
      };

    default:
      return unreachable(action as never);
  }
}

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.EXPORTS.002" intent="Exports: explicit public surface for transforms slice" kind="section" tags="kernel,transforms,exports"

// NOTE: exports are defined inline above (applyKernelActionTransform).

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.FILE.002"