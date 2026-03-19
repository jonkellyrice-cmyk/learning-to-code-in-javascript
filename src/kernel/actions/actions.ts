// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.FILE.001" intent="Kernel actions slice: v0.1 action vocabulary for threads/messages with ordered section anchors" kind="file" tags="kernel,actions,v0.1,sections"

/**
 * kernel/actions/actions.ts
 * ------------------------
 * Policy:
 * - Only allowed kernel import is from kernel/types (via its adapter).
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { ISODateString, EntityId, ItemId, ActorRole } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.PRIMITIVES.001" intent="Primitives: minimal KernelAction union for v0.1 generic entity/item operations" kind="section" tags="kernel,actions,primitives"

export type KernelAction =
  | {
      readonly type: "ENTITY_CREATE";
      readonly entityId: EntityId;
      readonly now: ISODateString;
    }
  | {
      readonly type: "ENTITY_DELETE";
      readonly entityId: EntityId;
      readonly now: ISODateString;
    }
  | {
      readonly type: "ENTITY_SET_ACTIVE";
      readonly entityId: EntityId | null;
      readonly now: ISODateString;
    }
  | {
      readonly type: "ITEM_APPEND";
      readonly itemId: ItemId;
      readonly entityId: EntityId;
      readonly role: ActorRole;
      readonly content: string;
      readonly now: ISODateString;
    }
  | {
      readonly type: "ITEM_UPDATE";
      readonly itemId: ItemId;
      readonly content: string;
      readonly now: ISODateString;
    };

// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.PRIMITIVES.001"

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.HELPERS.001" intent="Helpers: intentionally empty (avoid unless zero-runtime and reduces future churn)" kind="section" tags="kernel,actions,helpers"
// (none)
// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.HELPERS.001"

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.COMPOSITION.001" intent="Composition: higher-level action composition helpers (none yet)" kind="section" tags="kernel,actions,composition"
// (none)
// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.COMPOSITION.001"

// MDV_BLOCK:BEGIN id="KERNEL.ACTIONS.SECTION.EXPORTS.001" intent="Exports: explicit public surface for actions slice" kind="section" tags="kernel,actions,exports"

// NOTE: exports are defined inline above (KernelAction).

// MDV_BLOCK:END id="KERNEL.ACTIONS.SECTION.EXPORTS.001"

// MDV_BLOCK:END id="KERNEL.ACTIONS.FILE.001" file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/jon-orchestrator/src/kernel/actions/actions.ts file:///private/var/mobile/Containers/Shared/AppGroup/263FEE62-64EA-4A9C-8E3E-BB7133B03E55/File%20Provider%20Storage/Repositories/Kernel_based_template/src/kernel/actions/actions.ts