import { Rule } from '../types/validator';
import { success, failure } from '../utils/result';

/**
 * isEmail: Validates that a string follows a standard email format.
 */
export const isEmail = (message: string = 'Invalid email format'): Rule<string> => (val, ctx) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(val)) {
    return failure(message);
  }
  return success(val);
};
