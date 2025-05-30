import { ValidationError } from 'joi';

export function formatError(error: ValidationError, code?: string) {
  return {
    message: error.message,
    code,
    details: error.details.map(d => ({
      path: d.path.join('.'),
      message: d.message,
      type: d.type,
    })),
  };
}

// Example usage:
import Joi from 'joi';

const schema = Joi.object({ foo: Joi.string().required() });
const { error } = schema.validate({});
if (error) {
  console.log(formatError(error));
}

// Integration with an express-like response object
function validateInput(input: any, res: any) {
  const { error } = schema.validate(input);
  if (error) {
    return res.status(400).json(formatError(error, 'USER_VALIDATION_FAILED'));
  }
  // continue with valid input...
}