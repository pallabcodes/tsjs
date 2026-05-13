import { Rule } from '../types/validator';
import { success, failure } from '../utils/result';

/**
 * minLen: Ensures a string has a minimum number of characters.
 */
export const minLen = (min: number): Rule<string> => (val, ctx) => {
  if (typeof val !== 'string' || val.length < min) {
    return failure(`Minimum length is ${min} characters`);
  }
  return success(val);
};
