import Joi from 'joi';

import {
  SchemaWrapper,
  createSchema,
  conditionalField,
  alternatives,
  stripField, 
  requireIf,
  isObjectSchema,
  isStringSchema,
  formatError,
  describeSchema,
  atLeastOneOf,
  mutuallyExclusive,
  dynamicDefault,
  formatErrorWithCodes,
  describeWithType,
  formatErrorWithTranslations,
  createAlternativesSchema,
} from './joiWrapper';

import type { WhenOptions } from 'joi';

// Fix joi object - make all methods functions that return new instances
export const joi = {
  /**
   * Create a string schema with full type hints.
   * @returns A typed Joi string schema
   */
  string: () => Joi.string(),
  
  /**
   * Create a number schema with full type hints.
   * @returns A typed Joi number schema
   */
  number: () => Joi.number(),
  
  /**
   * Create a boolean schema with full type hints.
   * @returns A typed Joi boolean schema
   */
  boolean: () => Joi.boolean(),
  
  /**
   * Create a date schema with full type hints.
   * @returns A typed Joi date schema
   */
  date: () => Joi.date(),
  
  /**
   * Create an array schema with full type hints.
   * Usage: joi.array<string>().items(joi.string())
   * @returns A typed Joi array schema
   */
  array: <T>() => Joi.array() as Joi.ArraySchema<T[]>,
  
  /**
   * Create a typed object schema - ALWAYS provide a generic type!
   * Usage: joi.object<{username: string}>({...})
   * @returns A SchemaWrapper with full type hints
   */
  object: <T>(schema: Record<string, any>) => createSchema<T>(Joi.object(schema)),
  
  /**
   * Create an alternatives schema with full type hints.
   * Usage: joi.alternatives<string|number>().try(...)
   * @returns A typed alternatives schema
   */
  alternatives: <T>() => alternatives<T>(),
  
  /**
   * Create a conditional field with full type hints.
   * @returns A typed conditional alternatives schema
   */
  conditionalField: <T>(ref: string, options: WhenOptions[]) => conditionalField<T>(ref, options),
  
  stripField: () => stripField(),
  requireIf,
  isObjectSchema,
  isStringSchema,
  formatError,
  forbidden: () => Joi.forbidden(),
  atLeastOneOf,
  mutuallyExclusive,
  dynamicDefault,
};

// Native Joi for advanced/extensibility use
export { Joi };

// Advanced helpers and types
export {
  SchemaWrapper,
  createSchema,
  conditionalField,
  alternatives,
  stripField,
  requireIf,
  isObjectSchema,
  isStringSchema,
  formatError,
  describeSchema,
  atLeastOneOf,
  mutuallyExclusive,
  dynamicDefault,
  formatErrorWithCodes,
  describeWithType,
  formatErrorWithTranslations,
  createAlternativesSchema,
};

// Type inference helpers
export type { ExtractType, InferJoiType } from './types/joi-extract-type';

/**
 * Extract the output type from a SchemaWrapper.
 * Usage: type User = Infer<typeof UserSchema>;
 */
export type Infer<T> = T extends SchemaWrapper<infer U> ? U : never;