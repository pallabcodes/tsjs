import { Rule } from '../types/validator';
import { success, failure } from '../utils/result';

/**
 * isPhone: A lean, regex-based phone validator following the Ion Protocol.
 * This avoids external bloat and focuses on the protocol's contract.
 */
export const isPhone = (message: string = 'Invalid phone format (E.164 required)'): Rule<string> => (val, ctx) => {
  if (!val) return success(val);
  
  // Basic E.164 pattern or similar lean check
  const phonePattern = /^\+?[1-9]\d{1,14}$/;
  
  if (!phonePattern.test(val)) {
    return failure(message);
  }
  return success(val);
};
