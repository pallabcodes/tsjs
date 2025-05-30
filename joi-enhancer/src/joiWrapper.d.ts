import Joi, { AnySchema, ValidationError, WhenOptions, ObjectSchema, AlternativesSchema } from 'joi';

export declare class SchemaWrapper<T> {
  constructor(schema: ObjectSchema<any>);

  validate(input: unknown): T;

  extend<U>(extension: ObjectSchema<any>): SchemaWrapper<T & U>;

  pick<K extends keyof T>(keys: K[]): SchemaWrapper<Pick<T, K>>;

  conditional(ref: string, options: WhenOptions | WhenOptions[]): SchemaWrapper<T>;

  readonly raw: ObjectSchema<any>;
}

export declare function createSchema<T>(schema: ObjectSchema<any>): SchemaWrapper<T>;
export declare function alternatives<T = any>(): AlternativesSchema<T>;
export declare function conditionalField<T = any>(ref: string, options: WhenOptions[]): AlternativesSchema<T>;
export declare function stripField(): AnySchema;
export declare function requireIf<T = any>(ref: string, value: any): AnySchema;
export declare function isObjectSchema(schema: AnySchema): schema is Joi.ObjectSchema;
export declare function isStringSchema(schema: AnySchema): schema is Joi.StringSchema;
export declare function formatError(error: ValidationError): {
  message: string;
  details: Array<{ path: string; message: string; type: string }>;
};
