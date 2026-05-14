import { Result, success } from '../types/result';

/**
 * pipe: Composes multiple validators into a single execution unit.
 * Functional composition pattern for validation logic.
 */
export function pipe<T>(...validators: Array<(val: unknown) => Result<unknown> | Promise<Result<unknown>>>): (val: unknown) => Result<T> | Promise<Result<T>> {
  return (initialValue: unknown) => {
    return validators.reduce(async (acc, validator) => {
      const res = await acc;
      if (res.tag === 'failure') return res;
      return validator(res.value);
    }, Promise.resolve(success(initialValue)) as any);
  };
}
