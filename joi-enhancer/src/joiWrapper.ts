import Joi, { Schema, ValidationError, ValidationResult, ObjectSchema, WhenOptions, AnySchema, AlternativesSchema } from 'joi';
import toJsonSchema from 'joi-to-json-schema';



export class SchemaWrapper<T> {
  private readonly schema: ObjectSchema<any>;

  constructor(schema: ObjectSchema<any>) {
    this.schema = schema;
  }

  validate(input: unknown): T {
    const result: ValidationResult = this.schema.validate(input, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (result.error) {
      throw result.error;
    }

    return result.value as T;
  }

  get raw(): ObjectSchema<any> {
    return this.schema;
  }

  extend<U>(extension: ObjectSchema<any>): SchemaWrapper<T & U> {
    return new SchemaWrapper<T & U>(this.schema.concat(extension) as ObjectSchema<any>);
  }

  pick<K extends keyof T>(keys: K[]): SchemaWrapper<Pick<T, K>> {
    if (!this.schema.type || this.schema.type !== 'object') {
      throw new Error('pick() is only supported on object schemas');
    }

    const pickedSchemas: Record<string, Schema> = {};

    for (const key of keys) {
      try {
        pickedSchemas[key as string] = this.schema.extract(key as string);
      } catch {
        throw new Error(`Key "${String(key)}" does not exist in schema.`);
      }
    }

    return new SchemaWrapper<Pick<T, K>>(Joi.object(pickedSchemas) as ObjectSchema<any>);
  }

  omit<K extends keyof T>(keys: K[]): SchemaWrapper<Omit<T, K>> {
    if (!this.schema.type || this.schema.type !== 'object') {
      throw new Error('omit() is only supported on object schemas');
    }
    const allKeys = Object.keys(this.schema.describe().keys || {});
    const keepKeys = allKeys.filter(k => !keys.includes(k as K));
    const pickedSchemas: Record<string, Schema> = {};
    for (const key of keepKeys) {
      pickedSchemas[key] = this.schema.extract(key);
    }
    return new SchemaWrapper<Omit<T, K>>(Joi.object(pickedSchemas) as ObjectSchema<any>);
  }

  /**
   * Adds object-level conditional logic using Joi's .when().
   * For alternatives-level conditionals, use the underlying Joi schema directly.
   */
  conditional(
    ref: string,
    options: WhenOptions | WhenOptions[]
  ): SchemaWrapper<T> {
    // This only works for object-level .when()
    const newSchema = this.schema.when(ref, options);
    return new SchemaWrapper<T>(newSchema as ObjectSchema<any>);
  }

  /**
   * Zod-like safe validation: returns { value, error } instead of throwing.
   */
  safeValidate(input: unknown): { value: T | undefined; error: ValidationError | undefined } {
    const result = this.schema.validate(input, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });
    return {
      value: result.error ? undefined : (result.value as T),
      error: result.error,
    };
  }

  merge<U>(other: SchemaWrapper<U>): SchemaWrapper<T & U> {
    return new SchemaWrapper<T & U>(this.schema.concat(other.raw) as ObjectSchema<any>);
  }

  partial(): SchemaWrapper<Partial<T>> {
    return new SchemaWrapper<Partial<T>>(this.schema.fork(Object.keys(this.schema.describe().keys || {}), s => s.optional()) as ObjectSchema<any>);
  }

  required(): SchemaWrapper<Required<T>> {
    return new SchemaWrapper<Required<T>>(this.schema.fork(Object.keys(this.schema.describe().keys || {}), s => s.required()) as ObjectSchema<any>);
  }
  extendWithDefaults(defaults: Partial<T>): SchemaWrapper<T> {
    const keys = Object.keys(defaults) as (keyof T)[];
    let schema = this.schema;
    for (const key of keys) {
      schema = schema.fork([key as string], s => s.default((defaults as any)[key]));
    }
    return new SchemaWrapper<T>(schema as ObjectSchema<any>);
  }

  extendWith<U>(fields: Record<string, Schema>): SchemaWrapper<T & U> {
    const newSchema = this.schema.keys(fields);
    return new SchemaWrapper<T & U>(newSchema as ObjectSchema<any>);
  }

  pickBy(predicate: (schema: Schema, key: string) => boolean): SchemaWrapper<Partial<T>> {
    const described = this.schema.describe();
    const keys = Object.keys(described.keys || {});
    const pickedSchemas: Record<string, Schema> = {};
    for (const key of keys) {
      const fieldSchema = this.schema.extract(key);
      if (predicate(fieldSchema, key)) {
        pickedSchemas[key] = fieldSchema;
      }
    }
    return new SchemaWrapper<Partial<T>>(Joi.object(pickedSchemas) as ObjectSchema<any>);
  }
  
