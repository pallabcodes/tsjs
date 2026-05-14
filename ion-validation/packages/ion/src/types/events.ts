import { IonError } from './result';

/**
 * ----------------------------------------------------------------------------
 * ION STREAM EVENTS
 * ----------------------------------------------------------------------------
 * Defines the complete lifecycle of a validation execution.
 */

export type FieldStartEvent = {
  readonly type: 'field_start';
  readonly key: string;
};

export type FieldSuccessEvent = {
  readonly type: 'field_success';
  readonly key: string;
  readonly value: unknown;
};

export type FieldErrorEvent = {
  readonly type: 'field_error';
  readonly key: string;
  readonly error: IonError;
};

export type ValidationCompleteEvent = {
  readonly type: 'complete';
  readonly data: Record<string, unknown>;
};

/**
 * IonEvent: The exhaustive union of all possible stream messages.
 */
export type IonEvent = 
  | FieldStartEvent 
  | FieldSuccessEvent 
  | FieldErrorEvent 
  | ValidationCompleteEvent;

/**
 * IonStream: The core reactive protocol.
 */
export interface IonStream extends AsyncIterable<IonEvent> {}
