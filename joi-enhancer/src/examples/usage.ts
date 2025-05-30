import Joi from 'joi';
import { createSchema, conditionalField } from '../joiWrapper';

// Object-level conditional: adminCode required for admin, forbidden otherwise
const conditionalSchema = createSchema<{
  username: string;
  role: 'admin' | 'user';
  adminCode?: string;
}>(
  Joi.object({
    username: Joi.string().required(),
    role: Joi.string().valid('admin', 'user').required(),
    adminCode: Joi.string().when('role', {
      is: 'admin',
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  })
);

// Example: Valid admin
try {
  const result = conditionalSchema.validate({
    username: 'alice',
    role: 'admin',
    adminCode: 'SECRET',
  });
  console.log('Valid admin:', result);
} catch (e) {
  console.error('Validation failed:', e instanceof Error ? e.message : e);
}

// Example: Invalid admin (missing adminCode)
try {
  conditionalSchema.validate({
    username: 'bob',
    role: 'admin',
  });
} catch (e) {
  console.error('Validation failed:', e instanceof Error ? e.message : e);
}

// Example: Valid user (adminCode forbidden)
try {
  const result = conditionalSchema.validate({
    username: 'eve',
    role: 'user',
  });
  console.log('Valid user:', result);
} catch (e) {
  console.error('Validation failed:', e instanceof Error ? e.message : e);
}

// Example: Invalid user (adminCode present)
try {
  conditionalSchema.validate({
    username: 'mallory',
    role: 'user',
    adminCode: 'SHOULD-NOT-BE-HERE',
  });
} catch (e) {
  console.error('Validation failed:', e instanceof Error ? e.message : e);
}

// Advanced alternatives-level conditional example
const schema = createSchema<{
  x: string;
  y: string;
}>(
  Joi.object({
    x: Joi.string().min(1).max(5).required(),
    y: conditionalField('x', [
      { is: 'foo', then: Joi.string().valid('bar').required() },
      { not: 'foo', then: Joi.string().optional() },
    ]).match('one'),
  })
);

// Example payloads
try {
  const result = schema.validate({ x: 'foo', y: 'bar' });
  console.log('Valid:', result);
} catch (e) {
  console.error('Validation failed:', e instanceof Error ? e.message : e);
}

try {
  const result = schema.validate({ x: 'foo2', y: 'bar' });
  console.log('Valid:', result);
} catch (e) {
  console.error('Validation failed:', e instanceof Error ? e.message : e);
}

// Safe validation example
const input = { x: 'foo', y: 'baz' };
const result = schema.safeValidate(input);
if (result.error) {
  // handle error
} else {
  // result.value is type-safe
}