  pickByType(type: string): SchemaWrapper<Partial<T>> {
    const described = this.schema.describe();
    const keys = Object.keys(described.keys || {});
    const pickedSchemas: Record<string, Schema> = {};
    for (const key of keys) {
      const fieldSchema = this.schema.extract(key);
      if ((fieldSchema as any).type === type) {
        pickedSchemas[key] = fieldSchema;
      }
    }
    return new SchemaWrapper<Partial<T>>(Joi.object(pickedSchemas) as ObjectSchema<any>);
  }

  deepPartial(): SchemaWrapper<DeepPartial<T>> {
    const partialSchema = deepPartialSchema(this.schema) as ObjectSchema<any>;
    return new SchemaWrapper<DeepPartial<T>>(partialSchema);
  }

  omitBy(predicate: (schema: Schema, key: string) => boolean): SchemaWrapper<Partial<T>> {
    const described = this.schema.describe();
    const keys = Object.keys(described.keys || {});
    const keepKeys = keys.filter(key => !predicate(this.schema.extract(key), key));
    const pickedSchemas: Record<string, Schema> = {};
    for (const key of keepKeys) {
      pickedSchemas[key] = this.schema.extract(key);
    }
    return new SchemaWrapper<Partial<T>>(Joi.object(pickedSchemas) as ObjectSchema<any>);
  }

  toJSONSchema(): object {
    return toJsonSchema(this.schema);
  }

  withExample(example: any): SchemaWrapper<T> {
    return new SchemaWrapper<T>(this.schema.example(example) as ObjectSchema<any>);
  }

  describeWithExamples(): any {
    return this.schema.describe();
  }

  getDependencyGraph(): Record<string, { requires?: string[]; forbids?: string[]; conditionals?: any[] }> {
    const desc = this.schema.describe();
    const graph: Record<string, any> = {};
    if (desc.dependencies) {
      for (const dep of desc.dependencies) {
        if (!graph[dep.key]) graph[dep.key] = {};
        if (dep.type === 'with') graph[dep.key].requires = dep.peers;
        if (dep.type === 'without') graph[dep.key].forbids = dep.peers;
        // Add more as needed (e.g., 'or', 'and', etc)
      }
    }
    if (desc.keys) {
      for (const [key, val] of Object.entries(desc.keys)) {
        if ((val as any).whens) {
          graph[key] = graph[key] || {};
          graph[key].conditionals = (val as any).whens;
        }
      }
    }
    return graph;
  }

  generateExample(): T {
    const desc = this.schema.describe();
    const result: any = {};
    if (desc.keys) {
      for (const [key, val] of Object.entries(desc.keys)) {
        if ((val as any).flags?.default !== undefined) {
          result[key] = (val as any).flags.default;
        } else if ((val as any).examples && (val as any).examples.length > 0) {
          result[key] = (val as any).examples[0];
        } else if ((val as any).type === 'string') {
          result[key] = 'example';
        } else if ((val as any).type === 'number') {
          result[key] = 42;
        } else if ((val as any).type === 'boolean') {
          result[key] = true;
        } else if ((val as any).type === 'object') {
          // Recursively generate for nested objects
          result[key] = this.schema.extract(key).describe().keys
            ? (new SchemaWrapper<any>(this.schema.extract(key) as ObjectSchema<any>)).generateExample()
            : {};
        } else if ((val as any).type === 'array') {
          result[key] = [];
        }
      }
    }
    return result as T;
  }

  withMeta(key: string, value: any): SchemaWrapper<T> {
    return new SchemaWrapper<T>(this.schema.meta({ [key]: value }) as ObjectSchema<any>);
  }

  getMeta(key: string): any {
    const desc = this.schema.describe();
    return desc.metas?.find((m: any) => m[key] !== undefined)?.[key];
  }

  withVersion(version: string): SchemaWrapper<T> {
    return this.withMeta('version', version);
  }

  getVersion(): string | undefined {
    return this.getMeta('version');
  }

  getFieldPresence(): Record<string, 'required' | 'optional' | 'forbidden'> {
    const desc = this.schema.describe();
    const out: Record<string, 'required' | 'optional' | 'forbidden'> = {};
    if (desc.keys) {
      for (const [key, val] of Object.entries(desc.keys)) {
        out[key] = (val as any).flags?.presence || 'optional';
      }
    }
    return out;
  }

