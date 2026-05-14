import { describe, it, expect } from 'vitest';
import { createValidationStream } from '../protocols/ion';
import { IonField } from '../types/fields';

describe('Ion Rules: Atomic Validation', () => {
  it('should validate required fields via constraint', async () => {
    const data = { a: '' };
    const schema: ReadonlyArray<IonField<typeof data>> = [{ type: 'source', key: 'a', source: 'a', required: true }];
    
    const stream = createValidationStream(data, schema);
    let hasError = false;

    for await (const event of stream) {
      if (event.type === 'field_error') hasError = true;
    }

    expect(hasError).toBe(true);
  });
});
