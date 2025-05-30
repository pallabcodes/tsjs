import { ValidationError } from 'joi';

export function formatError(error: ValidationError) {
  return {
    message: error.message,
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