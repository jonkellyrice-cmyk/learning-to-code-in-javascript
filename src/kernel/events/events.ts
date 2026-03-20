// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.FILE.002" intent="Kernel events slice: general-purpose event vocabulary and event construction helpers for kernel hosting" kind="file" tags="kernel,events,general-purpose,v0.2,sections"

/**
 * kernel/events/events.ts
 * -----------------------
 * Policy:
 * - Pure data/types only (no IO, no side effects).
 * - Events describe what happened, not what to do.
 * - Intended for auditability, replay, explanation, and stitching.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type {
  ISODateString,
  KernelEvent,
  KernelEventType,
  KernelModuleId,
} from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.PRIMITIVES.002" intent="Primitives: event types and minimal event shapes for general-purpose kernel hosting" kind="section" tags="kernel,events,primitives"

export type KernelEventMeta = Readonly<Record<string, unknown>>;

export type KernelHostEventPayload = Readonly<Record<string, unknown>>;

export type KernelHostEvent = KernelEvent<KernelHostEventPayload> & {
  readonly meta?: KernelEventMeta;
};

// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.HELPERS.002" intent="Helpers: event construction helpers (avoid unless zero-runtime and reduces churn)" kind="section" tags="kernel,events,helpers"

export function makeKernelEvent(
  type: KernelEventType | string,
  at: ISODateString,
  payload: KernelHostEventPayload,
  moduleId: KernelModuleId | null = null,
  meta?: KernelEventMeta,
): KernelHostEvent {
  return {
    type,
    at,
    payload,
    moduleId,
    ...(meta ? { meta } : {}),
  };
}

// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.COMPOSITION.002" intent="Composition: higher-level event composition utilities for common kernel host events" kind="section" tags="kernel,events,composition"

export function makeKernelModuleRegisteredEvent(
  moduleId: KernelModuleId,
  at: ISODateString,
): KernelHostEvent {
  return makeKernelEvent("kernel/module-registered", at, {}, moduleId);
}

export function makeKernelStatusChangedEvent(
  moduleId: KernelModuleId | null,
  at: ISODateString,
  nextStatus: string,
): KernelHostEvent {
  return makeKernelEvent(
    "kernel/status-changed",
    at,
    { nextStatus },
    moduleId,
  );
}

export function makeKernelErrorRecordedEvent(
  moduleId: KernelModuleId | null,
  at: ISODateString,
  message: string,
): KernelHostEvent {
  return makeKernelEvent(
    "kernel/error-recorded",
    at,
    { message },
    moduleId,
  );
}

// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.EXPORTS.002" intent="Exports: explicit public surface for events slice" kind="section" tags="kernel,events,exports"

// NOTE: exports are defined inline above.

// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.EVENTS.FILE.002"