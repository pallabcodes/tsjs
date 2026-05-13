import { FieldDefinition, createValidationStream } from '../protocols/ion';
import { ValidationEvent } from '../types/stream';

/**
 * createValidation: The high-level orchestrator for Ion Validation.
 * This is the "Consumer DX" layer that hides the underlying protocol complexity.
 */
export function createValidation<T>(data: T) {
  let _schema: FieldDefinition<T>[] = [];

  return {
    /**
     * schema: Defines the contract using the FieldDefinition protocol.
     */
    schema(definition: FieldDefinition<T>[]) {
      _schema = definition;
      return this;
    },

    /**
     * stream: Returns the raw AsyncIterable for real-time processing.
     */
    stream() {
      return createValidationStream(data, _schema);
    },

    /**
     * execute: A "One-Shot" consumer that waits for the stream to complete.
     */
    async execute() {
      const errors: Record<string, string> = {};
      let finalData: Record<string, any> = {};
      let isValid = true;

      const ionStream = createValidationStream(data, _schema);

      for await (const event of ionStream) {
        if (event.type === 'field_error') {
          errors[event.key] = event.error;
          isValid = false;
        } else if (event.type === 'complete') {
          finalData = event.data;
        }
      }

      return {
        isValid,
        data: finalData as T,
        errors,
        hasError: !isValid
      };
    }
  };
}
