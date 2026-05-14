import { Rule, Success, Failure, isSuccess } from '../types/monad';

/**
 * isEmail: A high-signal rule for validating email format.
 * Adheres to the nominally branded Result monad.
 */
export const isEmail = (message: string = 'Invalid email format'): Rule<string> => {
  return (val: string): Success<string> | Failure => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(val)) {
      return { value: val } as Success<string>;
    }
    return { 
      error: { code: 'email', message } 
    } as Failure;
  };
};
