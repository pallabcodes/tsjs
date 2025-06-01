import Joi, { AlternativesSchema, AnySchema, ObjectSchema, Schema, ValidationError, WhenOptions } from 'joi';
import toJsonSchema from 'joi-to-json-schema';

/**
 * Type inference helper for SchemaWrapper
 * @example
 * type UserType = Infer<typeof UserSchema>;
 */
export type Infer<T> = T extends SchemaWrapper<infer U> ? U : never;

export class SchemaWrapper<T> {

  private readonly schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  // Base validation method that accepts unknown input
  private validateInternal(input: unknown): T {
    const result = this.schema.validate(input, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (result.error) {
      throw result.error;
    }

    return result.value as T;
  }

  /**
   * Validates input against this schema. Throws if validation fails.
   * @param input The data to validate
   * @returns The validated data, typed as T
   * @throws {ValidationError} If validation fails
   */
  validate(input: T): T {
    return this.validateInternal(input);
  }

  get raw(): Schema {
    return this.schema;
  }

  merge<U>(other: SchemaWrapper<U>): SchemaWrapper<T & U> {
    if (!isObjectSchema(this.schema) || !isObjectSchema(other.raw)) {
      throw new Error('merge() is only supported on object schemas');
    }
    return new SchemaWrapper<T & U>(
      (this.schema as ObjectSchema).concat(other.raw as ObjectSchema)
    );
  }

  extend<U>(extension: Schema): SchemaWrapper<T & U> {
    if (!isObjectSchema(this.schema) || !isObjectSchema(extension)) {
      throw new Error('extend() is only supported on object schemas');
    }
    const base = this.schema as ObjectSchema;
    const ext = extension as ObjectSchema;
    return new SchemaWrapper<T & U>(base.concat(ext));
  }

  /**
   * Returns a new schema with only the specified keys.
   * @param keys The keys to pick
   */
  pick<K extends keyof T>(keys: K[]): SchemaWrapper<Pick<T, K>> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('pick() is only supported on object schemas');
    }

    const pickedSchemas: Record<string, Schema> = {};
    const objectSchema = this.schema as Joi.ObjectSchema;

    for (const key of keys) {
      try {
        pickedSchemas[key as string] = objectSchema.extract(key as string);
      } catch {
        throw new Error(`Key "${String(key)}" does not exist in schema.`);
      }
    }

