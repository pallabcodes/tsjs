import Joi, {
  Schema,
  ObjectSchema,
  ValidationError,
  WhenOptions,
  BasicType,
  AlternativesSchema,
  AnySchema
} from 'joi';

/**
 * Type inference helper for SchemaWrapper
 * @example
 * type UserType = Infer<typeof UserSchema>;
 */
export type Infer<T> = T extends SchemaWrapper<infer U> ? U : never;

/**
 * Deep partial type helper for nested objects
 * Makes all properties optional recursively
 * @example
 * type NestedPartial = DeepPartial<{ user: { name: string; age: number } }>;
 * // Results in: { user?: { name?: string; age?: number } }
 */
export type DeepPartial<T> = T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export declare class SchemaWrapper<T> {
  constructor(schema: Schema);

  /**
   * Validates input against schema with type safety
   * @throws {ValidationError} If validation fails
   * @example
   * const result = UserSchema.validate({ username: 'john' });
   */
  validate(input: unknown): T;

  /**
   * Safe validation that returns both value and error
   * @example
   * const { value, error } = UserSchema.safeValidate({ username: 'john' });
   */
  safeValidate(input: Partial<T>): {
    value: T | undefined;
    error: ValidationError | undefined;
  };

  /**
   * Extends schema with additional fields
   * @example
   * const Extended = UserSchema.extend({ extra: Joi.string() });
   */
  extend<U>(extension: ObjectSchema<U>): SchemaWrapper<T & U>;

  /**
   * Picks specific fields from schema
   * @example
   * const UsernameOnly = UserSchema.pick(['username']);
   */
  pick<K extends keyof T>(keys: K[]): SchemaWrapper<Pick<T, K>>;

  /**
   * Omits specific fields from schema
   * @example
   * const WithoutAge = UserSchema.omit(['age']);
   */
  omit<K extends keyof T>(keys: K[]): SchemaWrapper<Omit<T, K>>;

  /**
   * Adds conditional validation rules
   * @example
   * const Conditional = UserSchema.conditional('role', [
   *   { is: 'admin', then: Joi.required() }
   * ]);
   */
  conditional(
    ref: string,
    options: WhenOptions | WhenOptions[]
  ): SchemaWrapper<T>;

  /**
   * Merges with another schema
   * @example
   * const Merged = UserSchema.merge(ExtraSchema);
   */
  merge<U>(other: SchemaWrapper<U>): SchemaWrapper<T & U>;

  /**
   * Makes all fields optional
   * @example
   * const Optional = UserSchema.partial();
   */
  partial(): SchemaWrapper<Partial<T>>;

  /**
   * Makes all fields required
   * @example
   * const Required = UserSchema.required();
   */
  required(): SchemaWrapper<Required<T>>;

  /**
   * Extends schema with default values
   * @param defaults Object containing default values for fields
   * @example
   * const WithDefaults = UserSchema.extendWithDefaults({ age: 18 });
   */
  extendWithDefaults(
    defaults: Partial<Record<keyof T, BasicType>>
  ): SchemaWrapper<T>;

  /**
   * Adds custom validation logic with type safety
   * @param key Field to validate
   * @param validator Custom validation function
   * @param message Optional error message
   * @example
   * const Custom = UserSchema.withCustomValidator(
   *   'username',
   *   (value) => value !== 'admin' ? value : throw new Error('Reserved')
   * );
   */
  withCustomValidator<K extends keyof T>(
    key: K,
    validator: (value: T[K], helpers: Joi.CustomHelpers) => T[K] | Promise<T[K]>,
    message?: string
  ): SchemaWrapper<T>;

  /**
   * Adds translation key for error messages
   * @example
   * const I18n = UserSchema.withTranslationKey('username', 'errors.username');
   */
  withTranslationKey<K extends keyof T>(
    field: K,
    translationKey: string
  ): SchemaWrapper<T>;

  /**
   * Compares two schemas and returns their differences
   * @example
   * const diff = SchemaV1.diff(SchemaV2);
   */
  diff<U>(other: SchemaWrapper<U>): {
    added: string[];
    removed: string[];
    changed: string[];
  };

  // ... rest of the methods with similar improvements
}

// Make sure Infer is also exported (as an alias)
/** Creates a wrapped schema with type inference */
export declare function createSchema<T>(schema: Schema): SchemaWrapper<T>;

/** Creates an alternatives schema with type inference */
export declare function alternatives<T = any>(): AlternativesSchema<T>;

/** Creates a conditional field with type inference */
export declare function conditionalField<T = any>(
  ref: string,
  options: WhenOptions[]
): AlternativesSchema<T>;
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
export declare function describeSchema(
  schema: ObjectSchema<any>
): {
  type: string;
  keys: Record<string, {
    type: string;
    flags?: Record<string, unknown>;
    rules?: Array<{ name: string; args: Record<string, unknown> }>;
  }>;
  meta?: Record<string, unknown>;
};
export declare function describeWithType<T>(
  schema: ObjectSchema
): {
  meta: Record<string, unknown>;
  type: T;
};
export declare function atLeastOneOf<T extends Record<string, unknown>>(
  fields: Array<keyof T>
): (schema: Joi.ObjectSchema) => Joi.ObjectSchema;
export declare function mutuallyExclusive<T extends Record<string, unknown>>(
  fields: Array<keyof T>
): (schema: Joi.ObjectSchema) => Joi.ObjectSchema;
export declare function dynamicDefault<T extends Joi.Schema>(
  schema: T,
  key: string,
  compute: (value: unknown) => unknown
): T;

/**
 * Creates a schema wrapper from raw Joi schema
 * @param schema Raw Joi schema
 * @returns Wrapped schema with type inference
 * @example
 * const UserSchema = createSchema<User>(
 *   joi.object({ username: joi.string() })
 * );
 */
export declare function createAlternativesSchema<T>(
  schemas: Array<Schema | SchemaWrapper<any>>
): SchemaWrapper<T>;
