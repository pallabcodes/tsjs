import Joi, { WhenOptions } from 'joi';
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
  Infer, // Import directly, not as type
} from './joiWrapper';

// Re-export the Infer type
export { Infer }; // Export as value, not as type

// Export Joi wrapper
export const joi = {
  string: () => Joi.string(),
  number: () => Joi.number(),
  boolean: () => Joi.boolean(),
  date: () => Joi.date(),
  array: <T>() => Joi.array() as Joi.ArraySchema<T[]>,
  object: <T>(schema: Record<string, any>) => createSchema<T>(Joi.object(schema)),
  alternatives: <T>() => alternatives<T>(),
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

// Export everything else
export {
  Joi,
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