/**
 * Product-grade Zod/Yup-style type inference for Joi schemas.
 * Use `Infer<typeof schema>` to get the TypeScript type.
 * No type hacks, no ignores, fully type-safe.
 */
import Joi from 'joi';
import { createSchema, Infer } from '../joiWrapper';

// Create a wrapped schema
const schema = createSchema(Joi.object({
  username: Joi.string().required(),
  age: Joi.number().optional(),
}));

// Now Infer will work correctly
type User = Infer<typeof schema>;