// MDV_BLOCK:BEGIN id="KERNEL.ROOT.FILE.001" intent="Kernel composition root: pure applyAction reducer, state init, effect planning; composes all kernel slices" kind="file" tags="kernel,root,v0.1,sections"

/**
 * kernel/kernel.ts
 * ----------------
 * Policy:
 * - This is the kernel composition root; it may import all kernel slices.
 * - Kernel slices do not import each other (only types), but kernel.ts composes them.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { ISODateString, KernelModule, KernelState } from "./types";
import type { KernelAction } from "./actions";
import type { KernelEffect } from "./effects";
import type { KernelEvent } from "./events";

import { makeInitialState } from "./state";
import { validateState } from "./invariants";
import { applyKernelActionTransform } from "./transforms";

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.PRIMITIVES.001" intent="Primitives: local pure primitives used by kernel composition (no IO)" kind="section" tags="kernel,root,primitives"

export type KernelResult = {
  readonly state: KernelState;
  readonly effects: readonly KernelEffect[];
};

function persistEffect(state: KernelState): KernelEffect {
  return { type: "PERSIST_STATE", state };
}

function logEffect(
  level: "debug" | "info" | "warn" | "error",
  message: string,
  data?: unknown
): KernelEffect {
  return { type: "LOG", level, message, data };
}

function nextStateOrReject(prev: KernelState, next: KernelState, effects: KernelEffect[]): KernelResult {
  const res = validateState(next);
  if (!res.ok) {
    return {
      state: prev,
      effects: [...effects, logEffect("error", "kernel transition rejected by invariants", { errors: res.error })],
    };
  }
  return { state: next, effects: [...effects, persistEffect(next)] };
}

/**
 * Registry boundary type-erasure:
 * - kernel stores module slices in an untyped map (modulesById: Record<string, unknown>)
 * - therefore kernel composes modules with slice typed as `any` at the registry boundary
 */
type AnyKernelModule = KernelModule<KernelEvent, any>;

function applyKernelModules(
  state: KernelState,
  event: KernelEvent,
  modules: readonly AnyKernelModule[]
): KernelState {
  if (modules.length === 0) return state;

  const prevModulesById =
    state.modulesById && typeof state.modulesById === "object"
      ? (state.modulesById as Record<string, unknown>)
      : {};

  const prevModuleOrder = Array.isArray((state as any).moduleOrder) ? ((state as any).moduleOrder as string[]) : [];

  const nextModulesById: Record<string, unknown> = { ...prevModulesById };
  const nextModuleOrder: string[] = [...prevModuleOrder];

  for (const mod of modules) {
    const moduleKey = String(mod.id);

    const prevSlice = moduleKey in nextModulesById ? (nextModulesById[moduleKey] as any) : mod.initSlice(event.at);
    const nextSlice = mod.reduce(prevSlice, event);

    nextModulesById[moduleKey] = nextSlice;
    if (!nextModuleOrder.includes(moduleKey)) nextModuleOrder.push(moduleKey);
  }

  return { ...state, modulesById: nextModulesById, moduleOrder: nextModuleOrder };
}

function initKernelModulesAtTime(state: KernelState, now: ISODateString, modules: readonly AnyKernelModule[]): KernelState {
  if (modules.length === 0) return state;

  const prevModulesById =
    state.modulesById && typeof state.modulesById === "object"
      ? (state.modulesById as Record<string, unknown>)
      : {};

  const prevModuleOrder = Array.isArray((state as any).moduleOrder) ? ((state as any).moduleOrder as string[]) : [];

  const nextModulesById: Record<string, unknown> = { ...prevModulesById };
  const nextModuleOrder: string[] = [...prevModuleOrder];

  for (const mod of modules) {
    const moduleKey = String(mod.id);
    if (!(moduleKey in nextModulesById)) nextModulesById[moduleKey] = mod.initSlice(now);
    if (!nextModuleOrder.includes(moduleKey)) nextModuleOrder.push(moduleKey);
  }

  return { ...state, modulesById: nextModulesById, moduleOrder: nextModuleOrder };
}

// Template baseline: no event-driven effect planning by default.
function planEffectsFromEvents(_events: readonly KernelEvent[]): KernelEffect[] {
  return [];
}

// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.HELPERS.001" intent="Helpers: intentionally empty; transition logic lives in transforms slice" kind="section" tags="kernel,root,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.COMPOSITION.001" intent="Composition: public kernel functions (init + reducer) composed from slices" kind="section" tags="kernel,root,composition"

const KERNEL_MODULES: readonly AnyKernelModule[] = [];

export function makeKernelInitialState(now: ISODateString): KernelState {
  const base = makeInitialState(now);
  return initKernelModulesAtTime(base, now, KERNEL_MODULES);
}

export function applyAction(state: KernelState, action: KernelAction): KernelResult {
  const { nextState: nextStateFromTransform, events } = applyKernelActionTransform(state, action);

  let nextState = nextStateFromTransform;
  for (const ev of events) {
    nextState = applyKernelModules(nextState, ev, KERNEL_MODULES);
  }

  const planned = planEffectsFromEvents(events);
  return nextStateOrReject(state, nextState, planned);
}

export function applyEvent(
  state: KernelState,
  event: KernelEvent,
  modules: readonly AnyKernelModule[] = KERNEL_MODULES
): KernelResult {
  const nextState = applyKernelModules(state, event, modules);
  return nextStateOrReject(state, nextState, []);
}

// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.EXPORTS.001" intent="Exports: explicit public surface for kernel root" kind="section" tags="kernel,root,exports"

export type { KernelAction } from "./actions";
export type { KernelEffect } from "./effects";
export type { KernelState } from "./types";
export type { KernelEvent } from "./events";
export type { KernelModule } from "./types";

// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.ROOT.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/kernel/kernel.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/kernel.ts