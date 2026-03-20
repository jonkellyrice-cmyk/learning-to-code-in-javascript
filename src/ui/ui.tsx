// MDV_BLOCK:BEGIN id="UI.FILE.004" intent="UI boundary: general-purpose engine-driven UI for planner/modeler/builder module host with fuller Type Maker support" kind="file" tags="ui,general-purpose,v0.4,sections"

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

// MDV_BLOCK:BEGIN id="UI.SECTION.PRIMITIVES.004" intent="Primitives: minimal UI primitives for time, boot, module open, module step execution, and fuller Type Maker interaction" kind="section" tags="ui,primitives"

type AppViewState = {
  readonly kernelState: KernelState | null;
  readonly modules: readonly EngineModuleDefinition[];
  readonly activeModuleName: EngineModuleName | null;
  readonly message: string;
  readonly isBooting: boolean;
};

type TypeMakerField = {
  readonly name?: string;
  readonly valueType?: string;
  readonly cardinality?: string;
  readonly optional?: boolean;
};

type TypeMakerSlice = {
  readonly currentDraft?: {
    readonly name?: string;
    readonly section?: string;
    readonly fields?: readonly TypeMakerField[];
  };
  readonly generatedCode?: string;
  readonly lastValidationErrors?: readonly string[];
};

type TypeMakerFieldFormState = {
  readonly name: string;
  readonly valueType: "string" | "number" | "boolean" | "unknown" | "null";
  readonly cardinality: "single" | "array";
  readonly optional: boolean;
};

function nowIso(): string {
  return new Date().toISOString();
}

const TYPE_FIELD_VALUE_OPTIONS = [
  "string",
  "number",
  "boolean",
  "unknown",
  "null",
] as const;

const TYPE_FIELD_CARDINALITY_OPTIONS = [
  "single",
  "array",
] as const;

// MDV_BLOCK:END id="UI.SECTION.PRIMITIVES.004"

// MDV_BLOCK:BEGIN id="UI.SECTION.HELPERS.004" intent="Helpers: intentionally minimal UI helpers for rendering kernel and Type Maker state" kind="section" tags="ui,helpers"

function statusLabel(state: KernelState | null): string {
  if (!state) return "uninitialized";
  return state.status;
}

function getTypeMakerSlice(state: KernelState | null): TypeMakerSlice | null {
  if (!state) return null;
  return (state.modulesById["type-maker"] as TypeMakerSlice | undefined) ?? null;
}

// MDV_BLOCK:END id="UI.SECTION.HELPERS.004"

// MDV_BLOCK:BEGIN id="UI.SECTION.COMPOSITION.004" intent="Composition: main UI component for planner/modeler/builder engine host with fuller real Type Maker panel" kind="section" tags="ui,composition"

