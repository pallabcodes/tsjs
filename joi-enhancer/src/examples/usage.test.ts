import { describe, it, expect } from 'vitest';
import Joi from 'joi';
import { createSchema } from '../joiWrapper';

type User = {
  mobile?: string;
  email?: string;
  password?: string;
};

describe('SchemaWrapper conditional tests', () => {
  const baseSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
    mobile: Joi.string(),
  }).with('email', 'password');

  const userSchema = createSchema<User>(baseSchema);

  it('should validate with only mobile provided', () => {
    const result = userSchema.validate({ mobile: '1234567890' }) as any;
    expect(result.mobile).toBe('1234567890');
  });

  it('should validate with email and password only', () => {
    const result = userSchema.validate({ email: 'test@example.com', password: 'secret' }) as any;
    expect(result.email).toBe('test@example.com');
    expect(result.password).toBe('secret');
  });

  it('should validate with all fields provided', () => {
    const result = userSchema.validate({
      mobile: '1234567890',
      email: 'test@example.com',
      password: 'secret',
    }) as any;
    expect(result.mobile).toBe('1234567890');
    expect(result.email).toBe('test@example.com');
    expect(result.password).toBe('secret');
  });

  it('should NOT fail when no fields provided', () => {
    const { error } = userSchema.raw.validate({});
    expect(error).toBeUndefined();
  });

  it('should fail when email without password', () => {
    const { error } = userSchema.raw.validate({ email: 'test@example.com' });
    expect(error).toBeDefined();
  });

  it('should NOT fail when password without email', () => {
    const { error } = userSchema.raw.validate({ password: 'secret' });
    expect(error).toBeUndefined();
  });

  it('should validate with mobile and password only', () => {
    const result = userSchema.validate({ mobile: '1234567890', password: 'secret' }) as any;
    expect(result.mobile).toBe('1234567890');
    expect(result.password).toBe('secret');
  });

  it('should fail with mobile and email only (missing password)', () => {
    const { error } = userSchema.raw.validate({ mobile: '1234567890', email: 'test@example.com' });
    expect(error).toBeDefined();
  });
});
