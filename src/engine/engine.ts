// MDV_BLOCK:BEGIN id="ENGINE.FILE.004" intent="Engine v0.4: thin general-purpose orchestration layer for planner/modeler/builder-style modules over the general kernel host with real ready-module routing" kind="file" tags="engine,general-purpose,v0.4,sections"

/**
 * engine/engine.ts
 * ----------------
 * Policy:
 * - Engine is the orchestration layer, not a domain of truth.
 * - It composes kernel bridge + module registry + feature modules.
 * - No UI imports. No app/router imports.
 * - Intended to remain framework-agnostic.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { KernelEffect, KernelState } from "../kernel";
import type { ISODateString } from "../kernel/types";

import {
  dispatchKernelAction,
  makeBootstrappedKernelState,
  registerAllKernelModules,
  setActiveKernelModule,
  setKernelStatus,
  type KernelBridgeModuleRegistration,
} from "./kernel_bridge";

import {
  ENGINE_MODULES,
  ENGINE_READY_MODULES,
  findModuleByName,
  findModuleNameById,
  type EngineModuleDefinition,
  type EngineModuleName,
} from "./module_registry";

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.PRIMITIVES.004" intent="Primitives: engine request/response shapes for thin orchestration over kernel bridge and module registry" kind="section" tags="engine,primitives"

export type EngineCommand =
  | "ENGINE_BOOT"
  | "ENGINE_LIST_MODULES"
  | "ENGINE_OPEN_MODULE"
  | "ENGINE_RUN_MODULE_STEP";

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

// MDV_BLOCK:END id="ENGINE.SECTION.PRIMITIVES.004"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.HELPERS.004" intent="Helpers: minimal engine helpers for registry-to-bridge adaptation and ready-module lookup" kind="section" tags="engine,helpers"

function toKernelBridgeRegistrations(
  modules: readonly EngineModuleDefinition[],
): readonly KernelBridgeModuleRegistration[] {
  return modules.map((mod) => ({
    moduleId: mod.moduleId,
  }));
}

function getTypegenSliceFromKernelState(
  kernelState: KernelState,
) {
  return kernelState.modulesById[String(ENGINE_READY_MODULES.typegen.moduleId)] ?? null;
}

// MDV_BLOCK:END id="ENGINE.SECTION.HELPERS.004"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.COMPOSITION.004" intent="Composition: public engine workflows for booting, listing, opening, and running real or placeholder modules through bridge + registry" kind="section" tags="engine,composition"

export async function engineHandleRequest(
  req: EngineRequest,
): Promise<EngineResponse> {
  switch (req.command) {
    case "ENGINE_BOOT": {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      const registered = registerAllKernelModules(
        baseState,
        toKernelBridgeRegistrations(ENGINE_MODULES),
        req.now,
      );

      return {
        kernelState: registered.kernelState,
        effects: registered.effects,
        modules: ENGINE_MODULES,
        activeModuleName: findModuleNameById(
          ENGINE_MODULES,
          registered.kernelState.activeModuleId,
        ),
        message: "Engine booted and registered available modules.",
      };
    }

    case "ENGINE_LIST_MODULES": {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      return {
        kernelState: baseState,
        effects: [],
        modules: ENGINE_MODULES,
        activeModuleName: findModuleNameById(
          ENGINE_MODULES,
          baseState.activeModuleId,
        ),
        message: "Engine module catalog returned.",
      };
    }

    case "ENGINE_OPEN_MODULE": {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      if (!req.moduleName) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(
            ENGINE_MODULES,
            baseState.activeModuleId,
          ),
          message: "No moduleName provided.",
        };
      }

      const moduleDef = findModuleByName(ENGINE_MODULES, req.moduleName);

      if (!moduleDef) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(
            ENGINE_MODULES,
            baseState.activeModuleId,
          ),
          message: `Unknown module: ${req.moduleName}`,
        };
      }

      const statusResult = setKernelStatus(baseState, "running", req.now);
      const activeModuleResult = setActiveKernelModule(
        statusResult.kernelState,
        moduleDef.moduleId,
        req.now,
      );

      return {
        kernelState: activeModuleResult.kernelState,
        effects: [...statusResult.effects, ...activeModuleResult.effects],
        modules: ENGINE_MODULES,
        activeModuleName: moduleDef.name,
        message: `Opened module: ${moduleDef.title}`,
      };
    }

    case "ENGINE_RUN_MODULE_STEP": {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      if (!req.moduleName) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(
            ENGINE_MODULES,
            baseState.activeModuleId,
          ),
          message: "No moduleName provided for module step.",
        };
      }

      const moduleDef = findModuleByName(ENGINE_MODULES, req.moduleName);

      if (!moduleDef) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: findModuleNameById(
            ENGINE_MODULES,
            baseState.activeModuleId,
          ),
          message: `Unknown module: ${req.moduleName}`,
        };
      }

      const activeModuleResult = setActiveKernelModule(
        baseState,
        moduleDef.moduleId,
        req.now,
      );

      if (moduleDef.name === "type-maker") {
        const existingSlice = getTypegenSliceFromKernelState(
          activeModuleResult.kernelState,
        );

        const typegenState =
          existingSlice ?? ENGINE_READY_MODULES.typegen.makeInitialState(req.now);

        const payloadCommand =
          req.payload && typeof req.payload === "object" && "type" in (req.payload as object)
            ? req.payload
            : {
                type: "TYPEGEN_VALIDATE",
                now: req.now,
              };

        const handled = ENGINE_READY_MODULES.typegen.handleCommand(
          typegenState,
          payloadCommand as any,
        );

        const nextKernelState: KernelState = {
          ...activeModuleResult.kernelState,
          modulesById: {
            ...activeModuleResult.kernelState.modulesById,
            [String(ENGINE_READY_MODULES.typegen.moduleId)]: handled.nextState,
          },
          lastUpdatedAt: req.now,
        };

        const successResult = setKernelStatus(
          nextKernelState,
          "success",
          req.now,
        );

        return {
          kernelState: successResult.kernelState,
          effects: [...activeModuleResult.effects, ...successResult.effects],
          modules: ENGINE_MODULES,
          activeModuleName: moduleDef.name,
          message: `Executed real module step for: ${moduleDef.title}`,
        };
      }

      const successResult = setKernelStatus(
        activeModuleResult.kernelState,
        "success",
        req.now,
      );

      return {
        kernelState: successResult.kernelState,
        effects: [...activeModuleResult.effects, ...successResult.effects],
        modules: ENGINE_MODULES,
        activeModuleName: moduleDef.name,
        message: `Placeholder step executed for module: ${moduleDef.title}`,
      };
    }

    default: {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      const errorResult = dispatchKernelAction(baseState, {
        type: "KERNEL_RECORD_ERROR",
        message: "Unknown engine command.",
        now: req.now,
      });

      return {
        kernelState: errorResult.kernelState,
        effects: errorResult.effects,
        modules: ENGINE_MODULES,
        activeModuleName: findModuleNameById(
          ENGINE_MODULES,
          errorResult.kernelState.activeModuleId,
        ),
        message: "Unknown engine command.",
      };
    }
  }
}

// MDV_BLOCK:END id="ENGINE.SECTION.COMPOSITION.004"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.EXPORTS.004" intent="Exports: explicit public surface for engine slice" kind="section" tags="engine,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="ENGINE.SECTION.EXPORTS.004"

// MDV_BLOCK:END id="ENGINE.FILE.004"