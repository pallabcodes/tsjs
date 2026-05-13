import { Result, success, failure } from '../utils/result';
import { isSuccess } from '../utils/result';
import { Rule, ValidationContext } from '../types/validator';

/**
 * and: Combines multiple rules, all must pass.
 */
export function and<T, R>(...rules: Rule<T, R>[]): Rule<T, R> {
  return async (val: T, ctx: ValidationContext<R>) => {
    let current = val;
    for (const rule of rules) {
      const res = await rule(current, ctx);
      if (!isSuccess(res)) return res;
      current = res.value;
    }
    return success(current);
  };
}

/**
 * or: Combines multiple rules, at least one must pass.
 */
export function or<T, R>(...rules: Rule<T, R>[]): Rule<T, R> {
  return async (val: T, ctx: ValidationContext<R>) => {
    const errors: string[] = [];
    for (const rule of rules) {
      const res = await rule(val, ctx);
      if (isSuccess(res)) return res;
      errors.push(res.error);
    }
    return failure(`None of the rules passed: ${errors.join(' OR ')}`);
  };
}

/**
 * when: Conditional validation.
 * Runs the rule only if the predicate returns true.
 */
export function when<T, R>(
  predicate: (data: R, ctx: ValidationContext<R>) => boolean | Promise<boolean>,
  rule: Rule<T, R>
): Rule<T, R> {
  return async (val: T, ctx: ValidationContext<R>) => {
    const shouldRun = await predicate(ctx.data, ctx);
    if (shouldRun) {
      return await rule(val, ctx);
    }
    return success(val);
  };
}
