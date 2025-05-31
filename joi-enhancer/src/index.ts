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
} from './joiWrapper';

// Ergonomic API for most use-cases
export const joi = {
  string: Joi.string,
  number: Joi.number,
  boolean: Joi.boolean,
  date: Joi.date,
  array: Joi.array,
  object: <T>(schema: Record<string, any>) => createSchema<T>(Joi.object(schema)),
  alternatives,
  conditionalField,
  stripField,
  requireIf,
  isObjectSchema,
  isStringSchema,
  formatError,
  forbidden: () => Joi.forbidden(), // <-- fix here
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
};

// Type inference helpers
export { default as ExtractType } from 'joi-extract-type';
export type { ExtractType as InferJoiType } from 'joi-extract-type';

