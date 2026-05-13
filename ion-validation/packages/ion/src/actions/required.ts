import { Rule } from '../types/validator';
import { success, failure } from '../utils/result';

/**
 * required: Ensures a value is not null, undefined, or an empty string.
 */
export const required = (message: string = 'Field is required'): Rule<any> => (val, ctx) => {
  if (val === undefined || val === null || val === '') {
    return failure(message);
  }
  return success(val);
};
