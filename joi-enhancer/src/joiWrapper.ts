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

export function createSchema<T>(schema: ObjectSchema<any>): SchemaWrapper<T> {
  return new SchemaWrapper<T>(schema);
}
