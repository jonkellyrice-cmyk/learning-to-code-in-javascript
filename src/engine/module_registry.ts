// MDV_BLOCK:BEGIN id="ENGINE.MODULE_REGISTRY.FILE.002" intent="Engine-owned module registry: standard catalog, module contract schema, and lookup helpers for plug-and-play modules" kind="file" tags="engine,module-registry,general-purpose,v0.2,sections"

/**
 * engine/module_registry.ts
 * -------------------------
 * Policy:
 * - This file belongs to engine, not kernel.
 * - It defines the engine-visible module catalog, standard module contract,
 *   and lookup helpers.
 * - It must not contain module business logic.
 * - It may import module public interfaces and normalize them into a common registry shape.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { ISODateString, KernelModuleId } from "../kernel/types";

import {
  TYPEGEN_MODULE,
  type TypegenCommand,
  type TypegenDraftState,
  type TypegenViewModel,
} from "../module_typegen/typegen";

// MDV_BLOCK:BEGIN id="ENGINE.MODULE_REGISTRY.SECTION.PRIMITIVES.002" intent="Primitives: engine-visible module names, statuses, standardized module registry shape, and generic plug-and-play module contract" kind="section" tags="engine,module-registry,primitives"

export type EngineModuleName =
  | "planner"
  | "modeler"
  | "type-maker"
  | "state-maker"
  | "action-maker"
  | "transform-maker"
  | "exporter";

export type EngineModuleStatus = "planned" | "placeholder" | "ready";

export type EngineModuleDefinition = {
  readonly name: EngineModuleName;
  readonly moduleId: KernelModuleId;
  readonly title: string;
  readonly description: string;
  readonly status: EngineModuleStatus;
};

export type EngineModuleContract<
  TState,
  TCommand,
  TViewModel,
  TName extends EngineModuleName = EngineModuleName,
> = EngineModuleDefinition & {
  readonly name: TName;
  readonly makeInitialState: (now: ISODateString) => TState;
  readonly handleCommand: (
    state: TState,
    command: TCommand,
  ) => { readonly nextState: TState };
  readonly selectViewModel: (state: TState) => TViewModel;
};

export type TypegenEngineModuleContract = EngineModuleContract<
  TypegenDraftState,
  TypegenCommand,
  TypegenViewModel,
  "type-maker"
>;

export type EngineRegisteredModule = EngineModuleDefinition | TypegenEngineModuleContract;

// MDV_BLOCK:END id="ENGINE.MODULE_REGISTRY.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="ENGINE.MODULE_REGISTRY.SECTION.HELPERS.002" intent="Helpers: minimal lookup helpers for engine-visible module catalog" kind="section" tags="engine,module-registry,helpers"

export function findModuleByName(
  modules: readonly EngineModuleDefinition[],
  moduleName: EngineModuleName,
): EngineModuleDefinition | null {
  return modules.find((mod) => mod.name === moduleName) ?? null;
}

export function findModuleNameById(
  modules: readonly EngineModuleDefinition[],
  moduleId: KernelModuleId | null,
): EngineModuleName | null {
  if (moduleId === null) return null;

  const match = modules.find(
    (mod) => String(mod.moduleId) === String(moduleId),
  );

  return match?.name ?? null;
}

// MDV_BLOCK:END id="ENGINE.MODULE_REGISTRY.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="ENGINE.MODULE_REGISTRY.SECTION.COMPOSITION.002" intent="Composition: standardized engine module catalog for current planner/modeler/builder system" kind="section" tags="engine,module-registry,composition"

export const ENGINE_MODULES: readonly EngineModuleDefinition[] = [
  {
    name: "planner",
    moduleId: "planner" as KernelModuleId,
    title: "Planner",
    description:
      "Top-down app planning: purpose, capabilities, entities, workflows, rules, and UI surfaces.",
    status: "placeholder",
  },
  {
    name: "modeler",
    moduleId: "modeler" as KernelModuleId,
    title: "Modeler",
    description:
      "Middle-layer system modeling: types, state shape, actions, relationships, and constraints.",
    status: "placeholder",
  },
  {
    name: TYPEGEN_MODULE.name,
    moduleId: TYPEGEN_MODULE.moduleId,
    title: TYPEGEN_MODULE.title,
    description: TYPEGEN_MODULE.description,
    status: TYPEGEN_MODULE.status,
  },
  {
    name: "state-maker",
    moduleId: "state-maker" as KernelModuleId,
    title: "State Maker",
    description:
      "Builder module for creating state shapes and initial-state constructors.",
    status: "placeholder",
  },
  {
    name: "action-maker",
    moduleId: "action-maker" as KernelModuleId,
    title: "Action Maker",
    description:
      "Builder module for creating action vocabularies and action payload shapes.",
    status: "placeholder",
  },
  {
    name: "transform-maker",
    moduleId: "transform-maker" as KernelModuleId,
    title: "Transform Maker",
    description:
      "Builder module for creating pure state transition logic from actions.",
    status: "placeholder",
  },
  {
    name: "exporter",
    moduleId: "exporter" as KernelModuleId,
    title: "Exporter",
    description:
      "Build/export module for turning the internal project into a normal repo/package.",
    status: "placeholder",
  },
];

export const ENGINE_READY_MODULES = {
  typegen: TYPEGEN_MODULE,
} as const;

// MDV_BLOCK:END id="ENGINE.MODULE_REGISTRY.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="ENGINE.MODULE_REGISTRY.SECTION.EXPORTS.002" intent="Exports: explicit public surface for engine-owned module registry" kind="section" tags="engine,module-registry,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="ENGINE.MODULE_REGISTRY.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="ENGINE.MODULE_REGISTRY.FILE.002"