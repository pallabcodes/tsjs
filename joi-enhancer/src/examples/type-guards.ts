import Joi, { AnySchema } from 'joi';

export function isObjectSchema(schema: AnySchema): schema is Joi.ObjectSchema {
  return (schema as any).type === 'object';
}

export function isStringSchema(schema: AnySchema): schema is Joi.StringSchema {
  return (schema as any).type === 'string';
}

// Example usage:
const obj = Joi.object();
const str = Joi.string();

console.log(isObjectSchema(obj)); // true
console.log(isStringSchema(obj)); // false
console.log(isStringSchema(str)); // true