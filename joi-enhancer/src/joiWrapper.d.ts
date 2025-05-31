import Joi, { AnySchema, ValidationError, WhenOptions, ObjectSchema, AlternativesSchema, Schema } from 'joi';

export declare class SchemaWrapper<T> {
  constructor(schema: ObjectSchema<any>);

  validate(input: unknown): T;
  safeValidate(input: unknown): { value: T | undefined; error: ValidationError | undefined };
  extend<U>(extension: ObjectSchema<any>): SchemaWrapper<T & U>;
  pick<K extends keyof T>(keys: K[]): SchemaWrapper<Pick<T, K>>;
  omit<K extends keyof T>(keys: K[]): SchemaWrapper<Omit<T, K>>;
  conditional(ref: string, options: WhenOptions | WhenOptions[]): SchemaWrapper<T>;
  merge<U>(other: SchemaWrapper<U>): SchemaWrapper<T & U>;
  partial(): SchemaWrapper<Partial<T>>;
  required(): SchemaWrapper<Required<T>>;
  extendWithDefaults(defaults: Partial<T>): SchemaWrapper<T>;
  extendWith<U>(fields: Record<string, Schema>): SchemaWrapper<T & U>;
  pickBy(predicate: (schema: Schema, key: string) => boolean): SchemaWrapper<Partial<T>>;
  pickByType(type: string): SchemaWrapper<Partial<T>>;
  deepPartial(): SchemaWrapper<DeepPartial<T>>;
  omitBy(predicate: (schema: Schema, key: string) => boolean): SchemaWrapper<Partial<T>>;
  toJSONSchema(): object;
  withExample(example: any): SchemaWrapper<T>;
  describeWithExamples(): any;
  getDependencyGraph(): Record<string, { requires?: string[]; forbids?: string[]; conditionals?: any[] }>;
  generateExample(): T;
  withMeta(key: string, value: any): SchemaWrapper<T>;
  getMeta(key: string): any;
  withVersion(version: string): SchemaWrapper<T>;
  getVersion(): string | undefined;
  getFieldPresence(): Record<string, 'required' | 'optional' | 'forbidden'>;
  withCustomValidator<K extends keyof T>(key: K, validator: (value: T[K], helpers: Joi.CustomHelpers) => T[K], message?: string): SchemaWrapper<T>;
  withTranslationKey<K extends keyof T>(field: K, translationKey: string): SchemaWrapper<T>;
  diff<U>(other: SchemaWrapper<U>): { added: string[]; removed: string[]; changed: string[] };
  withRedactedFields(fields: (keyof T | string)[], redactedValue?: any): (obj: Partial<T>) => Partial<T>;
  validateAsync(input: unknown, asyncValidators?: Array<(value: T) => Promise<void>>): Promise<T>;

  readonly raw: ObjectSchema<any>;
}

export type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export declare function createSchema<T>(schema: ObjectSchema<any>): SchemaWrapper<T>;
export declare function alternatives<T = any>(): AlternativesSchema<T>;
export declare function conditionalField<T = any>(ref: string, options: WhenOptions[]): AlternativesSchema<T>;
export declare function stripField(): AnySchema;
export declare function requireIf<T extends Schema>(schema: T, key: string, value: any): T;
export declare function isObjectSchema(schema: AnySchema): schema is Joi.ObjectSchema;
export declare function isStringSchema(schema: AnySchema): schema is Joi.StringSchema;
export declare function formatError(error: ValidationError): {
  message: string;
  details: Array<{ path: string; message: string; type: string }>;
};
export declare function formatErrorWithCodes(error: ValidationError, codeMap: Record<string, string>): {
  message: string;
  details: Array<{ path: string; message: string; type: string; code: string }>;
};
export declare function formatErrorWithTranslations(
  error: ValidationError, 
  schema: Schema | SchemaWrapper<any>, 
  translationMap: Record<string, string>
): {
  message: string;
  details: Array<{ path: string; message: string; type: string; translationKey?: string }>;
};
export declare function describeSchema(schema: ObjectSchema<any>): any;
export declare function describeWithType<T>(schema: Joi.ObjectSchema): { meta: any; type: T };
export declare function atLeastOneOf<T extends Record<string, any>>(fields: (keyof T)[]): (schema: Joi.ObjectSchema) => Joi.ObjectSchema;
export declare function mutuallyExclusive<T extends Record<string, any>>(fields: (keyof T)[]): (schema: Joi.ObjectSchema) => Joi.ObjectSchema;
export declare function dynamicDefault<T extends Joi.Schema>(schema: T, key: string, compute: (value: any) => any): T;
