import { Result, AsyncResult } from './monad';

/**
 * Ion: The High-Performance System Contract
 * This module defines the exhaustive state-space for validation fields.
 */

/**
 * DiagnosticMetadata: Internal tracking for high-signal debugging and telemetry.
 */
export type DiagnosticMetadata = {
  readonly timestamp: number;
  readonly executionId: string;
  readonly depth: number;
};

/**
 * ValidationContext: The diagnostic and data context provided to every rule.
 */
export type ValidationContext<T = unknown> = {
  readonly data: T;
  readonly key: string;
  readonly path: string[];
  readonly metadata: DiagnosticMetadata;
};

/**
 * Validator: The core transformation contract.
 */
export type Validator<In, Out, Ctx = unknown> = 
  (val: In, ctx: ValidationContext<Ctx>) => Result<Out> | AsyncResult<Out>;

/**
 * Rule: A specialized validator that maintains type-integrity.
 */
export type Rule<T, Ctx = unknown> = Validator<T, T, Ctx>;

/**
 * ----------------------------------------------------------------------------
 * FIELD ARCHITECTURE (Discriminated Unions)
 * ----------------------------------------------------------------------------
 */

export interface BaseField<T> {
  readonly key: string;
  readonly required?: boolean | string;
  readonly omit?: boolean | ((data: T) => boolean);
  readonly rules?: ReadonlyArray<Rule<any, T>>;
  readonly description?: string; // Metadata for self-documenting APIs
}

/**
 * SourceField: Industry-standard dot-notation mapping.
 * Note: 'type' is optional here to support legacy implicit source-mappings.
 */
export interface SourceField<T> extends BaseField<T> {
  readonly type?: 'source';
  readonly source: string;
  readonly format?: (val: unknown) => unknown;
}

/**
 * ComputedField: Functional derivation from system state.
 */
export interface ComputedField<T> extends BaseField<T> {
  readonly type: 'computed';
  readonly compute: (data: T) => unknown | Promise<unknown>;
}

/**
 * StaticField: Raw value injection.
 */
export interface StaticField<T> extends BaseField<T> {
  readonly type: 'static';
  readonly value: unknown;
}

/**
 * SchemaField: Deeply recursive contract nesting.
 */
export interface SchemaField<T> extends BaseField<T> {
  readonly type: 'schema';
  readonly source?: string;
  readonly schema: ReadonlyArray<IonField<any>>;
}

/**
 * IonField: The exhaustive union of all permissible system primitives.
 */
export type IonField<T> = 
  | SourceField<T> 
  | ComputedField<T> 
  | StaticField<T> 
  | SchemaField<T>;
