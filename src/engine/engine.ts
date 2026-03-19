// MDV_BLOCK:BEGIN id="ENGINE.FILE.001" intent="Engine v0.1: minimal orchestration for chat streaming; composes LLM with kernel boundaries (kernel integration reserved)" kind="file" tags="engine,v0.1,sections"

/**
 * engine/engine.ts
 * ----------------
 * Policy:
 * - Engine is the orchestration layer, not a domain of truth.
 * - It composes kernel + external capability modules (LLM now; later MWM/codec/skills/knowledge).
 * - No UI imports. No app/router imports.
 * - Intended to be server-only.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { KernelState } from "../kernel";

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.PRIMITIVES.001" intent="Primitives: engine request shapes for streaming chat (kernel-aware, LLM-backed)" kind="section" tags="engine,primitives"

export type EngineRequest = {
  readonly mode?: string;
  readonly payload?: unknown;
  readonly kernelState?: KernelState;
};

export type EngineResponse = unknown;

// MDV_BLOCK:END id="ENGINE.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.HELPERS.001" intent="Helpers: intentionally minimal (avoid unless reduces future churn)" kind="section" tags="engine,helpers"
// (none)
// MDV_BLOCK:END id="ENGINE.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.COMPOSITION.001" intent="Composition: engine workflows composing kernel boundaries with LLM streaming" kind="section" tags="engine,composition"

export async function engineHandleRequest(_req: EngineRequest): Promise<EngineResponse> {
  throw new Error("Not implemented: engineHandleRequest");
}

// MDV_BLOCK:END id="ENGINE.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="ENGINE.SECTION.EXPORTS.001" intent="Exports: explicit public surface for engine slice" kind="section" tags="engine,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports/deprecations.

// MDV_BLOCK:END id="ENGINE.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="ENGINE.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/engine/engine.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/engine/engine.ts