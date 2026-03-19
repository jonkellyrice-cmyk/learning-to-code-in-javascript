// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.FILE.001" intent="Kernel events slice stub: reserved for future domain event vocabulary and emission helpers" kind="file" tags="kernel,events,v0.1,sections"

/**
 * kernel/events/events.ts
 * -----------------------
 * Policy:
 * - Pure data/types only (no IO, no side effects).
 * - Events describe *what happened*, not *what to do*.
 * - Intended for auditability, replay, explanation, and stitching.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { ISODateString } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.PRIMITIVES.001" intent="Primitives: event types and minimal event shapes (generic)" kind="section" tags="kernel,events,primitives"

export type KernelEventMeta = Readonly<Record<string, unknown>>;

export type KernelEventBase<TType extends string = string, TPayload = unknown> = {
  readonly type: TType;
  readonly at: ISODateString;
  readonly payload: TPayload;
  readonly meta?: KernelEventMeta;
};

// Escape hatch / default union
export type KernelEvent = KernelEventBase;

// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.HELPERS.001" intent="Helpers: event construction helpers (avoid unless zero-runtime and reduces churn)" kind="section" tags="kernel,events,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.COMPOSITION.001" intent="Composition: higher-level event composition utilities (none yet)" kind="section" tags="kernel,events,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.EVENTS.SECTION.EXPORTS.001" intent="Exports: explicit public surface for events slice" kind="section" tags="kernel,events,exports"
// NOTE: exports are defined inline above.
// MDV_BLOCK:END id="KERNEL.EVENTS.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.EVENTS.FILE.001"