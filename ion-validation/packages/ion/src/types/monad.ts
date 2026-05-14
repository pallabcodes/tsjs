/**
 * @foculist/ion: Monadic Result Types
 * This module defines the atomic, branded result types that power Ion's validation logic.
 * These types are nominally branded with unique symbols to prevent type forgery.
 */

declare const __brand: unique symbol;

export type Brand<T, TBrand> = T & { [__brand]: TBrand };

/**
 * IonError: The structured diagnostic object.
 */
export type IonError = {
  readonly code: string;
  readonly message: string;
  readonly params?: Record<string, unknown>;
};

/**
 * Success/Failure Brands
 */
export type SuccessBrand = unique symbol;
export type FailureBrand = unique symbol;

/**
 * Success: A nominally branded successful validation result.
 */
export type Success<T> = Brand<{
  readonly value: T;
}, SuccessBrand>;

/**
 * Failure: A nominally branded failed validation result.
 */
export type Failure = Brand<{
  readonly error: IonError;
}, FailureBrand>;

/**
 * Result: The synchronous monad representing either success or failure.
 */
export type Result<T> = Success<T> | Failure;

/**
 * AsyncResult: The asynchronous representation of a validation result.
 */
export type AsyncResult<T> = Promise<Result<T>>;

/**
 * Type Guards (Nominal Branding Verification)
 */
export function isSuccess<T>(result: Result<T>): result is Success<T> {
  return 'value' in result && !('error' in result);
}

export function isFailure<T>(result: Result<T>): result is Failure {
  return 'error' in result;
}
