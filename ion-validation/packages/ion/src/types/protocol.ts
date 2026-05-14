import { IonError } from './monad';

/**
 * ValidationEvent: The discriminated union of all possible stream lifecycle events.
 */
export type ValidationEvent = 
  | { readonly type: 'field_start'; readonly key: string }
  | { readonly type: 'field_success'; readonly key: string; readonly value: unknown }
  | { readonly type: 'field_error'; readonly key: string; readonly error: IonError }
  | { readonly type: 'complete'; readonly data: Record<string, unknown> };

/**
 * IonStream: The reactive, async iterator that yields validation events.
 */
export interface IonStream {
  [Symbol.asyncIterator](): AsyncGenerator<ValidationEvent, void, unknown>;
}

/**
 * IonValidationReport: The final, aggregated snapshot of a validation execution.
 */
export interface IonValidationReport<T = any> {
  readonly isValid: boolean;
  readonly hasError: boolean;
  readonly data: T;
  readonly errors: Record<string, IonError>;
}