export function AppUI(): JSX.Element {
  const [viewState, setViewState] = useState<AppViewState>({
    kernelState: null,
    modules: [],
    activeModuleName: null,
    message: "Booting engine…",
    isBooting: true,
  });

  const [typeMakerFieldForm, setTypeMakerFieldForm] = useState<TypeMakerFieldFormState>({
    name: "",
    valueType: "string",
    cardinality: "single",
    optional: false,
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
      typeMakerFields: typeMakerSlice?.currentDraft?.fields ?? [],
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

  async function handleTypeNameChange(value: string): Promise<void> {
    await handleRunModuleStep("type-maker", {
      type: "TYPEGEN_SET_DRAFT_NAME",
      now: nowIso(),
      name: value,
    });
  }

  async function handleTypeSectionChange(value: string): Promise<void> {
    await handleRunModuleStep("type-maker", {
      type: "TYPEGEN_SET_DRAFT_SECTION",
      now: nowIso(),
      section: value,
    });
  }

  async function handleAddTypeField(): Promise<void> {
    if (!typeMakerFieldForm.name.trim()) return;

    await handleRunModuleStep("type-maker", {
      type: "TYPEGEN_ADD_FIELD",
      now: nowIso(),
      field: {
        name: typeMakerFieldForm.name,
        valueType: typeMakerFieldForm.valueType,
        cardinality: typeMakerFieldForm.cardinality,
        optional: typeMakerFieldForm.optional,
      },
    });

    setTypeMakerFieldForm({
      name: "",
      valueType: "string",
      cardinality: "single",
      optional: false,
    });
  }

  async function handleRemoveTypeField(fieldName: string): Promise<void> {
    await handleRunModuleStep("type-maker", {
      type: "TYPEGEN_REMOVE_FIELD",
      now: nowIso(),
      fieldName,
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
                <button onClick={() => void handleOpenModule(mod.name)}>
                  Open
                </button>

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
            gap: 16,
          }}
        >
          <div style={{ fontWeight: 600 }}>Type Maker</div>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "1fr 220px",
              alignItems: "end",
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              <span>Type Name</span>
              <input
                value={viewModel.typeMakerDraftName}
                onChange={(event) => void handleTypeNameChange(event.target.value)}
                style={{
                  padding: 8,
                  border: "1px solid #d0d7de",
                  borderRadius: 6,
                }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span>Section</span>
              <select
                value={viewModel.typeMakerSection}
                onChange={(event) => void handleTypeSectionChange(event.target.value)}
                style={{
                  padding: 8,
                  border: "1px solid #d0d7de",
                  borderRadius: 6,
                }}
              >
                <option value="primitives">primitives</option>
                <option value="helpers">helpers</option>
                <option value="composition">composition</option>
              </select>
            </label>
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
            <div style={{ fontWeight: 600 }}>Add Property</div>

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "1.4fr 1fr 1fr auto auto",
                alignItems: "end",
              }}
            >
              <label style={{ display: "grid", gap: 6 }}>
                <span>Name</span>
                <input
                  value={typeMakerFieldForm.name}
                  onChange={(event) =>
                    setTypeMakerFieldForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  style={{
                    padding: 8,
                    border: "1px solid #d0d7de",
                    borderRadius: 6,
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Type</span>
                <select
                  value={typeMakerFieldForm.valueType}
                  onChange={(event) =>
                    setTypeMakerFieldForm((prev) => ({
                      ...prev,
                      valueType: event.target.value as TypeMakerFieldFormState["valueType"],
                    }))
                  }
                  style={{
                    padding: 8,
                    border: "1px solid #d0d7de",
                    borderRadius: 6,
                  }}
                >
                  {TYPE_FIELD_VALUE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span>Cardinality</span>
                <select
                  value={typeMakerFieldForm.cardinality}
                  onChange={(event) =>
                    setTypeMakerFieldForm((prev) => ({
                      ...prev,
                      cardinality: event.target.value as TypeMakerFieldFormState["cardinality"],
                    }))
                  }
                  style={{
                    padding: 8,
                    border: "1px solid #d0d7de",
                    borderRadius: 6,
                  }}
                >
                  {TYPE_FIELD_CARDINALITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  paddingBottom: 10,
                }}
              >
                <input
                  type="checkbox"
                  checked={typeMakerFieldForm.optional}
                  onChange={(event) =>
                    setTypeMakerFieldForm((prev) => ({
                      ...prev,
                      optional: event.target.checked,
                    }))
                  }
                />
                <span>Optional</span>
              </label>

              <button onClick={() => void handleAddTypeField()}>
                Add Property
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 600 }}>
              Properties ({viewModel.typeMakerFields.length})
            </div>

            {viewModel.typeMakerFields.length === 0 ? (
              <div style={{ opacity: 0.75 }}>No properties yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {viewModel.typeMakerFields.map((field) => (
                  <div
                    key={field.name ?? Math.random()}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      border: "1px solid #d0d7de",
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <div style={{ display: "grid", gap: 2 }}>
                      <div style={{ fontWeight: 600 }}>{field.name ?? "(unnamed)"}</div>
                      <div style={{ fontSize: 14, opacity: 0.8 }}>
                        type: {field.valueType ?? "unknown"} • cardinality:{" "}
                        {field.cardinality ?? "single"} • optional:{" "}
                        {field.optional ? "yes" : "no"}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        void handleRemoveTypeField(field.name ?? "")
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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

// MDV_BLOCK:END id="UI.SECTION.COMPOSITION.004"

// MDV_BLOCK:BEGIN id="UI.SECTION.EXPORTS.004" intent="Exports: explicit public surface for UI domain" kind="section" tags="ui,exports"

// NOTE: exports are defined inline above (AppUI).
// Adapter (index.ts) controls public exposure.

// MDV_BLOCK:END id="UI.SECTION.EXPORTS.004"

// MDV_BLOCK:END id="UI.FILE.004"