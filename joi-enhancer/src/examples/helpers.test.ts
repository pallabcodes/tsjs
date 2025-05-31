import { describe, it, expect } from 'vitest';
import { joi, Joi } from '../index';

const someSchemaWrapper = joi.string().required(); // This is just Joi.string().required()

describe('joi-enhancer helpers', () => {
  it('requireIf: should require field when condition is met', () => {
    const schema = joi.object({
      status: Joi.string().valid('active', 'inactive').required(),
      reason: Joi.string().when('status', {
        is: 'inactive',
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
    });
    const valid = schema.raw.validate({ status: 'active' });
    expect(valid.error).toBeUndefined();

    const invalid = schema.raw.validate({ status: 'inactive' });
    expect(invalid.error).toBeDefined();
  });

  it('stripField: should always strip the field', () => {
    const schema = joi.object({
      visible: Joi.string().required(),
      secret: joi.stripField(),
    });

    const result = schema.validate({ visible: 'show', secret: 'hide' });
    expect(result).toEqual({ visible: 'show' });
  });

  it('isObjectSchema: should detect object schemas', () => {
    expect(joi.isObjectSchema(joi.object({}).raw)).toBe(true);
    expect(joi.isObjectSchema(Joi.string())).toBe(false);
  });

  it('isStringSchema: should detect string schemas', () => {
    expect(joi.isStringSchema(Joi.string())).toBe(true);
    expect(joi.isStringSchema(joi.object({}).raw)).toBe(false);
  });

  it('formatError: should format Joi errors', () => {
    const schema = joi.object({
      foo: Joi.string().required()
    });
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

  it('array of arrays deepPartial', () => {
    const schema = joi.object({
      matrix: Joi.array().items(
        Joi.array().items(
          Joi.object({
            x: Joi.number().required(),
            y: Joi.number().required(),
          })
        )
      ),
    });

    // 2D array, not 3D!
    const arrValid = { matrix: [[ { x: 1, y: 2 } ]] };
    const arrInvalid = { matrix: [[ { y: 2 } ]] };

    const { value, error } = schema.raw.validate(arrValid);
    expect(error).toBeUndefined();
    expect(value).toEqual(arrValid);
    expect(value.matrix?.[0]?.[0]?.x).toBe(1);

    const { error: invalidError } = schema.raw.validate(arrInvalid);
    expect(invalidError).toBeDefined();
  });
});