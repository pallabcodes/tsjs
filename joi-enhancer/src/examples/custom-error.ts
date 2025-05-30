import { ValidationError } from 'joi';

export class ValidationApiError extends Error {
  code: string;
  status: number;
  details: any[];

  constructor(error: ValidationError, code = 'VALIDATION_ERROR', status = 400) {
    super(error.message);
    this.code = code;
    this.status = status;
    this.details = error.details.map(d => ({
      path: d.path.join('.'),
      message: d.message,
      type: d.type,
    }));
  }
}

// Usage:
import Joi from 'joi';

const schema = Joi.object({ foo: Joi.string().required() });
const { error } = schema.validate({});
if (error) {
  throw new ValidationApiError(error);
}