    return new SchemaWrapper<Pick<T, K>>(Joi.object(pickedSchemas));
  }

  extendWith<U>(fields: Record<string, Schema>): SchemaWrapper<T & U> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('extendWith() is only supported on object schemas');
    }
    return new SchemaWrapper<T & U>(
      (this.schema as ObjectSchema).keys(fields)
    );
  }

  omit<K extends keyof T>(keys: K[]): SchemaWrapper<Omit<T, K>> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('omit() is only supported on object schemas');
    }

    const objectSchema = this.schema as Joi.ObjectSchema;
    const allKeys = Object.keys(objectSchema.describe().keys || {});
    const keepKeys = allKeys.filter(k => !keys.includes(k as unknown as K));
    const pickedSchemas: Record<string, Schema> = {};

    for (const key of keepKeys) {
      pickedSchemas[key] = objectSchema.extract(key);
    }

    return new SchemaWrapper<Omit<T, K>>(Joi.object(pickedSchemas));
  }

  /**
   * Adds object-level conditional logic using Joi's .when().
   * For alternatives-level conditionals, use the underlying Joi schema directly.
   */
  conditional(
    ref: string,
    options: WhenOptions | WhenOptions[]
  ): SchemaWrapper<T> {
    // Add runtime check
    if (!isObjectSchema(this.schema)) {
      throw new Error('conditional() is only supported on object schemas');
    }

    const newSchema = this.schema.when(ref, options);
    return new SchemaWrapper<T>(newSchema);
  }

  /**
   * Safe validation that returns both value and error
   */
  safeValidate(input: Partial<T>): {
    value: T | undefined;
    error: Joi.ValidationError | undefined;
  } {
    try {
      const value = this.validateInternal(input);
      return { value: value as T, error: undefined };
    } catch (err) {
      return {
        value: undefined,
        error: err as Joi.ValidationError
      };
    }
  }

  /**
   * Returns a new schema with only the specified keys.
   * @param keys The keys to pick
   */
  pickBy(predicate: (schema: Schema, key: string) => boolean): SchemaWrapper<Partial<T>> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('pickBy() is only supported on object schemas');
    }
    const objectSchema = this.schema as Joi.ObjectSchema;
    const described = objectSchema.describe();
    const keys = Object.keys(described.keys || {});
    const pickedSchemas: Record<string, Schema> = {};
    for (const key of keys) {
      const fieldSchema = objectSchema.extract(key);
      if (predicate(fieldSchema, key)) {
        pickedSchemas[key] = fieldSchema;
      }
    }
    return new SchemaWrapper<Partial<T>>(Joi.object(pickedSchemas));
  }

  pickByType(type: string): SchemaWrapper<Partial<T>> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('pickByType() is only supported on object schemas');
    }
    const objectSchema = this.schema as Joi.ObjectSchema;
    const described = objectSchema.describe();
    const keys = Object.keys(described.keys || {});
    const pickedSchemas: Record<string, Schema> = {};
    for (const key of keys) {
      const fieldSchema = objectSchema.extract(key);
      if ((fieldSchema as any).type === type) {
        pickedSchemas[key] = fieldSchema;
      }
    }
    return new SchemaWrapper<Partial<T>>(Joi.object(pickedSchemas));
  }

  deepPartial(): SchemaWrapper<DeepPartial<T>> {
    const partialSchema = deepPartialSchema(this.schema) as ObjectSchema<any>;
    return new SchemaWrapper<DeepPartial<T>>(partialSchema);
  }

  omitBy(predicate: (schema: Schema, key: string) => boolean): SchemaWrapper<Partial<T>> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('omitBy() is only supported on object schemas');
    }
    const objectSchema = this.schema as Joi.ObjectSchema;
    const described = objectSchema.describe();
    const keys = Object.keys(described.keys || {});
    const keepKeys = keys.filter(key => !predicate(objectSchema.extract(key), key));
    const pickedSchemas: Record<string, Schema> = {};
    for (const key of keepKeys) {
      pickedSchemas[key] = objectSchema.extract(key);
    }
    return new SchemaWrapper<Partial<T>>(Joi.object(pickedSchemas));
  }

  toJSONSchema(): object {
    return toJsonSchema(this.schema);
  }

  withExample(example: any): SchemaWrapper<T> {
    return new SchemaWrapper<T>(this.schema.example(example));
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
    return new SchemaWrapper<T>(this.schema.meta({ [key]: value }));
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
    validator: (value: T[K], helpers: Joi.CustomHelpers) => T[K] | Promise<T[K]>,
    message?: string
  ): SchemaWrapper<T> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('withCustomValidator() is only supported on object schemas');
    }
    const objectSchema = this.schema as ObjectSchema;
    const field = objectSchema.extract(key as string);

    // Detect if the validator is async or sync at runtime
    const isAsync = validator.constructor.name === 'AsyncFunction';

    const newField = isAsync
      ? field.custom(
        async (value, helpers) => {
          try {
            return await validator(value, helpers);
          } catch (e) {
            return helpers.message({ custom: message ?? (e as Error).message });
          }
        },
        'custom'
      )
      : field.custom(
        (value, helpers) => {
          try {
            return (validator as (v: T[K], h: Joi.CustomHelpers) => T[K])(value, helpers);
          } catch (e) {
            return helpers.message({ custom: message ?? (e as Error).message });
          }
        },
        'custom'
      );

    return new SchemaWrapper<T>(
      objectSchema.keys({ [key as string]: newField })
    );
  }

  withTranslationKey<K extends keyof T>(field: K, translationKey: string): SchemaWrapper<T> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('withTranslationKey() is only supported on object schemas');
    }
    const objectSchema = this.schema as Joi.ObjectSchema;
    const described = objectSchema.describe();
    if (!described.keys || !(field as string in described.keys)) {
      throw new Error(`Key "${String(field)}" does not exist in schema.`);
    }
    let fieldSchema = objectSchema.extract(field as string);
    fieldSchema = (fieldSchema as Schema).meta({ translationKey });
    const newSchema = objectSchema.keys({ [field]: fieldSchema });
    return new SchemaWrapper<T>(newSchema);
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
   * Returns a new SchemaWrapper with a .redact(obj) method that redacts the specified fields.
   * Usage: const safe = schema.withRedactedFields(['password']); safe.redact(obj)
   */
  withRedactedFields<K extends keyof T>(
    fields: K[] | string[],
    redactedValue: any = '[REDACTED]'
  ): SchemaWrapper<T> & { redact(obj: Partial<T>): Partial<T> } {
    const base = new SchemaWrapper<T>(this.raw);

    // Attach redact method for explicit usage
    (base as any).redact = function (obj: Partial<T>): Partial<T> {
      const result = { ...obj };
      for (const field of fields) {
        if (field in result) {
          (result as any)[field] = redactedValue;
        }
      }
      return result;
    };

    return base as any;
  }

  /**
   * Returns a new SchemaWrapper with an .omitFields(obj) method that removes the specified fields.
   * Usage: const safe = schema.omitFields(['password']); safe.omitFields(obj)
   */
  withOmittedFields<K extends keyof T>(
    fields: K[] | string[]
  ): SchemaWrapper<Omit<T, K>> & { omitFields(obj: Partial<T>): Omit<Partial<T>, K> } {
    const base = new SchemaWrapper<Omit<T, K>>(this.raw as any);

    (base as any).omitFields = function (obj: Partial<T>): Omit<Partial<T>, K> {
      const result = { ...obj };
      for (const field of fields) {
        delete (result as any)[field];
      }
      return result as Omit<Partial<T>, K>;
    };

    return base as any;
  }

  /**
   * Async validation with optional async pipeline.
   * Usage: await schema.validateAsync(input, [asyncValidator, ...])
   */
  async validateAsync(
    input: unknown,
    asyncValidators: Array<(value: T) => Promise<void>> = []
  ): Promise<T> {
    const { value, error } = this.safeValidate(input as Partial<T>);
    if (error || !value) throw error || new Error('Validation failed');
    if (asyncValidators) {
      for (const validator of asyncValidators) {
        await validator(value);
      }
    }
    return value;
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
  async validateAsyncOld(
    input: T,  // Change from unknown to T to get proper type hints
    asyncValidators: Array<(value: T) => Promise<void>> = []
  ): Promise<T> {
    const value = this.validateInternal(input);
    for (const validator of asyncValidators) {
      await validator(value);
    }
    return value;
  }

  /**
   * Makes all fields optional
   */
  partial(): SchemaWrapper<Partial<T>> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('partial() is only supported on object schemas');
    }
    const objectSchema = this.schema as ObjectSchema;
    const described = objectSchema.describe();
    const keys = Object.keys(described.keys || {});
    const partialSchemas: Record<string, Schema> = {};

    for (const key of keys) {
      partialSchemas[key] = objectSchema.extract(key).optional();
    }

    return new SchemaWrapper<Partial<T>>(Joi.object(partialSchemas));
  }

  /**
   * Makes all fields required
   */
  required(): SchemaWrapper<Required<T>> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('required() is only supported on object schemas');
    }
    const objectSchema = this.schema as ObjectSchema;
    const described = objectSchema.describe();
    const keys = Object.keys(described.keys || {});
    const requiredSchemas: Record<string, Schema> = {};

    for (const key of keys) {
      requiredSchemas[key] = objectSchema.extract(key).required();
    }

    return new SchemaWrapper<Required<T>>(Joi.object(requiredSchemas));
  }

  /**
   * Extends schema with default values
   */
  extendWithDefaults(defaults: Partial<T>): SchemaWrapper<T> {
    if (!isObjectSchema(this.schema)) {
      throw new Error('extendWithDefaults() is only supported on object schemas');
    }
    const objectSchema = this.schema as ObjectSchema;
    const described = objectSchema.describe();
    const keys = Object.keys(described.keys || {});
    const extendedSchemas: Record<string, Schema> = {};

    for (const key of keys) {
      const fieldSchema = objectSchema.extract(key);
      if (key in defaults) {
        // Cast the default value to BasicType to satisfy Joi's type constraints
        const defaultValue = defaults[key as keyof T] as Joi.BasicType;
        extendedSchemas[key] = fieldSchema.default(defaultValue);
      } else {
        extendedSchemas[key] = fieldSchema;
      }
    }

    return new SchemaWrapper<T>(Joi.object(extendedSchemas));
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

export function createSchema<T>(schema: Schema): SchemaWrapper<T> {
  return new SchemaWrapper<T>(schema);
}

export function createAlternativesSchema<T>(schema: AlternativesSchema<T>): SchemaWrapper<T> {
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
  schema: Schema | SchemaWrapper<any>,
  translationMap: Record<string, string>
) {
  // Handle both SchemaWrapper and raw Schema
  const rawSchema = 'raw' in schema ? (schema as SchemaWrapper<any>).raw : schema;

  // Rest of the function unchanged
  return {
    message: error.message,
    details: error.details.map(d => {
      const path = d.path.join('.');
      const fieldSchema = path ? (rawSchema as any).extract?.(path) : null;
      const translationKey = fieldSchema?.metas?.find((m: any) => m.translationKey)?.translationKey;

      return {
        path,
        message: translationKey && translationMap[translationKey] ? translationMap[translationKey] : d.message,
        type: d.type,
        translationKey,
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

export type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

const deepPartialMemo = new WeakMap<Schema, Schema>();

function deepPartialSchema(schema: Schema): Schema {
  if (deepPartialMemo.has(schema)) return deepPartialMemo.get(schema)!;
  let result: Schema;
  if (isObjectSchema(schema)) {
    const described = schema.describe();
    const keys = described.keys || {};
    const partialKeys: Record<string, Schema> = {};
    for (const k of Object.keys(keys)) {
      partialKeys[k] = deepPartialSchema(schema.extract(k));
    }
    result = Joi.object(partialKeys).optional();
  } else if ((schema as any).type === 'array') {
    const items = (schema as any).$_terms?.items;
    if (items && items.length > 0) {
      const partialItems = items.map((item: Schema) => deepPartialSchema(item));
      result = Joi.array().items(...partialItems).optional();
    } else {
      result = Joi.array().optional();
    }
  } else {
    result = (schema as Schema).optional();
  }
  deepPartialMemo.set(schema, result);
  return result;
}

export type { WhenOptions };