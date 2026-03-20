// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.FILE.002" intent="Kernel selectors slice: general-purpose read-only selectors for kernel hosting state with ordered section anchors" kind="file" tags="kernel,selectors,general-purpose,v0.2,sections"

/**
 * kernel/selectors/selectors.ts
 * -----------------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 * - Selectors are pure read-only functions (no mutation, no side effects).
 */

import type { KernelModuleId, KernelState, KernelStatus } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.PRIMITIVES.002" intent="Primitives: minimal pure selectors for general-purpose kernel state" kind="section" tags="kernel,selectors,primitives"

export function selectSchemaVersion(state: KernelState): KernelState["schemaVersion"] {
  return state.schemaVersion;
}

export function selectKernelStatus(state: KernelState): KernelStatus {
  return state.status;
}

export function selectActiveModuleId(state: KernelState): KernelModuleId | null {
  return state.activeModuleId;
}

export function selectModulesById(state: KernelState): KernelState["modulesById"] {
  return state.modulesById;
}

export function selectModuleOrder(state: KernelState): readonly KernelModuleId[] {
  return state.moduleOrder;
}

export function selectModuleSliceById(
  state: KernelState,
  moduleId: KernelModuleId,
): unknown {
  return state.modulesById[String(moduleId)] ?? null;
}

export function selectLastUpdatedAt(state: KernelState): KernelState["lastUpdatedAt"] {
  return state.lastUpdatedAt;
}

export function selectLastError(state: KernelState): string | null {
  return state.lastError;
}

// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.HELPERS.002" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,selectors,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.COMPOSITION.002" intent="Composition: higher-level selectors composed from primitives for general-purpose kernel hosting" kind="section" tags="kernel,selectors,composition"

export function selectHasActiveModule(state: KernelState): boolean {
  return state.activeModuleId !== null;
}

export function selectModuleCount(state: KernelState): number {
  return state.moduleOrder.length;
}

export function selectHasError(state: KernelState): boolean {
  return state.lastError !== null;
}

// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.EXPORTS.002" intent="Exports: explicit public surface for selectors slice" kind="section" tags="kernel,selectors,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.SELECTORS.FILE.002"