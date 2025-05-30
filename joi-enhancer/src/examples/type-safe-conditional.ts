import Joi, { WhenOptions } from 'joi';

/**
 * Type-safe requireIf helper.
 * Usage: requireIf('otherField', true)
 */
export function requireIf<T = any>(ref: string, value: any) {
  return Joi.any().when(ref, {
    is: value,
    then: Joi.required(),
    otherwise: Joi.optional(),
  } as WhenOptions);
}

// Example usage:
const schema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required(),
  reason: requireIf('status', 'inactive'),
});

console.log(schema.validate({ status: 'active' })); // valid, reason optional
console.log(schema.validate({ status: 'inactive', reason: 'left' })); // valid, reason required
console.log(schema.validate({ status: 'inactive' })); // invalid, reason required