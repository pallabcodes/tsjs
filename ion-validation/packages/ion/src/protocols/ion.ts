import { Rule, ValidationContext } from '../types/validator';
import { isSuccess } from '../utils/result';
import { ValidationEvent, IonStream } from '../types/stream';

export type FieldDefinition<T = any> = {
  key: string;
  source?: string; // Deep path support (e.g. "user.profile.name")
  value?: any;
  format?: (val: any) => any;
  compute?: (data: T) => any | Promise<any>;
  rules?: Rule<any, T>[];
  omit?: boolean | ((data: T) => boolean);
  schema?: FieldDefinition<any>[]; // Recursive schema support
};

/**
 * createValidationStream: 
 * Turns form data into an intelligent, contract-driven stream of validation events.
 */
export function createValidationStream<T>(
  data: T, 
  schema: FieldDefinition<T>[], 
  parentKey: string = ''
): IonStream {
  const iterator = async function* (): AsyncGenerator<ValidationEvent, void, unknown> {
    const finalData: Record<string, any> = {};

    for (const field of schema) {
      const fullKey = parentKey ? `${parentKey}.${field.key}` : field.key;

      // Handle conditional omit
      const shouldOmit = typeof field.omit === 'function' ? field.omit(data) : field.omit;
      if (shouldOmit) continue;

      yield { type: 'field_start', key: fullKey };

      let value = await extractValueAsync(data, field);

      // Handle Nested Schema
      if (field.schema && value !== undefined) {
        const subStream = createValidationStream(value, field.schema, fullKey);
        let subData: any = {};
        for await (const subEvent of subStream) {
          if (subEvent.type === 'field_error') {
            yield subEvent; // Propagate sub-errors
          } else if (subEvent.type === 'complete') {
            subData = subEvent.data;
          }
        }
        value = subData;
      }

      let hasError = false;
      if (field.rules) {
        const ctx: ValidationContext<T> = { data, key: fullKey };
        
        for (const rule of field.rules) {
          const result = await rule(value, ctx);
          if (!isSuccess(result)) {
            yield { type: 'field_error', key: fullKey, error: result.error };
            hasError = true;
            break; 
          }
          value = result.value;
        }
      }

      if (!hasError) {
        finalData[field.key] = value;
        yield { type: 'field_success', key: fullKey, value };
      }
    }

    yield { type: 'complete', data: finalData };
  };

  return { [Symbol.asyncIterator]: iterator };
}

// Internal Helpers
async function extractValueAsync<T>(data: T, field: FieldDefinition<T>): Promise<any> {
  if (field.value !== undefined) return field.value;
  if (field.compute) return await field.compute(data);
  if (field.source) {
    const rawValue = getDeepValue(data, field.source);
    return field.format ? field.format(rawValue) : rawValue;
  }
  return undefined;
}

function getDeepValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
