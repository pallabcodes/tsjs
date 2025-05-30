/**
 * Product-grade Zod/Yup-style type inference for Joi schemas.
 * Use `InferJoiType<typeof schema>` to get the TypeScript type.
 * No type hacks, no ignores, fully type-safe.
 */
import Joi from 'joi';
import ExtractType from 'joi-extract-type';

// Ergonomic type alias for devs
// Usage: InferJoiType<typeof schema>
type InferJoiType<T> = ReturnType<typeof ExtractType<T>>;

// type InferJoiType<T> = ReturnType<typeof ExtractType>;

const schema = Joi.object({
  username: Joi.string().required(),
  age: Joi.number().optional(),
});
type User = InferJoiType<typeof schema>;

// Type-safe usage
const validUser: User = { username: 'alice', age: 30 };
// Uncommenting the next line will cause a TypeScript error (as expected):
// const invalidUser: User = { username: 'bob', extra: true };

// Runtime validation example
const result = schema.validate({ username: 'alice', age: 30 });
if (result.error) {
  console.error('Validation failed:', result.error);
} else {
  // result.value is type-safe!
  const user: User = result.value;
  console.log('Valid user:', user);
}