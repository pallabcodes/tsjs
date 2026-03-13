/**
 * Deconstructing Drizzle ORM's Core Utility Types
 *
 * These are the building blocks that enable complex inference and
 * readable type errors in the library.
 */
/**
 * 1. Simplify (also known as Prettify)
 *
 * Flattens intersection types like { id: number } & { name: string }
 * into a single object type { id: number; name: string }.
 * This is CRITICAL for hover-state readability in VS Code.
 */
export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};
/**
 * 2. Assume
 *
 * Force a type to be treated as another type.
 * Used internally when the TS compiler can't prove a constraint
 * that we know is true.
 */
export type Assume<T, U> = T extends U ? T : U;
/**
 * 3. IsUnion
 *
 * A ingenious trick to detect if a type is a union.
 * It works by comparing the type against itself in a distributive way.
 */
export type IsUnion<T, U extends T = T> = (T extends any ? (U extends T ? false : true) : never) extends false ? false : true;
/**
 * 4. DrizzleTypeError
 *
 * How Drizzle returns readable errors in the type system.
 * It uses a branded interface that "leaks" the error message into the type name.
 */
export interface DrizzleTypeError<T extends string> {
    $drizzleTypeError: T;
}
/**
 * 5. Equal
 *
 * The gold standard for checking if two types are strictly identical.
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
/**
 * 6. Not
 */
export type Not<T extends boolean> = T extends true ? false : true;
/**
 * 7. FromSingleKeyObject / SingleKeyObject
 *
 * Used to ensure an object (like a selection) has exactly one key.
 */
export type IsNever<T> = [T] extends [never] ? true : false;
export type FromSingleKeyObject<T, Result, TError extends string, K = keyof T> = IsNever<K> extends true ? never : IsUnion<K> extends true ? DrizzleTypeError<TError> : Result;
