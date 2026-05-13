import { Result, success } from '../utils/result';
import { isSuccess } from '../utils/result';

/**
 * pipe: A functional utility to chain validators.
 * Logic: It short-circuits on the first failure.
 */
export function pipe<T>(...validators: Array<(val: any) => Result<any>>): (val: any) => Result<T> {
  return (initialValue: any) => {
    return validators.reduce((acc, validator) => {
      if (isSuccess(acc)) {
        return validator(acc.value);
      }
      return acc;
    }, success(initialValue) as Result<any>);
  };
}
