import { Result, AsyncResult } from './result';

export type ValidationContext<T = any> = {
  data: T;
  key: string;
};

/**
 * Validator Function: Pure transformation from unknown to Result.
 * Now with Context-Awareness.
 */
export type Validator<T, R = any> = (val: unknown, ctx: ValidationContext<R>) => Result<T> | AsyncResult<T>;

/**
 * Rule: A specialized validator that usually returns the same type or an error.
 * Now with Context-Awareness.
 */
export type Rule<T, R = any> = (val: T, ctx: ValidationContext<R>) => Result<T> | AsyncResult<T>;
