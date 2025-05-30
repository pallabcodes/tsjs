import Joi from 'joi';
import { createSchema } from '../joiWrapper';

// Define a base schema using Joi as usual
const baseSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  isAdmin: Joi.boolean().default(false),
});

// Wrap it to get enhanced type support and methods
const userSchema = createSchema<{
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}>(baseSchema);

// Validate some data
try {
  const validUser = userSchema.validate({
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
  });

  console.log(validUser);

  // Pick only id and email keys from user schema
  const partialUserSchema = userSchema.pick(['id', 'email']);

  const validPartial = partialUserSchema.validate({
    id: 2,
    email: 'bob@example.com',
  });

  console.log(validPartial);

  // Extend schema with an extra field
  const extendedSchema = userSchema.extend(
    Joi.object({ phone: Joi.string().optional() })
  );

  const validExtended = extendedSchema.validate({
    id: 3,
    name: 'Eve',
    email: 'eve@example.com',
    phone: '123-456-7890',
  });

  console.log(validExtended);
} catch (e) {
  console.error('Validation failed:', e);
}
