"use strict";
/**
 * Deconstructing Drizzle ORM's Middleware & Interceptor Pattern
 *
 * Middleware in Drizzle allows you to "hook" into the query execution lifecycle.
 * This is how Drizzle implements things like logging or custom auditing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareManager = void 0;
/**
 * 2. The Middleware Orchestrator
 *
 * This is the internal engine that runs the chain of middlewares.
 */
class MiddlewareManager {
    middlewares = [];
    use(mw) {
        this.middlewares.push(mw);
    }
    /**
     * The core "Composer" logic (standard middleware pattern)
     */
    async run(params, finalAction) {
        let index = -1;
        const dispatch = async (i) => {
            if (i <= index)
                throw new Error('next() called multiple times');
            index = i;
            const fn = i === this.middlewares.length ? finalAction : this.middlewares[i];
            return fn(params, () => dispatch(i + 1));
        };
        return dispatch(0);
    }
}
exports.MiddlewareManager = MiddlewareManager;
/**
 * 3. Usage Example: Type-Safe Logger Middleware
 */
const loggerMiddleware = async (params, next) => {
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
//# sourceMappingURL=middleware.js.map