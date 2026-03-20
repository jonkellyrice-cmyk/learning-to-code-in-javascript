// MDV_BLOCK:BEGIN id="ENGINE.KERNEL_BRIDGE.FILE.001" intent="Engine-owned kernel bridge: thin helpers for applying kernel actions and bootstrapping registered modules" kind="file" tags="engine,kernel-bridge,general-purpose,v0.1,sections"

/**
 * engine/kernel_bridge.ts
 * -----------------------
 * Policy:
 * - This file belongs to engine, not kernel.
 * - It is the thin bridge between engine orchestration and kernel application.
 * - It may import kernel public surface.
 * - It must not contain module-specific business logic.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import {
  applyAction,
  makeKernelInitialState,
} from "../kernel";

import type {
  KernelAction,
  KernelEffect,
  KernelState,
} from "../kernel";

import type {
  ISODateString,
  KernelModuleId,
} from "../kernel/types";

// MDV_BLOCK:BEGIN id="ENGINE.KERNEL_BRIDGE.SECTION.PRIMITIVES.001" intent="Primitives: minimal bridge types for kernel application and module registration" kind="section" tags="engine,kernel-bridge,primitives"

export type KernelBridgeResult = {
  readonly kernelState: KernelState;
  readonly effects: readonly KernelEffect[];
};

export type KernelBridgeModuleRegistration = {
  readonly moduleId: KernelModuleId;
};

// MDV_BLOCK:END id="ENGINE.KERNEL_BRIDGE.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="ENGINE.KERNEL_BRIDGE.SECTION.HELPERS.001" intent="Helpers: minimal kernel bridge helper for applying a single kernel action" kind="section" tags="engine,kernel-bridge,helpers"

export function dispatchKernelAction(
  state: KernelState,
  action: KernelAction,
): KernelBridgeResult {
  const result = applyAction(state, action);

  return {
    kernelState: result.state,
    effects: result.effects,
  };
}

// MDV_BLOCK:END id="ENGINE.KERNEL_BRIDGE.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="ENGINE.KERNEL_BRIDGE.SECTION.COMPOSITION.001" intent="Composition: public bridge workflows for bootstrapping kernel state, registering modules, and applying common kernel host actions" kind="section" tags="engine,kernel-bridge,composition"

export function makeBootstrappedKernelState(now: ISODateString): KernelState {
  return makeKernelInitialState(now);
}

export function registerAllKernelModules(
  state: KernelState,
  modules: readonly KernelBridgeModuleRegistration[],
  now: ISODateString,
): KernelBridgeResult {
  let nextState = state;
  const collectedEffects: KernelEffect[] = [];

  for (const mod of modules) {
    const result = dispatchKernelAction(nextState, {
      type: "KERNEL_REGISTER_MODULE",
      moduleId: mod.moduleId,
      now,
    });

    nextState = result.kernelState;
    collectedEffects.push(...result.effects);
  }

  return {
    kernelState: nextState,
    effects: collectedEffects,
  };
}

export function setKernelStatus(
  state: KernelState,
  status: KernelState["status"],
  now: ISODateString,
): KernelBridgeResult {
  return dispatchKernelAction(state, {
    type: "KERNEL_SET_STATUS",
    status,
    now,
  });
}

export function setActiveKernelModule(
  state: KernelState,
  moduleId: KernelModuleId | null,
  now: ISODateString,
): KernelBridgeResult {
  return dispatchKernelAction(state, {
    type: "KERNEL_SET_ACTIVE_MODULE",
    moduleId,
    now,
  });
}

// MDV_BLOCK:END id="ENGINE.KERNEL_BRIDGE.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="ENGINE.KERNEL_BRIDGE.SECTION.EXPORTS.001" intent="Exports: explicit public surface for engine-owned kernel bridge" kind="section" tags="engine,kernel-bridge,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="ENGINE.KERNEL_BRIDGE.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="ENGINE.KERNEL_BRIDGE.FILE.001"