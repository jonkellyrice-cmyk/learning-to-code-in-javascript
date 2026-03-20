// MDV_BLOCK:BEGIN id="KERNEL.ROOT.FILE.002" intent="Kernel composition root: pure applyAction reducer, state init, effect planning; composes general-purpose kernel host slices" kind="file" tags="kernel,root,general-purpose,v0.2,sections"

/**
 * kernel/kernel.ts
 * ----------------
 * Policy:
 * - This is the kernel composition root; it may import all kernel slices.
 * - Kernel slices do not import each other (only types), but kernel.ts composes them.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { ISODateString, KernelEvent, KernelModule, KernelState } from "./types";
import type { KernelAction } from "./actions";
import type { KernelEffect } from "./effects";

import { makeInitialState } from "./state";
import { validateState } from "./invariants";
import { applyKernelActionTransform } from "./transforms";

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.PRIMITIVES.002" intent="Primitives: local pure primitives used by kernel composition for general-purpose host behavior (no IO)" kind="section" tags="kernel,root,primitives"

export type KernelResult = {
  readonly state: KernelState;
  readonly effects: readonly KernelEffect[];
};

/**
 * Registry boundary type-erasure:
 * - kernel stores module slices in an untyped map (modulesById: Record<string, unknown>)
 * - therefore kernel composes modules with slice typed as `any` at the registry boundary
 */
type AnyKernelModule = KernelModule<KernelEvent, any>;

function persistEffect(state: KernelState): KernelEffect {
  return { type: "KERNEL_PERSIST_STATE", state };
}

function reportErrorEffect(message: string, state: KernelState): KernelEffect {
  return { type: "KERNEL_REPORT_ERROR", message, state };
}

function emitEventEffect(event: KernelEvent): KernelEffect {
  return { type: "KERNEL_EMIT_EVENT", event };
}

function notifyModuleUpdatedEffect(moduleId: string, state: KernelState): KernelEffect {
  return {
    type: "KERNEL_NOTIFY_MODULE_UPDATED",
    moduleId: moduleId as any,
    state,
  };
}

function nextStateOrReject(
  prev: KernelState,
  next: KernelState,
  effects: KernelEffect[],
): KernelResult {
  const res = validateState(next);

  if (!res.ok) {
    return {
      state: prev,
      effects: [
        ...effects,
        reportErrorEffect(
          `kernel transition rejected by invariants: ${res.error.join("; ")}`,
          prev,
        ),
      ],
    };
  }

  return {
    state: next,
    effects: [...effects, persistEffect(next)],
  };
}

function applyKernelModules(
  state: KernelState,
  event: KernelEvent,
  modules: readonly AnyKernelModule[],
): KernelState {
  if (modules.length === 0) return state;

  const prevModulesById =
    state.modulesById && typeof state.modulesById === "object"
      ? (state.modulesById as Record<string, unknown>)
      : {};

  const prevModuleOrder = Array.isArray(state.moduleOrder)
    ? [...state.moduleOrder]
    : [];

  const nextModulesById: Record<string, unknown> = { ...prevModulesById };
  const nextModuleOrder = [...prevModuleOrder];

  for (const mod of modules) {
    const moduleKey = String(mod.id);

    const prevSlice =
      moduleKey in nextModulesById
        ? (nextModulesById[moduleKey] as any)
        : mod.initSlice(event.at);

    const nextSlice = mod.reduce(prevSlice, event);

    nextModulesById[moduleKey] = nextSlice;

    if (!nextModuleOrder.some((existingId) => String(existingId) === moduleKey)) {
      nextModuleOrder.push(mod.id);
    }
  }

  return {
    ...state,
    modulesById: nextModulesById,
    moduleOrder: nextModuleOrder,
    lastUpdatedAt: event.at,
  };
}

function initKernelModulesAtTime(
  state: KernelState,
  now: ISODateString,
  modules: readonly AnyKernelModule[],
): KernelState {
  if (modules.length === 0) return state;

  const prevModulesById =
    state.modulesById && typeof state.modulesById === "object"
      ? (state.modulesById as Record<string, unknown>)
      : {};

  const prevModuleOrder = Array.isArray(state.moduleOrder)
    ? [...state.moduleOrder]
    : [];

  const nextModulesById: Record<string, unknown> = { ...prevModulesById };
  const nextModuleOrder = [...prevModuleOrder];

  for (const mod of modules) {
    const moduleKey = String(mod.id);

    if (!(moduleKey in nextModulesById)) {
      nextModulesById[moduleKey] = mod.initSlice(now);
    }

    if (!nextModuleOrder.some((existingId) => String(existingId) === moduleKey)) {
      nextModuleOrder.push(mod.id);
    }
  }

  return {
    ...state,
    modulesById: nextModulesById,
    moduleOrder: nextModuleOrder,
    lastUpdatedAt: now,
  };
}

function planEffectsFromEvents(
  state: KernelState,
  events: readonly KernelEvent[],
): KernelEffect[] {
  const effects: KernelEffect[] = [];

  for (const event of events) {
    effects.push(emitEventEffect(event));

    if (event.moduleId !== null) {
      effects.push(notifyModuleUpdatedEffect(String(event.moduleId), state));
    }
  }

  return effects;
}

// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.HELPERS.002" intent="Helpers: intentionally empty; transition logic lives in transforms slice" kind="section" tags="kernel,root,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.COMPOSITION.002" intent="Composition: public kernel functions (init + reducer) composed from general-purpose host slices" kind="section" tags="kernel,root,composition"

const KERNEL_MODULES: readonly AnyKernelModule[] = [];

export function makeKernelInitialState(now: ISODateString): KernelState {
  const base = makeInitialState(now);
  return initKernelModulesAtTime(base, now, KERNEL_MODULES);
}

export function applyAction(state: KernelState, action: KernelAction): KernelResult {
  const { nextState: nextStateFromTransform, events } = applyKernelActionTransform(
    state,
    action,
  );

  let nextState = nextStateFromTransform;

  for (const event of events) {
    nextState = applyKernelModules(nextState, event, KERNEL_MODULES);
  }

  const planned = planEffectsFromEvents(nextState, events);
  return nextStateOrReject(state, nextState, planned);
}

export function applyEvent(
  state: KernelState,
  event: KernelEvent,
  modules: readonly AnyKernelModule[] = KERNEL_MODULES,
): KernelResult {
  const nextState = applyKernelModules(state, event, modules);
  const planned = planEffectsFromEvents(nextState, [event]);
  return nextStateOrReject(state, nextState, planned);
}

// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.ROOT.SECTION.EXPORTS.002" intent="Exports: explicit public surface for kernel root" kind="section" tags="kernel,root,exports"

export type { KernelAction } from "./actions";
export type { KernelEffect } from "./effects";
export type { KernelState } from "./types";
export type { KernelEvent } from "./types";
export type { KernelModule } from "./types";

// MDV_BLOCK:END id="KERNEL.ROOT.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.ROOT.FILE.002"