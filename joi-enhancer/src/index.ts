import Joi from 'joi';
import {
  SchemaWrapper,
  createSchema,
  conditionalField,
  alternatives,
} from './joiWrapper';

// Re-export everything from Joi for full API access
export { Joi, SchemaWrapper, createSchema, conditionalField, alternatives };

// Ergonomic API for most use-cases, but also spread all Joi methods:
export const joi = {
  ...Joi,
  object: <T>(schema: Record<string, any>) => createSchema<T>(Joi.object(schema)),
  alternatives,
  conditionalField,
};

