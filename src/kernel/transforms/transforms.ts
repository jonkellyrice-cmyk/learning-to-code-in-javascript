// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.FILE.001", intent="Kernel transforms slice: pure state transition logic for v0.1 actions (no side effects)", kind="file", tags="kernel,transforms,v0.1,sections"

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
import type { KernelEvent } from "../events";
import type { KernelState } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.PRIMITIVES.001", intent="Primitives: minimal pure transform helpers for immutable KernelState updates", kind="section", tags="kernel,transforms,primitives"

export type TransformResult = {
  readonly nextState: KernelState;
  readonly events: readonly KernelEvent[];
};

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.HELPERS.001", intent="Helpers: intentionally minimal; used only to reduce repeated immutable update patterns", kind="section", tags="kernel,transforms,helpers"

function unreachable(x: never): never {
  throw new Error(`Unhandled KernelAction: ${String(x)}`);
}

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.COMPOSITION.001", intent="Composition: action-specific pure transforms returning next KernelState", kind="section", tags="kernel,transforms,composition"

export function applyKernelActionTransform(state: KernelState, action: KernelAction): TransformResult {
  // Template baseline: no domain transitions defined.
  // Downstream projects should implement their own action->state logic here.
  switch (action.type) {
    default:
      return unreachable(action as never);
  }
}

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.TRANSFORMS.SECTION.EXPORTS.001", intent="Exports: explicit public surface for transforms slice", kind="section", tags="kernel,transforms,exports"

// NOTE: exports are defined inline above (applyKernelActionTransform).

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.TRANSFORMS.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/transforms/transforms.ts