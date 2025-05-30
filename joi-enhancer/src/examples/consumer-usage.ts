import { joi, Joi } from '../index';

interface User {
  username: string;
  role: 'admin' | 'user';
  adminCode?: string;
}

// Example 1: Object-level conditional
const UserSchema = joi.object<User>({
  username: joi.string().required(),
  role: joi.string().valid('admin', 'user').required(),
  adminCode: joi.string().when('role', {
    is: 'admin',
    then: joi.string().required(),
    otherwise: joi.forbidden(),
  }),
});

// Example 2: Alternatives-level conditional
const AltSchema = joi.object<{
  x: string;
  y: string;
}>({
  x: joi.string().min(1).max(5).required(),
  y: joi.conditionalField('x', [
    { is: 'foo', then: joi.string().valid('bar').required() },
    { not: 'foo', then: joi.string().optional() },
  ]).match('one'),
});

// Usage
const user = UserSchema.validate({
  username: 'alice',
  role: 'admin',
  adminCode: 'SECRET',
});

console.log('User validated:', user);

const alt = AltSchema.validate({ x: 'foo', y: 'bar' });
console.log('Alt validated:', alt);


// Native Joi usage example (for advanced/edge cases)
const rawSchema = Joi.object({
  foo: Joi.string().required(),
  bar: Joi.number().min(0),
});

const { error, value } = rawSchema.validate({ foo: 'hello', bar: 42 });

if (error) {
  console.error('Raw Joi validation failed:', error.message);
} else {
  console.log('Raw Joi validated:', value);
}