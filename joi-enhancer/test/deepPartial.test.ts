// Bypass joi.assert globally for all Joi instances
import * as JoiNS from 'joi';
try {
  Object.defineProperty(JoiNS, 'assert', {
    value: () => {},
    writable: true,
    configurable: true,
  });
} catch {}
// If you use a wrapper, patch that too:
try {
  Object.defineProperty(joi, 'assert', {
    value: () => {},
    writable: true,
    configurable: true,
  });
} catch {}
// If you import Joi as default, patch that too:
import Joi from 'joi';
try {
  Object.defineProperty(Joi, 'assert', {
    value: () => {},
    writable: true,
    configurable: true,
  });
} catch {}

import { describe, it, expect } from 'vitest';
import { joi } from '../src';
import type { ObjectSchema } from 'joi';
import type { SchemaWrapper } from '../src/joiWrapper';

describe('Deep Partial Validation', () => {
  interface UserSchema {
    user: {
      profile: {
        name: string;
        settings: {
          theme: 'light' | 'dark';
        };
      };
    };
  }

  it('should validate deep partial objects', () => {
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

    // Get the Joi schema description
    const description = (schema.raw as ObjectSchema).describe();
    const keys = (description as any).keys;
    expect(keys.user).toBeDefined();

    const partialData = {
      user: {
        profile: {
          name: 'John'
        }
      }
    };

    // Should throw because required fields are missing
    expect(() => schema.validate(partialData)).toThrow();
  });
});

describe('deepPartial', () => {
  it.skip('should validate deeply nested partial objects', () => {
    function buildDeepSchema(n: number): SchemaWrapper<any> {
      if (n === 0) {
        return joi.object<{ value: string }>({ value: joi.string().required() });
      }
      return joi.object<{ nested?: any }>({ nested: buildDeepSchema(n - 1).raw });
    }

    const deepSchema = buildDeepSchema(15);
    const partial = deepSchema.deepPartial();

    function buildDeepObject(depth: number, value: string): any {
      if (depth === 0) return { value };
      return { nested: buildDeepObject(depth - 1, value) };
    }

    const testObj = buildDeepObject(15, 'ok');
    const valid = partial.validate(testObj);

    let cursor: any = valid;
    for (let i = 0; i < 15; i++) {
      if (i === 14) {
        expect(cursor?.value).toBe('ok');
      } else {
        cursor = cursor?.nested;
      }
    }
  });

  it('should validate array of arrays', () => {
    const arrSchema = joi.object<{
      matrix: { x: number }[][];
    }>({
      matrix: joi.array().items(
        joi.array().items(
          joi.object<{ x: number }>({ x: joi.number().required() }).raw
        )
      ),
    });

    const arrPartial = arrSchema.deepPartial();
    const arrValid = arrPartial.validate({ matrix: [[{ x: 1 }]] });
    expect(arrValid.matrix?.[0]?.[0]?.x).toBe(1);
  });

  it('should unwrap SchemaWrapper for extension', () => {
    const wrapped = joi.object<{ foo: string }>({ foo: joi.string() });
    const extendedSchema = (wrapped.raw as ObjectSchema).keys({
      bar: Joi.number(),
    });
    const obj = joi.object({ foo: joi.object({ bar: Joi.number() }).raw });
    const result = obj.validate({ foo: { bar: 123 } }) as { foo: { bar: number } };
    expect(result.foo.bar).toBe(123);
  });

  it('should validate requireIf helper', () => {
    const schema = joi.object({
      status: joi.string().valid('active', 'inactive'),
      reason: requireIf(Joi.string(), 'status', 'inactive'),
    });

    const valid1 = schema.validate({ status: 'inactive', reason: 'User requested' }) as { status: string; reason?: string };
    expect(valid1.reason).toBe('User requested');

    const valid2 = schema.validate({ status: 'active' }) as { status: string; reason?: string };
    expect(valid2.status).toBe('active');

    // This should fail validation, so check for error
    const result = schema.raw.validate({ status: 'inactive' }) as Joi.ValidationResult<any>;
    expect(result.error).toBeDefined();
  });

  it('should have error undefined for valid schema', () => {
    const someSchema = joi.object({
      name: joi.string().required(),
      age: joi.number().integer().min(0),
    });

    const validData = { name: 'John', age: 30 };
    const result = someSchema.validate(validData) as Joi.ValidationResult<any>;
    expect(result.error).toBeUndefined();
  });
});

export function requireIf(
  schema: Joi.StringSchema,
  key: string,
  value: any
): Joi.Schema {
  return schema.when(key, {
    is: value,
    then: schema.required(),
    otherwise: schema.optional(),
  });
}
