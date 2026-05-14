import { IonField, isSuccess } from '../index';
import { ValidationEvent, IonStream } from '../types/protocol';

/**
 * createValidationStream: 
 * The authoritative reactive protocol for Ion data validation.
 * Orchestrates field extraction, constraints, and recursive schemas in a non-blocking stream.
 */
export function createValidationStream<T>(
  data: T, 
  schema: ReadonlyArray<IonField<T>>, 
  parentKey: string = '',
  depth: number = 0
): IonStream {
  const MAX_DEPTH = 50; 

  const iterator = async function* (): AsyncGenerator<ValidationEvent, void, unknown> {
    if (depth > MAX_DEPTH) {
      throw new Error(`[Ion] Max validation depth (${MAX_DEPTH}) exceeded. Possible circular reference.`);
    }
    const finalData: Record<string, unknown> = {};

    for (const field of schema) {
      const fullKey = parentKey ? `${parentKey}.${field.key}` : field.key;

      if (shouldOmit(data, field)) continue;

      yield { type: 'field_start', key: fullKey };

      // 1. Extraction (Optimized Switch)
      let value = await extractValueAsync(data, field);

      // 2. Constraints (Required)
      if (field.required && (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))) {
        const message = typeof field.required === 'string' ? field.required : 'Field is required';
        yield { type: 'field_error', key: fullKey, error: { code: 'required', message } };
        continue; 
      }

      // 3. Schema Recursion
      if (field.type === 'schema' && isObject(value)) {
        const subStream = createValidationStream(value, field.schema, fullKey, depth + 1);
        let subData: Record<string, unknown> = {};
        for await (const subEvent of subStream) {
          if (subEvent.type === 'field_error') yield subEvent;
          else if (subEvent.type === 'complete') subData = subEvent.data;
        }
        value = subData;
      }

      // 4. Rule Execution Pipeline
      let hasError = false;
      if (field.rules) {
        for (const rule of field.rules) {
          const result = await rule(value, { data, key: fullKey });
          if (!isSuccess(result)) {
            yield { type: 'field_error', key: fullKey, error: result.error };
            hasError = true;
            break; 
          }
          value = result.value;
        }
      }

      if (hasError) continue;

      // 5. Success
      finalData[field.key] = value;
      yield { type: 'field_success', key: fullKey, value };
    }

    yield { type: 'complete', data: finalData };
  };

  return { [Symbol.asyncIterator]: iterator };
}

// --- Internal Helpers ---

function shouldOmit<T>(data: T, field: IonField<T>): boolean {
  return typeof field.omit === 'function' ? field.omit(data) : !!field.omit;
}

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

async function extractValueAsync<T>(data: T, field: IonField<T>): Promise<unknown> {
  try {
    const type = field.type || 'source'; // Default to source
    switch (type) {
      case 'static': return (field as StaticField<T>).value;
      case 'computed': return await (field as ComputedField<T>).compute(data);
      case 'source': return getDeepValue(data, (field as SourceField<T>).source, (field as SourceField<T>).format);
      case 'schema': return (field as SchemaField<T>).source ? getDeepValue(data, (field as SchemaField<T>).source) : data;
      default: return undefined;
    }
  } catch {
    return undefined;
  }
}

function getDeepValue(obj: unknown, path: string, format?: (v: any) => any): unknown {
  if (path === '.' || path === '') return format ? format(obj) : obj;
  if (obj === null || typeof obj !== 'object') return undefined;
  
  const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
  const parts = path.split('.');
  let current: any = obj;

  for (const part of parts) {
    if (FORBIDDEN_KEYS.has(part)) return undefined;
    if (current === null || typeof current !== 'object') return undefined;
    current = current[part];
  }

  return format ? format(current) : current;
}
