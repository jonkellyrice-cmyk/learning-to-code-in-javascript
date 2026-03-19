# KERNEL MODULE ATTACHMENT WORKFLOW
MDV v0.1 — Event-Driven In-Kernel Modules

—

## PURPOSE

Define the exact procedure for attaching a KernelModule to the kernel using the standardized surface:

- types.ts → KernelModule contract
- events.ts → Canonical KernelEvent union
- transforms.ts → Action → Event emission
- kernel.ts → Module registry + event reduction

This workflow must be followed exactly.
No implicit steps.
No extra rewiring.
No improvisation.

—

# PRECONDITIONS

The following must already be true:

1. KernelState includes:
   - modulesById: Record<string, unknown>
   - moduleOrder: readonly string[]

2. KernelModule<Event, Slice> exists with:
   - id: string
   - initSlice(now)
   - reduce(slice, event)

3. applyKernelActionTransform returns:
   {
     nextState,
     events: readonly KernelEvent[]
   }

4. kernel.ts reduces emitted events across KERNEL_MODULES registry.

If any of these are false, stop.

—

# STEP 1 — DEFINE MODULE ID

Choose a deterministic ID.

Rules:
- Stable forever.
- No renaming later.
- Uppercase namespace style recommended.

Examples:
- “ROLLING_WINDOW.V0”
- “MWM.TIER0.V0”

This string is the module’s identity inside:
- state.modulesById
- state.moduleOrder

Done when:
You can write the module ID once and never change it again.

—

# STEP 2 — DEFINE SLICE STATE

Define the entire module state as one serializable object type.

Rules:
- Plain object only.
- No globals.
- No hidden state.
- No side effects.
- Entire module state lives inside this slice.

Example pattern:

type MySlice = {
  readonly someValue: number;
  readonly history: readonly string[];
};

Done when:
You can say: “This slice is the module.”

—

# STEP 3 — IMPLEMENT THE MODULE

Create:

kernel/modules/<moduleName>.ts

Export:

export const MyModule: KernelModule<KernelEvent, MySlice> = {
  id: “MY_MODULE.V0”,

  initSlice(now) {
    return {
      ...
    };
  },

  reduce(slice, event) {
    switch (event.type) {
      case “...”:
        return {
          ...slice,
        };

      default:
        return slice;
    }
  }
};

Rules:

- initSlice must be pure.
- reduce must be pure.
- Never mutate slice.
- Ignore unrelated events.
- No IO.
- No reading other module slices.
- No kernel state reads.

Done when:
Replaying the same events produces identical slice state.

—

# STEP 4 — ENSURE REQUIRED EVENTS EXIST

Modules respond to events, NOT actions.

If your module depends on something happening:

1. Identify which action implies it.
2. Modify transforms.ts to emit a canonical KernelEvent.

Rules:

- Event must be part of KernelEvent union in events.ts.
- Payload must include ALL data the module needs.
- Module must not derive missing data from kernel state.

Done when:
The relevant action emits the correct event with complete payload.

—

# STEP 5 — REGISTER THE MODULE

Open kernel.ts.

Add module to registry:

const KERNEL_MODULES: readonly KernelModule<KernelEvent, unknown>[] = [
  MyModule,
];

Rules:

- Registry order must be deterministic.
- Only this file should be edited for registration.
- No other kernel rewiring.

Done when:
Module appears exactly once in KERNEL_MODULES.

—

# STEP 6 — VERIFY FIRST TOUCH

Test:

1. Create initial state.
2. Dispatch an action that emits relevant event.
3. Confirm:

   state.modulesById[moduleId] now exists.
   state.moduleOrder includes moduleId.

4. Dispatch another event.
5. Confirm slice updates deterministically.

Done when:
Module slice initializes lazily and updates correctly.

—

# ARCHITECTURAL GUARANTEES

A valid KernelModule is:

- Pure
- Deterministic
- Event-driven
- Registry-attached
- Self-contained
- Inspectable via state.modulesById

It is NOT:

- Action-driven directly
- Cross-slice reading
- Side-effect performing
- Kernel-rewriting
- Runtime-injected chaos

—

# REQUIRED INPUT BEFORE ATTACHMENT

Before attaching a module, specify:

1. Module ID
2. Slice state shape
3. Events it responds to
4. Which actions emit those events (if new)

No guessing.

—

END OF DOCUMENT