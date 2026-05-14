import { describe, it, expect } from 'vitest';
import { createValidationStream } from '../protocols/ion';
import { IonField } from '../types/fields';
import { ValidationEvent } from '../types/protocol';

describe('Ion Protocol: Deep Traversal & Execution', () => {
  it('should resolve deep source paths', async () => {
    const data = { a: { b: { c: 1 } } };
    const schema: ReadonlyArray<IonField<typeof data>> = [
      { type: 'source', key: 'res', source: 'a.b.c' }
    ];

    const stream = createValidationStream(data, schema);
    let result: any;

    for await (const event of stream) {
      if (event.type === 'complete') result = event.data;
    }

    expect(result.res).toBe(1);
  });

  it('should support identity paths using "."', async () => {
    const data = { name: 'John' };
    const schema: ReadonlyArray<IonField<typeof data>> = [
      { type: 'source', key: 'identity', source: '.' }
    ];

    const stream = createValidationStream(data, schema);
    let result: any;

    for await (const event of stream) {
      if (event.type === 'complete') result = event.data;
    }

    expect(result.identity).toEqual(data);
  });

  it('should handle recursive schemas correctly', async () => {
    const data = { profile: { name: 'John' } };
    const schema: ReadonlyArray<IonField<typeof data>> = [
      { 
        type: 'schema', 
        key: 'user', 
        source: 'profile', 
        schema: [
          { type: 'source', key: 'firstName', source: 'name' }
        ] 
      }
    ];

    const stream = createValidationStream(data, schema);
    let result: any;

    for await (const event of stream) {
      if (event.type === 'complete') result = event.data;
    }

    expect(result.user.firstName).toBe('John');
  });
});
