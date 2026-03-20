// MDV_BLOCK:BEGIN id="KERNEL.TYPES.FILE.003" intent="General-purpose kernel vocabulary for future planner/modeler/builder-style modules with section anchors and strict linear composition" kind="file" tags="kernel,types,general-purpose,v0.2,sections"

/**
 * kernel/types/types.ts
 * ---------------------
 * Policy:
 * - This file imports nothing.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 * - Types are the shared vocabulary used by all other kernel slices.
 * - Kernel vocabulary must remain general-purpose. App/module-specific concepts
 *   belong in modules, not here.
 */

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.PRIMITIVES.003" intent="Primitives: general-purpose kernel vocabulary types for ids, status, state host, and module contracts" kind="section" tags="kernel,types,primitives"

export type Brand<K, T extends string> = K & { readonly __brand: T };

export type KernelModuleId = Brand<string, "KernelModuleId">;
export type KernelEventType = Brand<string, "KernelEventType">;
export type SchemaVersion = 1;
export const KERNEL_SCHEMA_VERSION: SchemaVersion = 1;

export type ISODateString = Brand<string, "ISODateString">;

export type KernelStatus = "idle" | "running" | "success" | "error";
export type LogLevel = "info" | "warn" | "error";

export type KernelEvent<Payload = unknown> = {
  readonly type: KernelEventType | string;
  readonly moduleId: KernelModuleId | null;
  readonly at: ISODateString;
  readonly payload: Payload;
};

export type KernelLogEntry = {
  readonly level: LogLevel;
  readonly message: string;
  readonly at: ISODateString;
};

export type KernelState = {
  readonly schemaVersion: SchemaVersion;
  readonly status: KernelStatus;
  readonly activeModuleId: KernelModuleId | null;
  readonly modulesById: Readonly<Record<string, unknown>>;
  readonly moduleOrder: readonly KernelModuleId[];
  readonly lastUpdatedAt: ISODateString | null;
  readonly lastError: string | null;
};

export type KernelModule<Event = KernelEvent, Slice = unknown> = {
  readonly id: KernelModuleId;

  // Pure initial slice creation (deterministic). `now` enables time-stamping if needed.
  readonly initSlice: (now: ISODateString) => Slice;

  // Pure reducer: given prior slice + event, return next slice.
  readonly reduce: (slice: Slice, event: Event) => Slice;
};

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.PRIMITIVES.003"

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.HELPERS.003" intent="Helpers: minimal type-level utilities used by kernel slices (no runtime logic)" kind="section" tags="kernel,types,helpers"

export type Ok<T> = { readonly ok: true; readonly value: T };
export type Err<E = string> = { readonly ok: false; readonly error: E };
export type Result<T, E = string> = Ok<T> | Err<E>;

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.HELPERS.003"

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.COMPOSITION.003" intent="Composition: derived/kernel-wide composite types that remain general-purpose" kind="section" tags="kernel,types,composition"

export type RegisterKernelModuleInput = {
  readonly moduleId: KernelModuleId;
  readonly now: ISODateString;
};

export type SetKernelStatusInput = {
  readonly status: KernelStatus;
  readonly now: ISODateString;
};

export type RecordKernelErrorInput = {
  readonly message: string;
  readonly now: ISODateString;
};

export type AppendKernelLogInput = {
  readonly level: LogLevel;
  readonly message: string;
  readonly now: ISODateString;
};

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.COMPOSITION.003"

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.EXPORTS.003" intent="Exports: public vocabulary surface (kept explicit to control public API)" kind="section" tags="kernel,types,exports"

// NOTE: This file directly exports its vocabulary via `export type`/`export const` above.
// This section exists as an explicit anchor for future re-exports or deprecations.

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.EXPORTS.003"

// MDV_BLOCK:END id="KERNEL.TYPES.FILE.003"