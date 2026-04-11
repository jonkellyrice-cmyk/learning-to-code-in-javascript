import type { EngineModuleName } from "@/engine";
import type { KernelState } from "@/kernel";

import { TypeMakerPanel } from "@/ui/panels/type_maker_panel";

export type ModulePanelRunStep = (
  moduleName: EngineModuleName,
  payload?: unknown,
) => Promise<void>;

export type ModulePanelProps = {
  readonly kernelState: KernelState;
  readonly moduleName: EngineModuleName;
  readonly runModuleStep: ModulePanelRunStep;
};

export type ModulePanelComponent = (
  props: ModulePanelProps,
) => JSX.Element;

export type ModulePanelRegistry = Partial<
  Record<EngineModuleName, ModulePanelComponent>
>;

export const MODULE_PANELS: ModulePanelRegistry = {
  "type-maker": TypeMakerPanel,
};

export function getModulePanel(
  moduleName: EngineModuleName | null,
): ModulePanelComponent | null {
  if (!moduleName) return null;
  return MODULE_PANELS[moduleName] ?? null;
}