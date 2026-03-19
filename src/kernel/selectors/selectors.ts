// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.FILE.001" intent="Kernel selectors slice: v0.1 read-only selectors for threads/messages with ordered section anchors" kind="file" tags="kernel,selectors,v0.1,sections"

/**
 * kernel/selectors/selectors.ts
 * -----------------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 * - Selectors are pure read-only functions (no mutation, no side effects).
 */

import type { Entity, EntityId, Item, KernelState } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.PRIMITIVES.001" intent="Primitives: minimal pure selectors for kernel state" kind="section" tags="kernel,selectors,primitives"

export function selectSchemaVersion(state: KernelState): KernelState["schemaVersion"] {
  return state.schemaVersion;
}

export function selectActiveEntityId(state: KernelState): EntityId | null {
  return state.activeEntityId;
}

export function selectEntities(state: KernelState): readonly Entity[] {
  return state.entityOrder.map((id) => state.entitiesById[String(id)]).filter((e): e is Entity => Boolean(e));
}

export function selectEntityById(state: KernelState, entityId: EntityId): Entity | null {
  return state.entitiesById[String(entityId)] ?? null;
}

export function selectItemsForEntity(state: KernelState, entityId: EntityId): readonly Item[] {
  return state.itemsByEntityId[String(entityId)] ?? [];
}

// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.HELPERS.001" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,selectors,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.COMPOSITION.001" intent="Composition: higher-level selectors composed from primitives (none yet)" kind="section" tags="kernel,selectors,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.SELECTORS.SECTION.EXPORTS.001" intent="Exports: explicit public surface for selectors slice" kind="section" tags="kernel,selectors,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="KERNEL.SELECTORS.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.SELECTORS.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/selectors/selectors.ts