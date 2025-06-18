import { describe, it, expect } from 'vitest';
import { joi } from '../src';

describe('Backward Compatibility', () => {
  it('should maintain existing schema validation behavior', () => {
    const existingSchema = joi.object<{
      name: string;
      age?: number;
    }>({
      name: joi.string().required(),  // Using standard Joi .required()
      age: joi.number()
    });

    const result = existingSchema.validate({ name: 'John' });
    expect(result.name).toBe('John');
    expect(result.age).toBeUndefined();
  });

  it('should preserve conditional validation', () => {
    const schema = joi.object<{
      type: 'user' | 'admin';
      code?: string;
    }>({
      type: joi.string().valid('user', 'admin').required(),
      code: joi.string().when('type', {
        is: 'admin',
        then: joi.string().required(),
        otherwise: joi.forbidden()
      })
    });

    expect(() => schema.validate({ type: 'admin' })).toThrow();
    expect(() => schema.validate({ type: 'user', code: 'test' })).toThrow();
    expect(schema.validate({ type: 'admin', code: 'test' })).toEqual({
      type: 'admin',
      code: 'test'
    });
  });
});