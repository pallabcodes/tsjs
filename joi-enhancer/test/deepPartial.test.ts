import Joi from 'joi';
import { joi } from '../src/index';

// Helper for decrementing numbers at the type level (up to 15)
type Decrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// Recursive type for deep nesting
type DeepNested<T, N extends number> = N extends 0 ? T : { nested?: DeepNested<T, Decrement[N]> };

// Recursive schema builder that preserves type (runtime, not type-safe at every level)
function buildDeepSchema(n: number): import('../src/index').SchemaWrapper<any> {
  if (n === 0) {
    return joi.object<{ value: string }>({ value: joi.string().required() });
  }
  return joi.object<{ nested?: any }>({ nested: buildDeepSchema(n - 1) });
}

// Build the schema and type
type Leaf = { value: string };
type DeepType = DeepNested<Leaf, 15>;
const deepSchema = buildDeepSchema(15);

// Now deepPartial and validate will work at runtime!
const partial = deepSchema.deepPartial();

// Helper to build a deeply nested object with the correct depth
function buildDeepObject(depth: number, value: string): any {
  if (depth === 0) return { value };
  return { nested: buildDeepObject(depth - 1, value) };
}

const testObj = buildDeepObject(15, 'ok');
const valid = partial.validate(testObj);

// Traverse to the deepest value at runtime
let cursor: any = valid;
for (let i = 0; i < 15; i++) {
  if (i === 14) {
    // At the deepest level, value should exist
    console.assert(cursor?.value === 'ok', 'Deep partial works');
  } else {
    cursor = cursor?.nested;
  }
}

// Array of arrays test
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
console.assert(arrValid.matrix?.[0]?.[0]?.x === 1, 'Array of arrays deepPartial works');

// SchemaWrapper unwrap test
const wrapped = joi.object<{ foo: string }>({ foo: joi.string() });
const extendedSchema = wrapped.raw.keys({
  bar: Joi.number(),
});
