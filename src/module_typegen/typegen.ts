// src/module_typegen/typegen.ts

// imports

import type {
  ISODateString,
  KernelModuleId,
  Result,
} from "../kernel/types";

// primitives

export const TYPEGEN_MODULE_ID = "typegen" as KernelModuleId;

export type TypegenSection = "primitives" | "helpers" | "composition";

export type TypegenFieldValueType =
  | "string"
  | "number"
  | "boolean"
  | "unknown"
  | "null";

export type TypegenFieldCardinality = "single" | "array";

export type TypegenFieldDefinition = {
  readonly name: string;
  readonly valueType: TypegenFieldValueType;
  readonly cardinality: TypegenFieldCardinality;
  readonly optional: boolean;
};

export type TypegenTypeDefinition = {
  readonly name: string;
  readonly section: TypegenSection;
  readonly fields: readonly TypegenFieldDefinition[];
};

export type TypegenDraftState = {
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
  readonly currentDraft: TypegenTypeDefinition;
  readonly generatedCode: string;
  readonly lastValidationErrors: readonly string[];
};

export type TypegenCommand =
  | {
      readonly type: "TYPEGEN_SET_DRAFT_NAME";
      readonly now: ISODateString;
      readonly name: string;
    }
  | {
      readonly type: "TYPEGEN_SET_DRAFT_SECTION";
      readonly now: ISODateString;
      readonly section: TypegenSection;
    }
  | {
      readonly type: "TYPEGEN_ADD_FIELD";
      readonly now: ISODateString;
      readonly field: TypegenFieldDefinition;
    }
  | {
      readonly type: "TYPEGEN_REMOVE_FIELD";
      readonly now: ISODateString;
      readonly fieldName: string;
    }
  | {
      readonly type: "TYPEGEN_REPLACE_DRAFT";
      readonly now: ISODateString;
      readonly draft: TypegenTypeDefinition;
    }
  | {
      readonly type: "TYPEGEN_VALIDATE";
      readonly now: ISODateString;
    }
  | {
      readonly type: "TYPEGEN_RENDER";
      readonly now: ISODateString;
    };

export type TypegenHandleResult = {
  readonly nextState: TypegenDraftState;
};

// helpers

function isPascalCase(value: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(value);
}

function isCamelCase(value: string): boolean {
  return /^[a-z][A-Za-z0-9]*$/.test(value);
}

function fieldTypeToCode(
  valueType: TypegenFieldValueType,
  cardinality: TypegenFieldCardinality,
): string {
  const base =
    valueType === "null"
      ? "null"
      : valueType === "unknown"
        ? "unknown"
        : valueType;

  return cardinality === "array" ? `readonly ${base}[]` : base;
}

function validateTypeName(name: string): string | null {
  if (name.trim().length === 0) return "Type name is required.";
  if (!isPascalCase(name)) return "Type name must be PascalCase.";
  return null;
}

function validateFieldName(name: string): string | null {
  if (name.trim().length === 0) return "Field name is required.";
  if (!isCamelCase(name)) return "Field name must be camelCase.";
  return null;
}

function validateDuplicateFieldNames(
  fields: readonly TypegenFieldDefinition[],
): string[] {
  const seen = new Set<string>();
  const errors: string[] = [];

  for (const field of fields) {
    if (seen.has(field.name)) {
      errors.push(`Duplicate field name: ${field.name}`);
      continue;
    }
    seen.add(field.name);
  }

  return errors;
}

// composition

export function makeEmptyTypeDefinition(): TypegenTypeDefinition {
  return {
    name: "NewType",
    section: "composition",
    fields: [],
  };
}

export function renderTypeDefinition(draft: TypegenTypeDefinition): string {
  const fields =
    draft.fields.length === 0
      ? "  // add fields here"
      : draft.fields
          .map((field) => {
            const optionalMark = field.optional ? "?" : "";
            const typeCode = fieldTypeToCode(field.valueType, field.cardinality);
            return `  readonly ${field.name}${optionalMark}: ${typeCode};`;
          })
          .join("\n");

  return `export type ${draft.name} = {\n${fields}\n};`;
}

export function makeInitialTypegenState(now: ISODateString): TypegenDraftState {
  const draft = makeEmptyTypeDefinition();

  return {
    createdAt: now,
    updatedAt: now,
    currentDraft: draft,
    generatedCode: renderTypeDefinition(draft),
    lastValidationErrors: [],
  };
}

