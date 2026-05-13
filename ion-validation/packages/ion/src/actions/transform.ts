import { Rule } from '../types/validator';
import { success } from '../utils/result';

/**
 * transform: A utility rule to reshape data mid-pipeline.
 * It always succeeds and returns the transformed value.
 */
export function transform<T, R, C = any>(fn: (val: T) => R | Promise<R>): Rule<any, C> {
  return async (val: T) => {
    const transformed = await fn(val);
    return success(transformed) as any;
  };
}
