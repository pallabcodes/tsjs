import { describe, it, expect } from 'vitest';
import { joi } from '../src';

describe('Edge Cases - Extended', () => {
  it('should handle undefined in optional fields', () => {
    const schema = joi.object<{ name: string; age?: number }>({
      name: joi.string().required(),
      age: joi.number()
    });
    
    const result = schema.validate({ name: 'John', age: undefined });
    expect(result.name).toBe('John');
    expect(result.age).toBeUndefined();
  });

  it('should handle null values correctly', () => {
    const schema = joi.object<{ name: string; data: null | string }>({
      name: joi.string().required(),
      data: joi.string().allow(null)
    });
    
    const result = schema.validate({ name: 'John', data: null });
    expect(result.data).toBeNull();
  });

  it('should handle empty string validation correctly', () => {
    const schema = joi.object<{ name: string }>({
      name: joi.string().allow('').required()
    });
    
    const result = schema.validate({ name: '' });
    expect(result.name).toBe('');
  });

  it('should handle zero as valid number', () => {
    const schema = joi.object<{ count: number }>({
      count: joi.number().min(0).required()
    });
    
    const result = schema.validate({ count: 0 });
    expect(result.count).toBe(0);
  });

  it('should validate array with required items', () => {
    const schema = joi.object<{ tags: string[] }>({
      tags: joi.array().items(joi.string()).min(1).required()
    });
    
    expect(() => schema.validate({ tags: [] })).toThrow();
    const result = schema.validate({ tags: ['test'] });
    expect(result.tags).toEqual(['test']);
  });
});