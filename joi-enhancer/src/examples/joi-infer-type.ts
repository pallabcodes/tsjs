/**
 * Product-grade Zod/Yup-style type inference for Joi schemas.
 * Use `InferJoiType<typeof schema>` to get the TypeScript type.
 * No type hacks, no ignores, fully type-safe.
 */
import Joi from 'joi';
import { InferJoiType } from '../types/joi-extract-type';

const schema = Joi.object({
  username: Joi.string().required(),
  age: Joi.number().optional(),
});
type User = InferJoiType<typeof schema>;

// Type-safe usage
const validUser: User = { username: 'alice', age: 30 };

// Runtime validation example
const result = schema.validate({ username: 'alice', age: 30 });
if (result.error) {
  console.error('Validation failed:', result.error);
} else {
  // result.value is type-safe!
  const user: User = result.value;
  console.log('Valid user:', user);
}