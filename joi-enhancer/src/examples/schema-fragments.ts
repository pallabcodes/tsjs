import Joi from 'joi';

// Define reusable fragments
const nameFragment = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
};

const addressFragment = {
  address: Joi.string(),
  city: Joi.string(),
};

// Compose fragments into a full schema
const UserSchema = Joi.object({
  ...nameFragment,
  ...addressFragment,
  age: Joi.number().min(0),
});

// Example usage:
console.log(UserSchema.validate({ firstName: 'A', lastName: 'B', city: 'X', age: 30 }));