  withCustomValidator<K extends keyof T>(
    key: K,
    validator: (value: T[K], helpers: Joi.CustomHelpers) => T[K],
    message?: string
  ): SchemaWrapper<T> {
    const described = this.schema.describe();
    if (!described.keys || !(key as string in described.keys)) {
      throw new Error(`Key "${String(key)}" does not exist in schema.`);
    }
    // Extract the field schema, attach the custom validator, and re-attach to the object
    let fieldSchema = this.schema.extract(key as string);
    fieldSchema = (fieldSchema as Schema).custom(validator, message);
    const newSchema = this.schema.keys({ [key]: fieldSchema });
    return new SchemaWrapper<T>(newSchema as ObjectSchema<any>);
  }

  withTranslationKey<K extends keyof T>(field: K, translationKey: string): SchemaWrapper<T> {
    const described = this.schema.describe();
    if (!described.keys || !(field as string in described.keys)) {
      throw new Error(`Key "${String(field)}" does not exist in schema.`);
    }
    let fieldSchema = this.schema.extract(field as string);
    fieldSchema = (fieldSchema as Schema).meta({ translationKey });
    const newSchema = this.schema.keys({ [field]: fieldSchema });
    return new SchemaWrapper<T>(newSchema as ObjectSchema<any>);
  }

  /**
   * Compare this schema to another and return a summary of added, removed, and changed fields.
   * Only compares top-level fields for performance and clarity.
   */
  diff<U>(other: SchemaWrapper<U>): {
    added: string[];
    removed: string[];
    changed: string[];
  } {
    const thisDesc = this.schema.describe();
    const otherDesc = other.raw.describe();

    const thisKeys = thisDesc.keys ? Object.keys(thisDesc.keys) : [];
    const otherKeys = otherDesc.keys ? Object.keys(otherDesc.keys) : [];

    const added = otherKeys.filter(k => !thisKeys.includes(k));
    const removed = thisKeys.filter(k => !otherKeys.includes(k));
    const changed: string[] = [];

    for (const key of thisKeys) {
      if (otherKeys.includes(key)) {
        const a = thisDesc.keys[key];
        const b = otherDesc.keys[key];
        if (
          (a as any).type !== (b as any).type ||
          ((a as any).flags?.presence || 'optional') !== ((b as any).flags?.presence || 'optional')
        ) {
          changed.push(key);
        }
      }
    }

    return { added, removed, changed }; // <-- Ensure this is always present
  }

  /**
   * Returns a function that, when given an object, redacts the specified fields (sets them to '[REDACTED]').
   * Usage: const redact = schema.withRedactedFields(['password']); redact(obj)
   */
  withRedactedFields(fields: (keyof T | string)[], redactedValue: any = '[REDACTED]') {
    return (obj: Partial<T>): Partial<T> => {
      if (!obj || typeof obj !== 'object') return obj;
      const result = { ...obj } as Record<string, any>;
      for (const field of fields) {
        if (field in result) {
          result[field as string] = redactedValue;
        }
      }
      return result as Partial<T>;
    };
  }

  /**
   * Type-safe async validation pipeline.
   * Runs Joi validation, then applies user-provided async validators in sequence.
   * Each asyncValidator receives the validated value and must throw or return a value.
   * Usage:
   *   await schema.validateAsync(input, [
   *     async (value) => { if (await existsInDb(value.email)) throw new Error('Email taken'); }
   *   ]);
   */
  async validateAsync(
    input: unknown,
    asyncValidators: Array<(value: T) => Promise<void>> = []
  ): Promise<T> {
    // First, run synchronous Joi validation
    const value = this.validate(input);

    // Then, run async validators in sequence
    for (const validator of asyncValidators) {
      await validator(value);
    }

    return value;
  }
}

/**
 * Helper to create a Joi alternatives schema, fully typed.
 */
export function alternatives<T = any>() {
  return Joi.alternatives() as AlternativesSchema<T>;
}

/**
 * Helper to create a conditional alternatives field, fully typed.
 */
export function conditionalField<T = any>(
  ref: string,
  options: WhenOptions[]
): AlternativesSchema<T> {
  return Joi.alternatives().conditional(ref, options);
}

/**
 * Helper to always strip a field from the validated object.
 * Usage: stripField() returns Joi.any().strip()
 */
export function stripField(): AnySchema {
  return Joi.any().strip();
}

