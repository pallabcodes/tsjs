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
} from './joiWrapper';

// Ergonomic API for most use-cases
export const joi = {
  object: <T>(schema: Record<string, any>) => createSchema<T>(Joi.object(schema)),
  alternatives,
  conditionalField,
  stripField,
  requireIf,
  isObjectSchema,
  isStringSchema,
  formatError,
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
};

// Type inference helpers
export { default as ExtractType } from 'joi-extract-type';
export type { ExtractType as InferJoiType } from 'joi-extract-type';

