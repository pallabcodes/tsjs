import { describe, it, expect } from 'vitest';
import { joi } from '../src';

describe('Deep Nesting Validation', () => {
  it('should validate deeply nested objects', () => {
    const schema = joi.object({
      user: joi.object({
        profile: joi.object({
          name: joi.string().required(),
          settings: joi.object({
            theme: joi.string().valid('light', 'dark').required()
          }).required().raw
        }).required().raw
      }).required().raw
    });

    const valid = {
      user: {
        profile: {
          name: 'John',
          settings: {
            theme: 'dark' as const
          }
        }
      }
    };

    const result = schema.validate(valid);
    expect(result).toEqual(valid);

    const invalid = {
      user: {
        profile: {
          name: 'John',
          settings: {
            theme: 'invalid' as any
          }
        }
      }
    };

    expect(() => schema.validate(invalid)).toThrow();
  });
});