export function createSchema<T>(schema: ObjectSchema<any>): SchemaWrapper<T> {
  return new SchemaWrapper<T>(schema);
}

/**
 * Type-safe requireIf helper.
 * Usage: requireIf('otherField', true)
 */
export function requireIf<T extends Schema>(
  schema: T,
  key: string,
  value: any
): T {
  return schema.when(key, {
    is: value,
    then: schema.required(),
    otherwise: schema.optional(),
  }) as T;
}

export function isObjectSchema(schema: AnySchema): schema is Joi.ObjectSchema {
  return (schema as any).type === 'object';
}

export function isStringSchema(schema: AnySchema): schema is Joi.StringSchema {
  return (schema as any).type === 'string';
}



export function formatError(error: ValidationError) {
  return {
    message: error.message,
    details: error.details.map(d => ({
      path: d.path.join('.'),
      message: d.message,
      type: d.type,
    })),
  };
}

export function formatErrorWithCodes(error: Joi.ValidationError, codeMap: Record<string, string>) {
  return {
    message: error.message,
    details: error.details.map(d => ({
      path: d.path.join('.'),
      message: d.message,
      type: d.type,
      code: codeMap[d.type] || 'VALIDATION_ERROR',
    })),
  };
}

/**
 * Formats Joi errors using a translation map and translation keys attached via .withTranslationKey().
 * translationMap: { [translationKey: string]: string }
 */
export function formatErrorWithTranslations(
  error: ValidationError,
  schema: ObjectSchema<any>,
  translationMap: Record<string, string>
) {
  // Get translation keys from schema description
  const desc = schema.describe();
  const keyToTranslationKey: Record<string, string> = {};

  if (desc.keys) {
    for (const [key, value] of Object.entries(desc.keys)) {
      const translationKey = (value as any).meta?.find((m: any) => m.translationKey)?.translationKey;
      if (translationKey) {
        keyToTranslationKey[key] = translationKey;
      }
    }
  }

  // Format error details with translation keys
  return {
    message: error.message,
    details: error.details.map(d => {
      const key = d.path[0];
      const translationKey = key !== undefined ? keyToTranslationKey[key] : undefined;
      return {
        path: d.path.join('.'),
        message: translationKey ? translationMap[translationKey] : d.message,
        type: d.type,
        translationKey, // Include the translation key in the error detail
      };
    }),
  };
}

export function describeSchema(schema: ObjectSchema<any>) {
  return schema.describe();
}

export function describeWithType<T>(schema: Joi.ObjectSchema): { meta: ReturnType<typeof schema.describe>, type: T } {
  return { meta: schema.describe(), type: undefined as any as T };
}

export function atLeastOneOf<T extends Record<string, any>>(fields: (keyof T)[]) {
  return (schema: Joi.ObjectSchema) => schema.or(...fields.map(String));
}

export function mutuallyExclusive<T extends Record<string, any>>(fields: (keyof T)[]) {
  return (schema: Joi.ObjectSchema) => schema.xor(...(fields as string[]));
}

export function dynamicDefault<T extends Joi.Schema>(
  schema: T,
  key: string,
  compute: (value: any) => any
): T {
  return schema.when(key, {
    then: Joi.any().default(compute),
    otherwise: Joi.any(),
  }) as T;
}

// --- Move these OUTSIDE the class ---
export type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

function deepPartialSchema(schema: Schema): Schema {
  type StackItem = { parent: any; key: string | null; schema: Schema };
  const root = { parent: null, key: null, schema };
  const stack: StackItem[] = [root];
  const nodeMap = new WeakMap<Schema, Schema>();

  while (stack.length) {
    const { parent, key, schema: current } = stack.pop()!;
    let result: Schema;

    if ((current as any).type === 'object') {
      const described = (current as ObjectSchema<any>).describe();
      const keys = described.keys || {};
      const partialKeys: Record<string, Schema> = {};
      for (const k of Object.keys(keys)) {
        stack.push({ parent: partialKeys, key: k, schema: (current as ObjectSchema<any>).extract(k) });
      }
      result = Joi.object(partialKeys).optional();
    } else if ((current as any).type === 'array') {
      result = (current as any).items
        ? Joi.array().items(deepPartialSchema((current as any).items))
        : Joi.array();
    } else {
      result = current;
    }

    nodeMap.set(current, result);

    if (parent) {
      const keyStr = key === null ? '*' : key;
      if (!(keyStr in parent)) {
        parent[keyStr] = {};
      }
      parent[keyStr] = result;
    }
  }

  return nodeMap.get(schema)!;
}