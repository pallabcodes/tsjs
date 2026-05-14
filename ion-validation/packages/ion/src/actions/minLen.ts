import { Rule, Success, Failure } from '../types/monad';

/**
 * minLen: Validates that a string or array has a minimum length.
 */
export const minLen = (len: number, message?: string): Rule<any> => {
  return (val: any): Success<any> | Failure => {
    if (val && val.length >= len) {
      return { value: val } as Success<any>;
    }
    return { 
      error: { 
        code: 'min_len', 
        message: message || `Minimum length is ${len}`,
        params: { min: len }
      } 
    } as Failure;
  };
};
