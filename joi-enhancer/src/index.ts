import Joi from 'joi';
import type { ExtractType } from 'joi-extract-type';
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

// Fix joi object - make all methods functions that return new instances
export const joi = {
  string: () => Joi.string(),
  number: () => Joi.number(),
  boolean: () => Joi.boolean(),
  date: () => Joi.date(),
  array: () => Joi.array(),
  object: <T>(schema: Record<string, any>) => createSchema<T>(Joi.object(schema)),
  alternatives: () => alternatives(),
  conditionalField,
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
};

// Type inference helpers
export { default as ExtractType } from 'joi-extract-type';
export type { ExtractType as InferJoiType } from 'joi-extract-type';