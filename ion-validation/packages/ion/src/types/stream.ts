import { Result } from './result';

export type ValidationEvent<T = any> = 
  | { type: 'field_start'; key: string }
  | { type: 'field_success'; key: string; value: T }
  | { type: 'field_error'; key: string; error: string }
  | { type: 'complete'; data: Record<string, any> };

/**
 * IonStream: The core interface for streaming validation events.
 */
export interface IonStream extends AsyncIterable<ValidationEvent> {
  [Symbol.asyncIterator](): AsyncGenerator<ValidationEvent, void, unknown>;
}
