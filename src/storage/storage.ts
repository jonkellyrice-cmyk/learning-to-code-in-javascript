// MDV_BLOCK:BEGIN id="STORAGE.FILE.001" intent="Storage boundary: v0.1 local persistence for KernelState and execution of KernelEffect" kind="file" tags="storage,v0.1,sections"

/**
 * storage/storage.ts
 * ------------------
 * Policy:
 * - Storage is an execution boundary, not a decision-maker.
 * - KernelState is treated as an immutable snapshot.
 * - Side effects are explicit and centralized here.
 * - New code is inserted only at the end of the appropriate section.
 */

import type { KernelEffect, KernelState } from "@/kernel";

// MDV_BLOCK:BEGIN id="STORAGE.SECTION.PRIMITIVES.001" intent="Primitives: storage constants and raw localStorage access" kind="section" tags="storage,primitives"

const STORAGE_KEY = "mdv.kernel.state.v1";

// MDV_BLOCK:END id="STORAGE.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="STORAGE.SECTION.HELPERS.001" intent="Helpers: minimal helpers for serialization (local-only)" kind="section" tags="storage,helpers"

function serializeState(state: KernelState): string {
  return JSON.stringify(state);
}

function deserializeState(raw: string): KernelState | null {
  try {
    return JSON.parse(raw) as KernelState;
  } catch {
    return null;
  }
}

// MDV_BLOCK:END id="STORAGE.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="STORAGE.SECTION.COMPOSITION.001" intent="Composition: public storage API (load state, apply effects)" kind="section" tags="storage,composition"

export function loadKernelState(): KernelState | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  return deserializeState(raw);
}

export async function applyKernelEffects(
  effects: readonly KernelEffect[]
): Promise<{ readonly outputs: readonly unknown[] }> {
  if (typeof window === "undefined") return { outputs: [] };

  const outputs: unknown[] = [];

  for (const effect of effects) {
    switch (effect.type) {
      case "PERSIST_STATE": {
        const serialized = serializeState(effect.state);
        window.localStorage.setItem(STORAGE_KEY, serialized);
        break;
      }

      case "LOG": {
        const { level, message, data } = effect;
        const fn = (console as any)[level] ?? console.log;
        fn(`[kernel] ${message}`, data);
        break;
      }

      default: {
        // Future effects must be handled explicitly by this boundary.
        const _exhaustive: never = effect;
        void _exhaustive;
      }
    }
  }

  return { outputs };
}

// MDV_BLOCK:END id="STORAGE.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="STORAGE.SECTION.EXPORTS.001" intent="Exports: explicit public surface for storage boundary" kind="section" tags="storage,exports"

// NOTE: exports are defined inline above.
// Adapter (index.ts) controls public exposure.

// MDV_BLOCK:END id="STORAGE.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="STORAGE.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/storage/storage.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/storage/storage.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/storage/storage.ts