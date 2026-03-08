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
export type QueryMiddleware<TResult = unknown> = (
    params: QueryParams,
    next: () => Promise<TResult>
) => Promise<TResult>;

export interface QueryParams {
    sql: SQL;
    method: 'select' | 'insert' | 'update' | 'delete';
}

/**
 * 2. The Middleware Orchestrator
 * 
 * This is the internal engine that runs the chain of middlewares.
 */
export class MiddlewareManager {
    private middlewares: QueryMiddleware[] = [];

    use(mw: QueryMiddleware) {
        this.middlewares.push(mw);
    }

    /**
     * The core "Composer" logic (standard middleware pattern)
     */
    async run<T>(params: QueryParams, finalAction: () => Promise<T>): Promise<T> {
        let index = -1;

        const dispatch = async (i: number): Promise<any> => {
            if (i <= index) throw new Error('next() called multiple times');
            index = i;
            
            const fn = i === this.middlewares.length ? finalAction : this.middlewares[i];
            
            return fn(params, () => dispatch(i + 1));
        };

        return dispatch(0);
    }
}

/**
 * 3. Usage Example: Type-Safe Logger Middleware
 */
const loggerMiddleware: QueryMiddleware = async (params, next) => {
    const start = Date.now();
    console.log(`Executing ${params.method}...`);
    
    const result = await next(); // Proceed to next middleware or DB
    
    console.log(`Finished in ${Date.now() - start}ms`);
    return result;
};

// Orchestration
const manager = new MiddlewareManager();
manager.use(loggerMiddleware);

// Simulating a query execution
// manager.run({ method: 'select', sql: {} as any }, async () => {
//    return [{ id: 1 }];
// });

console.log('Drizzle Middleware pattern deconstructed');
