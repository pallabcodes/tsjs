import { describe, it, expect } from 'vitest';
import { joi } from '../index';

describe('joi-enhancer helpers', () => {
  it('requireIf: should require field when condition is met', () => {
    const schema = joi.object({
      status: joi.string().valid('active', 'inactive').required(),
      reason: joi.requireIf('status', 'inactive'),
    });

    expect(() => schema.validate({ status: 'inactive' })).toThrow();
    expect(schema.validate({ status: 'active' })).toBeDefined();
    expect(schema.validate({ status: 'inactive', reason: 'left' })).toBeDefined();
  });

  it('stripField: should always strip the field', () => {
    const schema = joi.object({
      visible: joi.string().required(),
      secret: joi.stripField(),
    });

    const result = schema.validate({ visible: 'show', secret: 'hide' });
    expect(result).toEqual({ visible: 'show' });
  });

  it('isObjectSchema: should detect object schemas', () => {
    expect(joi.isObjectSchema(joi.object({}).raw)).toBe(true);
    expect(joi.isObjectSchema(joi.string())).toBe(false);
  });

  it('isStringSchema: should detect string schemas', () => {
    expect(joi.isStringSchema(joi.string())).toBe(true);
    expect(joi.isStringSchema(joi.object({}).raw)).toBe(false);
  });

  it('formatError: should format Joi errors', () => {
    const schema = joi.object({ foo: joi.string().required() });
    const { error } = schema.raw.validate({});
    expect(error).toBeDefined();
    if (error) {
      const formatted = joi.formatError(error);
      expect(formatted).toHaveProperty('message');
      expect(formatted).toHaveProperty('details');
      expect(formatted.details[0]).toHaveProperty('path');
      expect(formatted.details[0]).toHaveProperty('message');
      expect(formatted.details[0]).toHaveProperty('type');
    }
  });
});