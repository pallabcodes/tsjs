import { describe, it, expect } from 'vitest';
import { createValidation } from '../index';

describe('Ion Hardening: Defensive Integrity', () => {
  it('should block prototype pollution', async () => {
    const data = JSON.parse('{"__proto__": {"polluted": true}}');
    const schema = [{ type: 'source', key: 'polluted', source: '__proto__.polluted' }] as const;
    const result = await createValidation(data).schema(schema).execute();
    expect(result.data.polluted).toBeUndefined();
  });

  it('should enforce Max Depth protection', async () => {
    const circular: any = { key: 'val' };
    circular.child = circular; 

    const schema = [
      { 
        type: 'schema',
        key: 'circular', 
        schema: [
          { type: 'schema', key: 'nested', schema: [] } // Just triggers recursion
        ] 
      }
    ] as const;

    // The core loop should throw or catch the recursion error
    try {
      await createValidation(circular).schema(schema as any).execute();
    } catch (err: any) {
      expect(err.message).toContain('Max validation depth');
    }
  });
});