export function validateTypeDefinition(
  draft: TypegenTypeDefinition,
): Result<void, readonly string[]> {
  const errors: string[] = [];

  const typeNameError = validateTypeName(draft.name);
  if (typeNameError) errors.push(typeNameError);

  for (const field of draft.fields) {
    const fieldNameError = validateFieldName(field.name);
    if (fieldNameError) {
      errors.push(`${field.name || "<empty>"}: ${fieldNameError}`);
    }
  }

  errors.push(...validateDuplicateFieldNames(draft.fields));

  if (errors.length > 0) {
    return { ok: false, error: errors };
  }

  return { ok: true, value: undefined };
}

export function setDraftName(
  state: TypegenDraftState,
  name: string,
  now: ISODateString,
): TypegenDraftState {
  const nextDraft: TypegenTypeDefinition = {
    ...state.currentDraft,
    name,
  };

  return {
    ...state,
    updatedAt: now,
    currentDraft: nextDraft,
    generatedCode: renderTypeDefinition(nextDraft),
  };
}

export function setDraftSection(
  state: TypegenDraftState,
  section: TypegenSection,
  now: ISODateString,
): TypegenDraftState {
  const nextDraft: TypegenTypeDefinition = {
    ...state.currentDraft,
    section,
  };

  return {
    ...state,
    updatedAt: now,
    currentDraft: nextDraft,
    generatedCode: renderTypeDefinition(nextDraft),
  };
}

export function addDraftField(
  state: TypegenDraftState,
  field: TypegenFieldDefinition,
  now: ISODateString,
): TypegenDraftState {
  const nextDraft: TypegenTypeDefinition = {
    ...state.currentDraft,
    fields: [...state.currentDraft.fields, field],
  };

  return {
    ...state,
    updatedAt: now,
    currentDraft: nextDraft,
    generatedCode: renderTypeDefinition(nextDraft),
  };
}

export function removeDraftField(
  state: TypegenDraftState,
  fieldName: string,
  now: ISODateString,
): TypegenDraftState {
  const nextDraft: TypegenTypeDefinition = {
    ...state.currentDraft,
    fields: state.currentDraft.fields.filter((field) => field.name !== fieldName),
  };

  return {
    ...state,
    updatedAt: now,
    currentDraft: nextDraft,
    generatedCode: renderTypeDefinition(nextDraft),
  };
}

export function replaceDraft(
  state: TypegenDraftState,
  draft: TypegenTypeDefinition,
  now: ISODateString,
): TypegenDraftState {
  return {
    ...state,
    updatedAt: now,
    currentDraft: draft,
    generatedCode: renderTypeDefinition(draft),
  };
}

export function runTypegenValidation(
  state: TypegenDraftState,
): TypegenDraftState {
  const validation = validateTypeDefinition(state.currentDraft);

  if (!validation.ok) {
    return {
      ...state,
      lastValidationErrors: validation.error,
    };
  }

  return {
    ...state,
    lastValidationErrors: [],
  };
}

export function handleTypegenCommand(
  state: TypegenDraftState,
  command: TypegenCommand,
): TypegenHandleResult {
  switch (command.type) {
    case "TYPEGEN_SET_DRAFT_NAME":
      return {
        nextState: setDraftName(state, command.name, command.now),
      };

    case "TYPEGEN_SET_DRAFT_SECTION":
      return {
        nextState: setDraftSection(state, command.section, command.now),
      };

    case "TYPEGEN_ADD_FIELD":
      return {
        nextState: addDraftField(state, command.field, command.now),
      };

    case "TYPEGEN_REMOVE_FIELD":
      return {
        nextState: removeDraftField(state, command.fieldName, command.now),
      };

    case "TYPEGEN_REPLACE_DRAFT":
      return {
        nextState: replaceDraft(state, command.draft, command.now),
      };

    case "TYPEGEN_VALIDATE":
      return {
        nextState: runTypegenValidation(state),
      };

    case "TYPEGEN_RENDER":
      return {
        nextState: {
          ...state,
          updatedAt: command.now,
          generatedCode: renderTypeDefinition(state.currentDraft),
        },
      };

    default:
      return {
        nextState: state,
      };
  }
}

export function selectTypegenDraft(state: TypegenDraftState): TypegenTypeDefinition {
  return state.currentDraft;
}

export function selectTypegenGeneratedCode(state: TypegenDraftState): string {
  return state.generatedCode;
}

export function selectTypegenValidationErrors(
  state: TypegenDraftState,
): readonly string[] {
  return state.lastValidationErrors;
}

// exports