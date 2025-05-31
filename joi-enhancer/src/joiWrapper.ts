import Joi, { Schema, ValidationError, ValidationResult, ObjectSchema, WhenOptions, AnySchema, AlternativesSchema } from 'joi';



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
  safeValidate(input: unknown): { value?: T; error?: Joi.ValidationError } {
    const { error, value } = this.schema.validate(input, { abortEarly: false, stripUnknown: true });
    if (error) {
      return { error };
    }
    return { value: value as T, error: undefined };
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

  deepPartial(): SchemaWrapper<DeepPartial<T>> {
    const partialSchema = deepPartialSchema(this.schema) as ObjectSchema<any>;
    return new SchemaWrapper<DeepPartial<T>>(partialSchema);
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
      const items = (current as any).$_terms?.items;
      if (items && items.length > 0) {
        const partialItems = items.map((item: Schema) => {
          stack.push({ parent: null, key: null, schema: item });
          return nodeMap.get(item) || item;
        });
        result = Joi.array().items(...partialItems).optional();
      } else {
        result = Joi.array().optional();
      }
    } else {
      result = (current as Schema).optional();
    }

    nodeMap.set(current, result);
    if (parent && key) parent[key] = result;
  }

  return nodeMap.get(schema)!;
}
