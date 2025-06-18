import { describe, it, expect } from 'vitest';
import { joi } from '../src';

describe('Schema Composition - Extended', () => {
  it('should merge two schemas correctly', () => {
    const schema1 = joi.object<{ name: string }>({
      name: joi.string().required()
    });

    const schema2 = joi.object<{ age: number }>({
      age: joi.number().required()
    });

    const combined = schema1.merge(schema2);
    const result = combined.validate({ name: 'John', age: 30 });

    expect(result).toEqual({ name: 'John', age: 30 });
  });

  it('should handle nested schema merging', () => {
    // Define types for better clarity
    type Address = { street: string };
    type UserWithAddress = { 
      name: string; 
      address: Address;
    };

    const addressSchema = joi.object<Address>({
      street: joi.string().required()
    });

    const userSchema = joi.object<UserWithAddress>({
      name: joi.string().required(),
      address: addressSchema.raw
    });

    const result = userSchema.validate({
      name: 'John',
      address: { street: 'Main St' }
    });

    expect(result.name).toBe('John');
    expect(result.address.street).toBe('Main St');
  });

  it('should handle merging schemas with overlapping fields', () => {
    const schema1 = joi.object<{ name: string; age: number }>({
      name: joi.string().required(),
      age: joi.number().min(0)
    });

    const schema2 = joi.object<{ name: string; email: string }>({
      name: joi.string().min(5),
      email: joi.string().email()
    });

    const merged = schema1.merge(schema2);
    
    // Should use the stricter validation (required + min(5))
    expect(() => merged.validate({ 
      name: 'Jon',  // too short
      age: 25,
      email: 'test@example.com'
    })).toThrow();

    const valid = merged.validate({
      name: 'Jonathan',
      age: 25,
      email: 'test@example.com'
    });

    expect(valid.name).toBe('Jonathan');
  });
});