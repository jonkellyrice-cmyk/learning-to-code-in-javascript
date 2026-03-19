// MDV_BLOCK:BEGIN id="API.CHAT.HANDLER.001" intent="Semantic handler for POST /api/chat (v0.2): supports chat streaming + smart rolling window inference" kind="route-handler" tags="nextjs,api,chat,sse,streaming,engine,rolling_window,inference"

/**
 * src/app/api/chat/handler.ts
 * ---------------------------
 * Policy:
 * - Semantic handler only; keep Next.js route shell in route.ts.
 * - No provider or SDK logic here; delegate to engine.
 * - Streams SSE to the client.
 * - Also supports internal inference requests (non-SSE).
 */

import { engineHandleRequest } from "@/engine";

/* ============================================================
   Types
   ============================================================ */

type InboundRequest = {
  readonly mode?: "stream" | "internal";
  readonly payload?: unknown;
};

/* ============================================================
   Primitives
   ============================================================ */

// (none)

/* ============================================================
   Helpers
   ============================================================ */

// (none)

/* ============================================================
   Composition
   ============================================================ */

export async function POST(req: Request) {
  const body: InboundRequest = await req.json().catch(() => ({} as InboundRequest));
  return engineHandleRequest({ req, body });
}

/* ============================================================
   Exports
   ============================================================ */

// (named export above)

// MDV_BLOCK:END id="API.CHAT.HANDLER.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/app/api/chat/chatRoute.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/app/api/chat/chatRoute.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/app/api/chat/handler.ts