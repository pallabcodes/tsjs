/**
 * @foculist/ion Result Type: The core ADT for validation.
 */
export type Success<T> = {
  tag: 'success';
  value: T;
};

export type Failure = {
  tag: 'failure';
  error: string;
};

export type Result<T> = Success<T> | Failure;

/**
 * Async Result: A Promise that resolves to a Result.
 */
export type AsyncResult<T> = Promise<Result<T>>;
