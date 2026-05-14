import { Validator, Success } from '../types/monad';

/**
 * transform: Mid-pipeline transformation logic.
 * Primarily used to change the shape or type of data during validation.
 */
export const transform = <In, Out>(fn: (val: In) => Out): Validator<In, Out> => {
  return (val: In): Success<Out> => {
    return { value: fn(val) } as Success<Out>;
  };
};
