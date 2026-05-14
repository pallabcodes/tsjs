import { renderHook, act } from '@testing-library/react';
import { useIon } from '../index';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

describe('Ion React: Exhaustive Lifecycle Verification', () => {
  
  it('should handle rapid-fire concurrent updates without state drift', async () => {
    const initialData = { count: 0 };
    const schema = [{ type: 'source', key: 'count', source: 'count' }] as const;
    
    const { result } = renderHook(() => useIon(initialData, schema));
    
    await act(async () => {
      const updates = Array.from({ length: 50 }).map((_, i) => 
        result.current.updateField('count', i + 1)
      );
      await Promise.all(updates);
    });

    expect(result.current.data.count).toBe(50);
    expect(result.current.isValid).toBe(true);
  });

  it('should synchronize errors correctly across deep schema recursion', async () => {
    const initialData = { profile: { name: '' } };
    const schema = [
      { 
        type: 'schema', 
        key: 'user', 
        source: 'profile', 
        schema: [
          { type: 'source', key: 'name', source: 'name', required: true }
        ] 
      }
    ] as const;

    const { result } = renderHook(() => useIon(initialData, schema));
    
    await act(async () => {
      await result.current.validate();
    });
    expect(result.current.errors['user.name'].code).toBe('required');

    await act(async () => {
      const newData = { profile: { name: 'Antigravity' } };
      await result.current.updateField('profile' as any, newData.profile as any);
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.errors['user.name']).toBeUndefined();
  });

  it('should maintain render-count stability during validation', async () => {
    const initialData = { val: 'test' };
    const schema = [{ type: 'source', key: 'val', source: 'val' }] as const;

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount++;
      return useIon(initialData, schema);
    });

    const initialRenders = renderCount;

    await act(async () => {
      await result.current.validate();
    });

    // We expect minimal re-renders for a high-performance hook
    // (Initial render + start-validate + end-validate/setErrors)
    expect(renderCount - initialRenders).toBeLessThanOrEqual(2);
  });
});
