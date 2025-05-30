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

export function describeSchema(schema: ObjectSchema<any>) {
  return schema.describe();
}
