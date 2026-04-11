// MDV_BLOCK:BEGIN id="ENGINE.FILE.005" intent="Engine v0.5: fully generic plug-and-play orchestration layer with no module-specific branching" kind="file"

/**
 * engine/engine.ts
 * ----------------
 * Engine is a thin orchestration layer.
 * It does NOT contain module-specific logic.
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
  findModuleByName,
  findModuleNameById,
  findRegisteredModuleById,
  type EngineRegisteredModule,
  type EngineModuleName,
} from "./module_registry";

// ====================
// PRIMITIVES
// ====================

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
  readonly modules: readonly EngineRegisteredModule[];
  readonly activeModuleName: EngineModuleName | null;
  readonly message: string;
};

// ====================
// HELPERS
// ====================

function toKernelBridgeRegistrations(
  modules: readonly EngineRegisteredModule[],
): readonly KernelBridgeModuleRegistration[] {
  return modules.map((mod) => ({
    moduleId: mod.moduleId,
  }));
}

function getModuleSlice(
  kernelState: KernelState,
  module: EngineRegisteredModule,
) {
  return kernelState.modulesById[String(module.moduleId)] ?? null;
}

// ====================
// ENGINE
// ====================

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
        message: "Engine booted.",
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
        message: "Modules listed.",
      };
    }

    case "ENGINE_OPEN_MODULE": {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      if (!req.moduleName) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: null,
          message: "No moduleName provided.",
        };
      }

      const module = findModuleByName(ENGINE_MODULES, req.moduleName);

      if (!module) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: null,
          message: `Unknown module: ${req.moduleName}`,
        };
      }

      const status = setKernelStatus(baseState, "running", req.now);
      const active = setActiveKernelModule(
        status.kernelState,
        module.moduleId,
        req.now,
      );

      return {
        kernelState: active.kernelState,
        effects: [...status.effects, ...active.effects],
        modules: ENGINE_MODULES,
        activeModuleName: module.name,
        message: `Opened module: ${module.title}`,
      };
    }

    case "ENGINE_RUN_MODULE_STEP": {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      if (!req.moduleName) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: null,
          message: "No moduleName provided.",
        };
      }

      const module = findModuleByName(ENGINE_MODULES, req.moduleName);

      if (!module) {
        return {
          kernelState: baseState,
          effects: [],
          modules: ENGINE_MODULES,
          activeModuleName: null,
          message: `Unknown module: ${req.moduleName}`,
        };
      }

      const active = setActiveKernelModule(
        baseState,
        module.moduleId,
        req.now,
      );

      // 🔥 GENERIC MODULE EXECUTION
      const existingSlice = getModuleSlice(active.kernelState, module);

      const moduleState =
        existingSlice ?? module.makeInitialState(req.now);

      const command =
        req.payload && typeof req.payload === "object"
          ? req.payload
          : null;

      const result = module.handleCommand(
        moduleState,
        command as any,
      );

      const nextKernelState: KernelState = {
        ...active.kernelState,
        modulesById: {
          ...active.kernelState.modulesById,
          [String(module.moduleId)]: result.nextState,
        },
        lastUpdatedAt: req.now,
      };

      const success = setKernelStatus(nextKernelState, "success", req.now);

      return {
        kernelState: success.kernelState,
        effects: [...active.effects, ...success.effects],
        modules: ENGINE_MODULES,
        activeModuleName: module.name,
        message: `Executed module: ${module.title}`,
      };
    }

    default: {
      const baseState = req.kernelState ?? makeBootstrappedKernelState(req.now);

      const error = dispatchKernelAction(baseState, {
        type: "KERNEL_RECORD_ERROR",
        message: "Unknown engine command.",
        now: req.now,
      });

      return {
        kernelState: error.kernelState,
        effects: error.effects,
        modules: ENGINE_MODULES,
        activeModuleName: findModuleNameById(
          ENGINE_MODULES,
          error.kernelState.activeModuleId,
        ),
        message: "Unknown engine command.",
      };
    }
  }
}