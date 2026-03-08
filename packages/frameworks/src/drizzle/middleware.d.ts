/**
 * Deconstructing Drizzle ORM's Middleware & Interceptor Pattern
 *
 * Middleware in Drizzle allows you to "hook" into the query execution lifecycle.
 * This is how Drizzle implements things like logging or custom auditing.
 */
import { SQL } from "./expressions";
/**
 * 1. The Middleware Definition
 *
 * A middleware is a function that takes the current "Query Object"
 * and a "Next" function.
 */
export type QueryMiddleware<TResult = unknown> = (params: QueryParams, next: () => Promise<TResult>) => Promise<TResult>;
export interface QueryParams {
    sql: SQL;
    method: 'select' | 'insert' | 'update' | 'delete';
}
/**
 * 2. The Middleware Orchestrator
 *
 * This is the internal engine that runs the chain of middlewares.
 */
export declare class MiddlewareManager {
    private middlewares;
    use(mw: QueryMiddleware): void;
    /**
     * The core "Composer" logic (standard middleware pattern)
     */
    run<T>(params: QueryParams, finalAction: () => Promise<T>): Promise<T>;
}
