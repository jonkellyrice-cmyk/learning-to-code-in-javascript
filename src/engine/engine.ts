// MDV_BLOCK:BEGIN id="ENGINE.FILE.002" intent="Engine v0.2: general-purpose orchestration layer for planner/modeler/builder-style modules over the general kernel host" kind="file" tags="engine,general-purpose,v0.2,sections"

/**
 * engine/engine.ts
 * ----------------
 * Policy:
 * - Engine is the orchestration layer, not a domain of truth.
 * - It composes kernel + feature modules.
 * - No UI imports. No app/router imports.
 * - Intended to remain framework-agnostic.
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

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.PRIMITIVES.002" intent="Primitives: engine request/response shapes and placeholder module catalog for planner/modeler/builder system" kind="section" tags="engine,primitives"

export type EngineModuleName =
  | "planner"
  | "modeler"
  | "type-maker"
  | "state-maker"
  | "action-maker"
  | "transform-maker"
  | "exporter";

export type EngineCommand =
  | "ENGINE_BOOT"
  | "ENGINE_LIST_MODULES"
  | "ENGINE_OPEN_MODULE"
  | "ENGINE_RUN_MODULE_STEP";

export type EngineModuleDefinition = {
  readonly name: EngineModuleName;
  readonly moduleId: KernelModuleId;
  readonly title: string;
  readonly description: string;
  readonly status: "planned" | "placeholder" | "ready";
};

export type EngineRequest = {
  readonly command: EngineCommand;
  readonly now: ISODateString;
  readonly kernelState?: KernelState;
  readonly moduleName?: EngineModuleName;
  readonly payload?: unknown;
};

export type EngineResponse = {
  readonly kernelState: KernelState;
  readonly effects: readonly KernelEffect[];
  readonly modules: readonly EngineModuleDefinition[];
  readonly activeModuleName: EngineModuleName | null;
  readonly message: string;
};

const ENGINE_MODULES: readonly EngineModuleDefinition[] = [
  {
    name: "planner",
    moduleId: "planner" as KernelModuleId,
    title: "Planner",
    description: "Top-down app planning: purpose, capabilities, entities, workflows, rules, and UI surfaces.",
    status: "placeholder",
  },
  {
    name: "modeler",
    moduleId: "modeler" as KernelModuleId,
    title: "Modeler",
    description: "Middle-layer system modeling: types, state shape, actions, relationships, and constraints.",
    status: "placeholder",
  },
  {
    name: "type-maker",
    moduleId: "type-maker" as KernelModuleId,
    title: "Type Maker",
    description: "Builder module for creating kernel and module types with enforced consistency.",
    status: "placeholder",
  },
  {
    name: "state-maker",
    moduleId: "state-maker" as KernelModuleId,
    title: "State Maker",
    description: "Builder module for creating state shapes and initial-state constructors.",
    status: "placeholder",
  },
  {
    name: "action-maker",
    moduleId: "action-maker" as KernelModuleId,
    title: "Action Maker",
    description: "Builder module for creating action vocabularies and action payload shapes.",
    status: "placeholder",
  },
  {
    name: "transform-maker",
    moduleId: "transform-maker" as KernelModuleId,
    title: "Transform Maker",
    description: "Builder module for creating pure state transition logic from actions.",
    status: "placeholder",
  },
  {
    name: "exporter",
    moduleId: "exporter" as KernelModuleId,
    title: "Exporter",
    description: "Build/export module for turning the internal project into a normal repo/package.",
    status: "placeholder",
  },
];

// MDV_BLOCK:END id="ENGINE.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.HELPERS.002" intent="Helpers: minimal engine helpers for kernel bootstrapping and module lookup" kind="section" tags="engine,helpers"

function findModuleByName(
  moduleName: EngineModuleName,
): EngineModuleDefinition | null {
  return ENGINE_MODULES.find((mod) => mod.name === moduleName) ?? null;
}

function findModuleNameById(
  moduleId: KernelModuleId | null,
): EngineModuleName | null {
  if (moduleId === null) return null;

  const match = ENGINE_MODULES.find(
    (mod) => String(mod.moduleId) === String(moduleId),
  );

  return match?.name ?? null;
}

function dispatchKernelAction(
  state: KernelState,
  action: KernelAction,
): {
  readonly kernelState: KernelState;
  readonly effects: readonly KernelEffect[];
} {
  const result = applyAction(state, action);

  return {
    kernelState: result.state,
    effects: result.effects,
  };
}

function registerAllEngineModules(
  state: KernelState,
  now: ISODateString,
): {
  readonly kernelState: KernelState;
  readonly effects: readonly KernelEffect[];
} {
  let nextState = state;
  const collectedEffects: KernelEffect[] = [];

  for (const mod of ENGINE_MODULES) {
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

// MDV_BLOCK:END id="ENGINE.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.COMPOSITION.002" intent="Composition: public engine workflows for booting, listing, opening, and placeholder-running modules" kind="section" tags="engine,composition"

export async function engineHandleRequest(
  req: EngineRequest,
): Promise<EngineResponse> {
  switch (req.command) {
    case "ENGINE_BOOT": {
      const baseState = req.kernelState ?? makeKernelInitialState(req.now);

      const registered = registerAllEngineModules(baseState, req.now);

      return {
        kernelState: registered.kernelState,
        effects: registered.effects,
        modules: ENGINE_MODULES,
        activeModuleName: findModuleNameById(registered.kernelState.activeModuleId),
        message: "Engine booted and placeholder modules registered.",
      };
    }

    case "ENGINE_LIST_MODULES": {
      const baseState = req.kernelState ?? makeKernelInitialState(req.now);

      return {
        kernelState: baseState,
        effects: [],
        modules: ENGINE_MODULES,
        activeModuleName: findModuleNameById(baseState.activeModuleId),
        message: "Engine module catalog returned.",
      };
    }

    case "ENGINE_OPEN_MODULE": {
      const baseState = req.kernelState ?? makeKernelInitialState(req.now);

      if (!req.moduleName) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(baseState.activeModuleId),
          message: "No moduleName provided.",
        };
      }

      const moduleDef = findModuleByName(req.moduleName);

      if (!moduleDef) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(baseState.activeModuleId),
          message: `Unknown module: ${req.moduleName}`,
        };
      }

      const statusResult = dispatchKernelAction(baseState, {
        type: "KERNEL_SET_STATUS",
        status: "running",
        now: req.now,
      });

      const activeModuleResult = dispatchKernelAction(statusResult.kernelState, {
        type: "KERNEL_SET_ACTIVE_MODULE",
        moduleId: moduleDef.moduleId,
        now: req.now,
      });

      return {
        kernelState: activeModuleResult.kernelState,
        effects: [
          ...statusResult.effects,
          ...activeModuleResult.effects,
        ],
        modules: ENGINE_MODULES,
        activeModuleName: moduleDef.name,
        message: `Opened module: ${moduleDef.title}`,
      };
    }

    case "ENGINE_RUN_MODULE_STEP": {
      const baseState = req.kernelState ?? makeKernelInitialState(req.now);

      if (!req.moduleName) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(baseState.activeModuleId),
          message: "No moduleName provided for module step.",
        };
      }

      const moduleDef = findModuleByName(req.moduleName);

      if (!moduleDef) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(baseState.activeModuleId),
          message: `Unknown module: ${req.moduleName}`,
        };
      }

      const activeModuleResult = dispatchKernelAction(baseState, {
        type: "KERNEL_SET_ACTIVE_MODULE",
        moduleId: moduleDef.moduleId,
        now: req.now,
      });

      const successResult = dispatchKernelAction(activeModuleResult.kernelState, {
        type: "KERNEL_SET_STATUS",
        status: "success",
        now: req.now,
      });

      return {
        kernelState: successResult.kernelState,
        effects: [
          ...activeModuleResult.effects,
          ...successResult.effects,
        ],
        modules: ENGINE_MODULES,
        activeModuleName: moduleDef.name,
        message: `Placeholder step executed for module: ${moduleDef.title}`,
      };
    }

    default: {
      const baseState = req.kernelState ?? makeKernelInitialState(req.now);

      return {
        kernelState: baseState,
        effects: [],
        modules: ENGINE_MODULES,
        activeModuleName: findModuleNameById(baseState.activeModuleId),
        message: "Unknown engine command.",
      };
    }
  }
}

// MDV_BLOCK:END id="ENGINE.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.EXPORTS.002" intent="Exports: explicit public surface for engine slice" kind="section" tags="engine,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="ENGINE.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="ENGINE.FILE.002"