import { Result, Success, Failure, isSuccess } from '../types/monad';
import { Rule, ValidationContext } from '../types/fields';

/**
 * every: Combines multiple rules into one. Fails on the first error.
 */
export const every = <T, Ctx>(rules: ReadonlyArray<Rule<T, Ctx>>): Rule<T, Ctx> => {
  return async (val: T, ctx: ValidationContext<Ctx>): Promise<Result<T>> => {
    let current = val;
    for (const rule of rules) {
      const result = await rule(current, ctx);
      if (!isSuccess(result)) return result;
      current = result.value as T; // Explicitly preserve the generic T
    }
    return { value: current } as Success<T>;
  };
};

/**
 * when: Conditional validation. Executes rules only if the predicate passes.
 */
export const when = <T, Ctx>(
  predicate: (data: Ctx) => boolean, 
  rules: ReadonlyArray<Rule<T, Ctx>>
): Rule<T, Ctx> => {
  return async (val: T, ctx: ValidationContext<Ctx>): Promise<Result<T>> => {
    if (!predicate(ctx.data)) {
      return { value: val } as Success<T>;
    }
    return await every(rules)(val, ctx);
  };
};
