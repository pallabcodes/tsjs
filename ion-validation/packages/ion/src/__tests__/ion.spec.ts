import { describe, it, expect } from 'vitest';
import { createValidation } from '../index';
import { IonField } from '../types/fields';

describe('Ion High-Level API: Stable Orchestration', () => {
  it('should execute a full validation pass successfully', async () => {
    const data = { email: 'test@example.com' };
    const schema: ReadonlyArray<IonField<typeof data>> = [
      { type: 'source', key: 'email', source: 'email', required: true }
    ];

    const result = await createValidation(data).schema(schema).execute();
    expect(result.isValid).toBe(true);
    expect(result.data.email).toBe('test@example.com');
  });

  it('should yield errors for invalid contracts', async () => {
    const data = { email: '' };
    const schema: ReadonlyArray<IonField<typeof data>> = [
      { type: 'source', key: 'email', source: 'email', required: true }
    ];

    const result = await createValidation(data).schema(schema).execute();
    expect(result.isValid).toBe(false);
    expect(result.errors.email.code).toBe('required');
  });
});
