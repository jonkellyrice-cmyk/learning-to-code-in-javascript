// MDV_BLOCK:BEGIN id="UI.FILE.001" intent="UI boundary: minimal kernel-driven chat UI (threads/messages/composer) with ordered section anchors" kind="file" tags="ui,v0.1,sections"

/**
 * ui/ui.tsx
 * ---------
 * Policy:
 * - UI is a boundary layer (runtime React). It may do runtime work.
 * - UI must not contain domain logic; it dispatches actions to the kernel.
 * - Persistence is executed via storage by applying kernel effects.
 * - New code is inserted only at the end of the appropriate section.
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";

import type { KernelAction, KernelState } from "@/kernel";
import { applyAction, makeKernelInitialState } from "@/kernel";
import { applyKernelEffects, loadKernelState } from "@/storage";

// MDV_BLOCK:BEGIN id="UI.SECTION.PRIMITIVES.001" intent="Primitives: minimal UI primitives (time/id helpers, kernel dispatch)" kind="section" tags="ui,primitives"

type DispatchResult = { readonly next: KernelState };

function dispatchAndPersist(prev: KernelState, action: KernelAction): DispatchResult {
  const res = applyAction(prev, action);
  void applyKernelEffects(res.effects);
  return { next: res.state };
}

// MDV_BLOCK:END id="UI.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="UI.SECTION.HELPERS.001" intent="Helpers: intentionally minimal UI helpers (render/layout helpers only)" kind="section" tags="ui,helpers"
// (none)
// MDV_BLOCK:END id="UI.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="UI.SECTION.COMPOSITION.001" intent="Composition: main UI component (kernel-driven)" kind="section" tags="ui,composition"

export function AppUI(): JSX.Element {
  const [state, setState] = useState<KernelState | null>(null);

  // Boot: load persisted state or create a new one.
  useEffect(() => {
    const persisted = loadKernelState();
    if (persisted) {
      setState(persisted);
      return;
    }
    const init = makeKernelInitialState(new Date().toISOString() as any);
    void applyKernelEffects([{ type: "PERSIST_STATE", state: init } as any]);
    setState(init);
  }, []);

  const viewModel = useMemo(() => {
    // Keep UI generic: no domain selectors here in the template.
    return { ready: Boolean(state) };
  }, [state]);

  function dispatch(action: KernelAction): void {
    setState((prev) => {
      if (!prev) return prev;
      return dispatchAndPersist(prev, action).next;
    });
  }

  if (!viewModel.ready) {
    return <div style={{ padding: 16 }}>Loading…</div>;
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Template UI</div>

      <div style={{ opacity: 0.7, marginBottom: 12 }}>
        This is a minimal kernel-driven UI boundary. Replace with your app’s UI.
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() =>
            dispatch({
              type: "NOOP" as any,
            })
          }
        >
          Dispatch Example
        </button>
      </div>
    </div>
  );
}

// MDV_BLOCK:END id="UI.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="UI.SECTION.EXPORTS.001" intent="Exports: explicit public surface for UI domain" kind="section" tags="ui,exports"

// NOTE: exports are defined inline above (AppUI).
// Adapter (index.ts) controls public exposure.

// MDV_BLOCK:END id="UI.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="UI.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/ui/ui.tsx file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/ui/ui.tsx