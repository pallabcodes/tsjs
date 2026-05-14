import { createValidationStream } from '../protocols/ion';
import { IonField } from '../types/fields';
import { IonValidationReport } from '../types/protocol';
import { InferSchema } from '../types/inference';

/**
 * createValidation: The high-level orchestrator for Ion validation.
 * It provides a declarative API for executing validation contracts and deriving static types.
 */
export function createValidation<T>(data: T) {
  return {
    /**
     * schema: Defines the validation contract using a stable Discriminated Union.
     */
    schema<S extends ReadonlyArray<IonField<T>>>(definition: S) {
      return {
        /**
         * stream: Returns a reactive AsyncIterator for field-by-field feedback.
         */
        stream() {
          return createValidationStream(data, definition);
        },

        /**
         * execute: Runs the full validation pipeline and yields an aggregated report.
         */
        async execute(): Promise<IonValidationReport<InferSchema<S>>> {
          const stream = createValidationStream(data, definition);
          const errors: Record<string, any> = {};
          let finalData: Record<string, any> = {};

          for await (const event of stream) {
            if (event.type === 'field_error') {
              errors[event.key] = event.error;
            } else if (event.type === 'complete') {
              finalData = event.data;
            }
          }

          const hasError = Object.keys(errors).length > 0;

          return {
            isValid: !hasError,
            hasError,
            data: finalData as InferSchema<S>,
            errors
          };
        }
      };
    }
  };
}
