import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { createValidation, required } from '../index';

describe('Ion Fuzz Testing: System Stability', () => {
  it('should NEVER crash regardless of data input (1000 samples)', async () => {
    const schema = [
      { type: 'source', key: 'a', source: 'a', required: true },
      { type: 'source', key: 'b', source: 'b.c.d' },
      { type: 'computed', key: 'c', compute: (d: any) => d?.x + d?.y }
    ] as const;

    await fc.assert(
      fc.asyncProperty(fc.anything(), async (data) => {
        try {
          const result = await createValidation(data).schema(schema).execute();
          expect(result).toBeDefined();
        } catch (err: any) {
          if (err.message.includes('Max validation depth')) return true;
          throw err;
        }
      }),
      { numRuns: 1000 }
    );
  });
});
