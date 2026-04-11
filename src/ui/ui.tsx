// MDV_BLOCK:BEGIN id="UI.FILE.006" intent="UI boundary: general-purpose engine-driven UI shell for planner/modeler/builder module host with panel registration seam" kind="file" tags="ui,general-purpose,v0.6,sections"

/**
 * ui/ui.tsx
 * ---------
 * Policy:
 * - UI is a boundary layer (runtime React). It may do runtime work.
 * - UI must not contain domain logic; it dispatches requests to the engine.
 * - Module-specific panels are resolved through the panel registration seam.
 * - New code is inserted only at the end of the appropriate section.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  engineHandleRequest,
  type EngineModuleName,
  type EngineRegisteredModule,
} from "@/engine";
import type { KernelState } from "@/kernel";
import { getModulePanel } from "@/ui/module_panels";

// MDV_BLOCK:BEGIN id="UI.SECTION.PRIMITIVES.006" intent="Primitives: minimal UI shell primitives for time, boot, module open, and generic module step execution" kind="section" tags="ui,primitives"

type AppViewState = {
  readonly kernelState: KernelState | null;
  readonly modules: readonly EngineRegisteredModule[];
  readonly activeModuleName: EngineModuleName | null;
  readonly message: string;
  readonly isBooting: boolean;
};

function nowIso(): string {
  return new Date().toISOString();
}

// MDV_BLOCK:END id="UI.SECTION.PRIMITIVES.006"

// MDV_BLOCK:BEGIN id="UI.SECTION.HELPERS.006" intent="Helpers: intentionally minimal UI shell helpers for rendering engine/kernel status" kind="section" tags="ui,helpers"

function statusLabel(state: KernelState | null): string {
  if (!state) return "uninitialized";
  return state.status;
}

// MDV_BLOCK:END id="UI.SECTION.HELPERS.006"

// MDV_BLOCK:BEGIN id="UI.SECTION.COMPOSITION.006" intent="Composition: main UI shell component for planner/modeler/builder engine host using registered module panels" kind="section" tags="ui,composition"

export function AppUI(): JSX.Element {
  const [viewState, setViewState] = useState<AppViewState>({
    kernelState: null,
    modules: [],
    activeModuleName: null,
    message: "Booting engine…",
    isBooting: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function boot(): Promise<void> {
      const response = await engineHandleRequest({
        command: "ENGINE_BOOT",
        now: nowIso() as any,
      });

      if (cancelled) return;

      setViewState({
        kernelState: response.kernelState,
        modules: response.modules,
        activeModuleName: response.activeModuleName,
        message: response.message,
        isBooting: false,
      });
    }

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  const viewModel = useMemo(() => {
    return {
      ready: viewState.kernelState !== null,
      status: statusLabel(viewState.kernelState),
      moduleCount: viewState.modules.length,
      activeModuleName: viewState.activeModuleName,
      message: viewState.message,
      lastUpdatedAt: viewState.kernelState?.lastUpdatedAt ?? null,
      lastError: viewState.kernelState?.lastError ?? null,
      activeModuleId: viewState.kernelState?.activeModuleId ?? null,
      registeredModuleCount: viewState.kernelState?.moduleOrder.length ?? 0,
    };
  }, [viewState]);

  async function handleOpenModule(moduleName: EngineModuleName): Promise<void> {
    if (!viewState.kernelState) return;

    const response = await engineHandleRequest({
      command: "ENGINE_OPEN_MODULE",
      now: nowIso() as any,
      kernelState: viewState.kernelState,
      moduleName,
    });

    setViewState({
      kernelState: response.kernelState,
      modules: response.modules,
      activeModuleName: response.activeModuleName,
      message: response.message,
      isBooting: false,
    });
  }

  async function handleRunModuleStep(
    moduleName: EngineModuleName,
    payload?: unknown,
  ): Promise<void> {
    if (!viewState.kernelState) return;

    const response = await engineHandleRequest({
      command: "ENGINE_RUN_MODULE_STEP",
      now: nowIso() as any,
      kernelState: viewState.kernelState,
      moduleName,
      payload,
    });

    setViewState({
      kernelState: response.kernelState,
      modules: response.modules,
      activeModuleName: response.activeModuleName,
      message: response.message,
      isBooting: false,
    });
  }

  if (viewState.isBooting || !viewModel.ready || !viewState.kernelState) {
    return <div style={{ padding: 16 }}>Booting engine…</div>;
  }

  const ActiveModulePanel = getModulePanel(viewModel.activeModuleName);

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui, sans-serif",
        display: "grid",
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>
          Learning-to-Code App Host
        </div>

        <div style={{ opacity: 0.75 }}>
          Planner → Modeler → Builder over a general-purpose kernel + engine host.
        </div>
      </div>

      <div
        style={{
          border: "1px solid #d0d7de",
          borderRadius: 8,
          padding: 12,
          display: "grid",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 600 }}>Kernel / Engine Status</div>

        <div>Status: {viewModel.status}</div>
        <div>Registered Modules: {viewModel.registeredModuleCount}</div>
        <div>Active Module: {viewModel.activeModuleName ?? "none"}</div>
        <div>
          Active Module Id:{" "}
          {viewModel.activeModuleId ? String(viewModel.activeModuleId) : "none"}
        </div>
        <div>Last Updated: {viewModel.lastUpdatedAt ?? "none"}</div>
        <div>Last Error: {viewModel.lastError ?? "none"}</div>

        <div style={{ marginTop: 8 }}>
          <strong>Message:</strong> {viewModel.message}
        </div>
      </div>

      <div
        style={{
          border: "1px solid #d0d7de",
          borderRadius: 8,
          padding: 12,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 600 }}>Modules ({viewModel.moduleCount})</div>

        {viewState.modules.map((mod) => {
          const isActive = viewModel.activeModuleName === mod.name;

          return (
            <div
              key={mod.name}
              style={{
                border: "1px solid #d0d7de",
                borderRadius: 8,
                padding: 12,
                display: "grid",
                gap: 8,
                background: isActive ? "#f6f8fa" : "#ffffff",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{mod.title}</div>
                  <div style={{ opacity: 0.75, fontSize: 14 }}>
                    {mod.description}
                  </div>
                </div>

                <div style={{ whiteSpace: "nowrap", fontSize: 14 }}>
                  status: {mod.status}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => void handleOpenModule(mod.name)}>
                  Open
                </button>

                <button onClick={() => void handleRunModuleStep(mod.name)}>
                  Run Module Step
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {ActiveModulePanel ? (
        <ActiveModulePanel
          kernelState={viewState.kernelState}
          moduleName={viewModel.activeModuleName!}
          runModuleStep={handleRunModuleStep}
        />
      ) : null}
    </div>
  );
}

// MDV_BLOCK:END id="UI.SECTION.COMPOSITION.006"

// MDV_BLOCK:BEGIN id="UI.SECTION.EXPORTS.006" intent="Exports: explicit public surface for UI domain" kind="section" tags="ui,exports"

// NOTE: exports are defined inline above (AppUI).
// Adapter (index.ts) controls public exposure.

// MDV_BLOCK:END id="UI.SECTION.EXPORTS.006"

// MDV_BLOCK:END id="UI.FILE.006"