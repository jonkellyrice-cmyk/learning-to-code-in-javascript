// MDV_BLOCK:BEGIN id="KERNEL.TYPES.FILE.002" intent="Kernel vocabulary for v0.1 chat orchestrator (threads/messages) with section anchors and strict linear composition" kind="file" tags="kernel,types,v0.1,sections"

/**
 * kernel/types/types.ts
 * ---------------------
 * Policy:
 * - This file imports nothing.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 * - Types are the shared vocabulary used by all other kernel slices.
 */

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.PRIMITIVES.002" intent="Primitives: core domain vocabulary types for kernel (threads/messages/state/versioning)" kind="section" tags="kernel,types,primitives"

export type Brand<K, T extends string> = K & { readonly __brand: T };

export type EntityId = Brand<string, "EntityId">;
export type ItemId = Brand<string, "ItemId">;

export type ActorRole = "user" | "system";

export type SchemaVersion = 1;
export const KERNEL_SCHEMA_VERSION: SchemaVersion = 1;

export type ISODateString = Brand<string, "ISODateString">;

export type Entity = {
  readonly id: EntityId;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
};

export type Item = {
  readonly id: ItemId;
  readonly entityId: EntityId;
  readonly role: ActorRole;
  readonly content: string;
  readonly createdAt: ISODateString;
};

export type KernelState = {
  readonly schemaVersion: SchemaVersion;

  // Entities
  readonly entitiesById: Readonly<Record<string, Entity>>;
  readonly entityOrder: readonly EntityId[];
  readonly activeEntityId: EntityId | null;

  // Items
  readonly itemsByEntityId: Readonly<Record<string, readonly Item[]>>;

  // Kernel Modules (generic extensibility slot)
  readonly modulesById: Readonly<Record<string, unknown>>;
  readonly moduleOrder: readonly string[];
};

// --- Kernel module contract vocabulary (generic; modules plug into kernel via this interface)
export type KernelModuleId = string;

export type KernelModule<Event = unknown, Slice = unknown> = {
  readonly id: KernelModuleId;

  // Pure initial slice creation (deterministic). `now` enables time-stamping if needed.
  readonly initSlice: (now: ISODateString) => Slice;

  // Pure reducer: given prior slice + event, return next slice.
  readonly reduce: (slice: Slice, event: Event) => Slice;
};

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.HELPERS.002" intent="Helpers: minimal type-level utilities used by kernel slices (no runtime logic)" kind="section" tags="kernel,types,helpers"

export type Ok<T> = { readonly ok: true; readonly value: T };
export type Err<E = string> = { readonly ok: false; readonly error: E };
export type Result<T, E = string> = Ok<T> | Err<E>;

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.COMPOSITION.002" intent="Composition: derived/kernel-wide composite types (still types-only)" kind="section" tags="kernel,types,composition"

export type CreateEntityInput = {
  readonly now: ISODateString;
};

export type AppendItemInput = {
  readonly entityId: EntityId;
  readonly role: ActorRole;
  readonly content: string;
  readonly now: ISODateString;
};

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.TYPES.SECTION.EXPORTS.002" intent="Exports: public vocabulary surface (kept explicit to control public API)" kind="section" tags="kernel,types,exports"

// NOTE: This file directly exports its vocabulary via `export type`/`export const` above.
// This section exists as an explicit anchor for future re-exports or deprecations.

// MDV_BLOCK:END id="KERNEL.TYPES.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.TYPES.FILE.002" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4C9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/kernel/types/types.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/kernel/types/types.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/types/types.ts