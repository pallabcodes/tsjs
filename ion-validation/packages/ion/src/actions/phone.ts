import { Rule } from '../types/validator';
import { failure, success } from '../types/result';

/**
 * isPhone: Simple phone number validation.
 */
export const isPhone = (message: string = 'Invalid phone number'): Rule<string> => (val) => {
  const phoneRegex = /^\+?[\d\s-]{7,15}$/;
  if (!phoneRegex.test(val)) {
    return failure(message);
  }
  return success(val);
};
