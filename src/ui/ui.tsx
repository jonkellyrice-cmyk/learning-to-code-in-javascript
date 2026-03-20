// MDV_BLOCK:BEGIN id="UI.FILE.003" intent="UI boundary: general-purpose engine-driven UI for planner/modeler/builder module host with initial real Type Maker support" kind="file" tags="ui,general-purpose,v0.3,sections"

/**
 * ui/ui.tsx
 * ---------
 * Policy:
 * - UI is a boundary layer (runtime React). It may do runtime work.
 * - UI must not contain domain logic; it dispatches requests to the engine.
 * - New code is inserted only at the end of the appropriate section.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  engineHandleRequest,
  type EngineModuleDefinition,
  type EngineModuleName,
} from "@/engine";
import type { KernelState } from "@/kernel";

// MDV_BLOCK:BEGIN id="UI.SECTION.PRIMITIVES.003" intent="Primitives: minimal UI primitives for time, boot, module open, placeholder module-step execution, and simple Type Maker interaction" kind="section" tags="ui,primitives"

type AppViewState = {
  readonly kernelState: KernelState | null;
  readonly modules: readonly EngineModuleDefinition[];
  readonly activeModuleName: EngineModuleName | null;
  readonly message: string;
  readonly isBooting: boolean;
};

type TypeMakerSlice = {
  readonly currentDraft?: {
    readonly name?: string;
    readonly section?: string;
    readonly fields?: readonly unknown[];
  };
  readonly generatedCode?: string;
  readonly lastValidationErrors?: readonly string[];
};

function nowIso(): string {
  return new Date().toISOString();
}

// MDV_BLOCK:END id="UI.SECTION.PRIMITIVES.003"

// MDV_BLOCK:BEGIN id="UI.SECTION.HELPERS.003" intent="Helpers: intentionally minimal UI helpers for rendering kernel and Type Maker state" kind="section" tags="ui,helpers"

function statusLabel(state: KernelState | null): string {
  if (!state) return "uninitialized";
  return state.status;
}

function getTypeMakerSlice(state: KernelState | null): TypeMakerSlice | null {
  if (!state) return null;
  return (state.modulesById["type-maker"] as TypeMakerSlice | undefined) ?? null;
}

// MDV_BLOCK:END id="UI.SECTION.HELPERS.003"

// MDV_BLOCK:BEGIN id="UI.SECTION.COMPOSITION.003" intent="Composition: main UI component for planner/modeler/builder engine host with initial real Type Maker panel" kind="section" tags="ui,composition"

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
    const typeMakerSlice = getTypeMakerSlice(viewState.kernelState);

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
      typeMakerDraftName: typeMakerSlice?.currentDraft?.name ?? "",
      typeMakerSection: typeMakerSlice?.currentDraft?.section ?? "composition",
      typeMakerGeneratedCode: typeMakerSlice?.generatedCode ?? "",
      typeMakerValidationErrors: typeMakerSlice?.lastValidationErrors ?? [],
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

  if (viewState.isBooting || !viewModel.ready) {
    return <div style={{ padding: 16 }}>Booting engine…</div>;
  }

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
                <button onClick={() => void handleOpenModule(mod.name)}>Open</button>

                <button onClick={() => void handleRunModuleStep(mod.name)}>
                  Run Placeholder Step
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {viewModel.activeModuleName === "type-maker" ? (
        <div
          style={{
            border: "1px solid #d0d7de",
            borderRadius: 8,
            padding: 12,
            display: "grid",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 600 }}>Type Maker</div>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Type Name</span>
            <input
              value={viewModel.typeMakerDraftName}
              onChange={(event) =>
                void handleRunModuleStep("type-maker", {
                  type: "TYPEGEN_SET_DRAFT_NAME",
                  now: nowIso(),
                  name: event.target.value,
                })
              }
              style={{
                padding: 8,
                border: "1px solid #d0d7de",
                borderRadius: 6,
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() =>
                void handleRunModuleStep("type-maker", {
                  type: "TYPEGEN_VALIDATE",
                  now: nowIso(),
                })
              }
            >
              Validate
            </button>

            <button
              onClick={() =>
                void handleRunModuleStep("type-maker", {
                  type: "TYPEGEN_RENDER",
                  now: nowIso(),
                })
              }
            >
              Render Code
            </button>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 600 }}>Generated Code</div>
            <pre
              style={{
                margin: 0,
                padding: 12,
                borderRadius: 8,
                background: "#f6f8fa",
                overflowX: "auto",
              }}
            >
              {viewModel.typeMakerGeneratedCode || "// no code generated yet"}
            </pre>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontWeight: 600 }}>Validation Errors</div>
            {viewModel.typeMakerValidationErrors.length === 0 ? (
              <div style={{ opacity: 0.75 }}>No validation errors.</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {viewModel.typeMakerValidationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// MDV_BLOCK:END id="UI.SECTION.COMPOSITION.003"

// MDV_BLOCK:BEGIN id="UI.SECTION.EXPORTS.003" intent="Exports: explicit public surface for UI domain" kind="section" tags="ui,exports"

// NOTE: exports are defined inline above (AppUI).
// Adapter (index.ts) controls public exposure.

// MDV_BLOCK:END id="UI.SECTION.EXPORTS.003"

// MDV_BLOCK:END id="UI.FILE.003"