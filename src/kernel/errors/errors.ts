// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.FILE.002" intent="Kernel errors slice: general-purpose typed diagnostics and error codes for kernel hosting" kind="file" tags="kernel,errors,general-purpose,v0.2,sections"

/**
 * kernel/errors/errors.ts
 * -----------------------
 * Policy:
 * - Types only (no IO, no side effects).
 * - Errors describe why something failed, not what happened.
 * - Intended for deterministic, machine-checkable error handling.
 * - New code is inserted only at the end of the appropriate section.
 * - Dependency flow is top -> bottom (no block depends on blocks below it).
 */

import type { KernelModuleId } from "../types";

// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.PRIMITIVES.002" intent="Primitives: general-purpose error codes and minimal error shapes for kernel hosting" kind="section" tags="kernel,errors,primitives"

export type KernelErrorCode =
  | "KERNEL_INVALID_STATE"
  | "KERNEL_MODULE_ALREADY_REGISTERED"
  | "KERNEL_MODULE_NOT_FOUND"
  | "KERNEL_NO_ACTIVE_MODULE"
  | "KERNEL_INVARIANT_VIOLATION"
  | "KERNEL_UNKNOWN";

export type KernelError = {
  readonly code: KernelErrorCode;
  readonly message: string;
};

export type KernelModuleError = KernelError & {
  readonly moduleId: KernelModuleId;
};

// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.PRIMITIVES.002"

// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.HELPERS.002" intent="Helpers: constructors/guards (avoid unless zero-runtime and reduces churn)" kind="section" tags="kernel,errors,helpers"

export function makeKernelError(
  code: KernelErrorCode,
  message: string,
): KernelError {
  return {
    code,
    message,
  };
}

export function makeKernelModuleError(
  code: Exclude<
    KernelErrorCode,
    "KERNEL_INVALID_STATE" | "KERNEL_INVARIANT_VIOLATION" | "KERNEL_UNKNOWN"
  >,
  moduleId: KernelModuleId,
  message: string,
): KernelModuleError {
  return {
    code,
    moduleId,
    message,
  };
}

// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.HELPERS.002"

// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.COMPOSITION.002" intent="Composition: higher-level error composition utilities for common kernel host failures" kind="section" tags="kernel,errors,composition"

export function makeKernelModuleAlreadyRegisteredError(
  moduleId: KernelModuleId,
): KernelModuleError {
  return makeKernelModuleError(
    "KERNEL_MODULE_ALREADY_REGISTERED",
    moduleId,
    `Kernel module already registered: ${String(moduleId)}`,
  );
}

export function makeKernelModuleNotFoundError(
  moduleId: KernelModuleId,
): KernelModuleError {
  return makeKernelModuleError(
    "KERNEL_MODULE_NOT_FOUND",
    moduleId,
    `Kernel module not found: ${String(moduleId)}`,
  );
}

export function makeKernelNoActiveModuleError(): KernelError {
  return makeKernelError(
    "KERNEL_NO_ACTIVE_MODULE",
    "Kernel has no active module.",
  );
}

export function makeKernelInvariantViolationError(
  message: string,
): KernelError {
  return makeKernelError("KERNEL_INVARIANT_VIOLATION", message);
}

// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.COMPOSITION.002"

// MDV_BLOCK:BEGIN id="KERNEL.ERRORS.SECTION.EXPORTS.002" intent="Exports: explicit public surface for errors slice" kind="section" tags="kernel,errors,exports"

// NOTE: exports are defined inline above.
// This anchor exists for future controlled re-exports.

// MDV_BLOCK:END id="KERNEL.ERRORS.SECTION.EXPORTS.002"

// MDV_BLOCK:END id="KERNEL.ERRORS.FILE.002"