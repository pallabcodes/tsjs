import { Success, Failure, Result } from '../types/result';

export { Success, Failure, Result };

export const success = <T>(value: T): Success<T> => ({
  tag: 'success',
  value,
});

export const failure = (error: string): Failure => ({
  tag: 'failure',
  error,
});

export const isSuccess = <T>(result: Result<T>): result is Success<T> =>
  result.tag === 'success';
