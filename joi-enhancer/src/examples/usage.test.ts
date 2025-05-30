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
    mobile: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
  })
    .or('mobile', 'email')
    .with('email', 'password')
    .with('password', 'email');

  const userSchema = createSchema<User>(baseSchema);

  it('should validate with only mobile provided', () => {
    const result = userSchema.validate({ mobile: '1234567890' });
    expect(result.mobile).toBe('1234567890');
  });

  it('should validate with email and password only', () => {
    const result = userSchema.validate({ email: 'test@example.com', password: 'secret' });
    expect(result.email).toBe('test@example.com');
    expect(result.password).toBe('secret');
  });

  it('should validate with all fields provided', () => {
    const result = userSchema.validate({
      mobile: '1234567890',
      email: 'test@example.com',
      password: 'secret',
    });
    expect(result.mobile).toBe('1234567890');
    expect(result.email).toBe('test@example.com');
    expect(result.password).toBe('secret');
  });

  it('should fail when no fields provided', () => {
    expect(() => userSchema.validate({})).toThrow();
  });

  it('should fail when email without password', () => {
    expect(() => userSchema.validate({ email: 'test@example.com' })).toThrow();
  });

  it('should fail when password without email', () => {
    expect(() => userSchema.validate({ password: 'secret' })).toThrow();
  });
});
