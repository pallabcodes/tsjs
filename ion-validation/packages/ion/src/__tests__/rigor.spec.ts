import { describe, it, expect } from 'vitest';
import { createValidation } from '../index';
import { IonField } from '../types/fields';

describe('Ion Industrial Rigor: Exhaustive Verification', () => {
  
  it('should handle a massive schema (1000 fields) with high performance', async () => {
    const data: Record<string, number> = {};
    const schema: IonField<any>[] = [];

    for (let i = 0; i < 1000; i++) {
      data[`field_${i}`] = i;
      schema.push({ type: 'source', key: `field_${i}`, source: `field_${i}` });
    }

    const start = performance.now();
    const result = await createValidation(data).schema(schema as any).execute();
    const duration = performance.now() - start;

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.data).length).toBe(1000);
    // Industrial standard: < 50ms for 1000 fields
    expect(duration).toBeLessThan(50);
  });

  it('should survive ultra-deep recursion (30 levels)', async () => {
    let data: any = { val: 'base' };
    let schema: any = [{ type: 'source', key: 'val', source: 'val' }];

    for (let i = 0; i < 30; i++) {
      data = { child: data };
      schema = [{ type: 'schema', key: 'child', source: 'child', schema }];
    }

    const result = await createValidation(data).schema(schema as any).execute();
    
    // Drill down 30 levels to verify
    let current = result.data;
    for (let i = 0; i < 30; i++) current = current.child;
    expect(current.val).toBe('base');
  });

  it('should be resilient against complex race conditions', async () => {
    const data = { id: 1 };
    const schema = [{ type: 'source', key: 'id', source: 'id' }] as const;

    // Simulate 100 parallel executions
    const tasks = Array.from({ length: 100 }).map(() => 
      createValidation(data).schema(schema).execute()
    );

    const results = await Promise.all(tasks);
    expect(results.every(r => r.isValid)).toBe(true);
    expect(results.every(r => r.data.id === 1)).toBe(true);
  });

  it('should block sophisticated prototype pollution vectors', async () => {
    const data = JSON.parse('{"constructor": {"prototype": {"polluted": true}}}');
    const schema = [{ type: 'source', key: 'polluted', source: 'constructor.prototype.polluted' }] as const;
    
    const result = await createValidation(data).schema(schema as any).execute();
    expect(result.data.polluted).toBeUndefined();
  });

  it('should handle "Garbage" data gracefully without crashing', async () => {
    const garbageData = [null, undefined, 0, false, "", [], {}, Symbol('test'), () => {}];
    const schema = [{ type: 'source', key: 'val', source: 'val' }] as const;

    for (const data of garbageData) {
      const result = await createValidation({ val: data }).schema(schema as any).execute();
      expect(result).toBeDefined();
    }
  });
});
