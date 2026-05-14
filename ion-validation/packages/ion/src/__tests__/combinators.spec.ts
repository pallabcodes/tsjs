import { describe, it, expect } from 'vitest';
import { every, when } from '../methods/combinators';
import { required } from '../actions/required';
import { isSuccess } from '../types/monad';

describe('Ion Combinators: Monadic Orchestration', () => {
  it('should execute "every" rules sequentially', async () => {
    const rule = every([required()]);
    const result = await rule('test', { data: {}, key: 'test' });
    expect(isSuccess(result)).toBe(true);
  });

  it('should skip rules if predicate is false', async () => {
    const data = { active: false };
    const rule = when((d: any) => d.active === true, [required()]);
    const result = await rule('', { data, key: 'test' });
    
    // Predicate is false, so it skips required() and returns success
    expect(isSuccess(result)).toBe(true);
  });
});
