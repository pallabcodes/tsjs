import { Rule, Success, Failure } from '../types/monad';

/**
 * required: A legacy-compatible rule for presence validation.
 * Note: High-performance validation should use the first-class 'required' property in FieldDefinition.
 */
export const required = (message: string = 'Field is required'): Rule<any> => {
  return (val: any): Success<any> | Failure => {
    const isPresent = val !== null && val !== undefined && (typeof val === 'string' ? val.trim() !== '' : true);
    if (isPresent) {
      return { value: val } as Success<any>;
    }
    return { 
      error: { code: 'required', message } 
    } as Failure;
  };
};
