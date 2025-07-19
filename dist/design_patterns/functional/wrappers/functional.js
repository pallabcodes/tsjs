"use strict";
// A simple function to simulate some operation, such as a function that adds numbers
function add(a, b) {
    return a + b;
}
// Wrapper function that modifies behavior
function wrapFunction(func) {
    // Return a new function that adds extra functionality before calling the original function
    return function (...args) {
        console.log('Function is being called with arguments:', args);
        // Call the original function with the provided arguments
        const result = func(...args);
        // Optionally, modify the result or add extra behavior
        console.log('The result of the function call is:', result);
        // Return the original result from the function call
        return result;
    }; // Type assertion to ensure it returns the same type as the original function
}
// Wrap the 'add' function with the 'wrapFunction' function
const wrappedAdd = wrapFunction(add);
// Call the wrapped function
const result = wrappedAdd(3, 4); // Outputs logs before and after the call
console.log('Final Result:', result); // Outputs the final result: 7
// 2. Different Patterns for Wrapping Functions in TypeScript
// In addition to the simple wrapper pattern shown above, here are other common patterns for wrapping functions in TypeScript, organized by complexity and use cases.
// 1. Simple Wrapper for Logging / Side Effects (as above)
// Use Case: Adding logging, validation, or other side effects without changing the core functionality.
function logWrapper(func) {
    return function (...args) {
        console.log('Calling function with args:', args);
        return func(...args);
    };
}
const logWrappedAdd = logWrapper(add);
logWrappedAdd(2, 3); // Logs arguments before calling the function
// 2. Memoization Wrapper (Caching Results)
// Use Case: Memoization is used to store the result of expensive function calls to improve performance on subsequent calls with the same arguments.
function memoize(func) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args); // Generate a key from the arguments
        if (cache.has(key)) {
            console.log('Returning from cache:', args);
            return cache.get(key);
        }
        const result = func(...args);
        cache.set(key, result);
        return result;
    };
}
const memoizedAdd = memoize(add);
console.log(memoizedAdd(1, 2)); // First call, calculates and stores the result
console.log(memoizedAdd(1, 2)); // Second call, returns cached result
// 3. Timeout/Delay Wrapper (Delaying Execution)
// Use Case: Delay the execution of a function for a certain amount of time, useful for debouncing or rate-limiting functions like search or API calls.
function delayWrapper(func, delay) {
    return function (...args) {
        setTimeout(() => {
            func(...args);
        }, delay);
    };
}
const delayedAdd = delayWrapper(add, 1000);
delayedAdd(3, 4); // Will be called after 1 second
// 4. Retry Wrapper (Automatic Retries on Failure)
// Use Case: Retry a function if it fails, useful for handling temporary network or API errors.
function retryWrapper(func, retries) {
    return function (...args) {
        let attempts = 0;
        const execute = () => {
            try {
                return func(...args);
            }
            catch (error) {
                if (attempts < retries) {
                    attempts++;
                    console.log(`Retrying... attempt ${attempts}`);
                    return execute();
                }
                throw error;
            }
        };
        return execute();
    };
}
const unreliableFunction = (num) => {
    if (Math.random() > 0.5) {
        throw new Error('Temporary failure');
    }
    return num;
};
const retriedFunction = retryWrapper(unreliableFunction, 3);
console.log(retriedFunction(42)); // Will retry on failure
// 5. Function Time Logger (Timing Execution)
// Use Case: Measure and log the time it takes for a function to execute, helpful for performance monitoring.
function timeLogger(func) {
    return function (...args) {
        const start = Date.now();
        const result = func(...args);
        const end = Date.now();
        console.log(`Function took ${end - start}ms`);
        return result;
    };
}
const timedAdd = timeLogger(add);
timedAdd(5, 6); // Logs the time taken for the function to execute
// 6. Throttling Wrapper (Limiting Function Calls)
// Use Case: Limit the frequency of function calls to avoid overwhelming a resource, like preventing too many requests to an API.
function throttleWrapper(func, limit) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func(...args);
        }
        else {
            console.log('Function call throttled.');
        }
    };
}
const throttledAdd = throttleWrapper(add, 2000);
throttledAdd(1, 2); // Will execute
throttledAdd(1, 2); // Will be throttled
// 7. Transactional Wrapper (Atomic Operations)
// Use Case: Ensure that a series of operations are executed atomically, especially for database operations.
function transactionalWrapper(func) {
    return function (...args) {
        console.log('Starting transaction...');
        try {
            const result = func(...args);
            console.log('Committing transaction...');
            return result;
        }
        catch (error) {
            console.log('Rolling back transaction...');
            throw error;
        }
    };
}
const processTransaction = (amount) => {
    if (amount > 1000)
        throw new Error('Amount too large');
    return `Transaction of $${amount} successful`;
};
const transactionalProcess = transactionalWrapper(processTransaction);
console.log(transactionalProcess(500)); // Successful
// console.log(transactionalProcess(2000));  // Will trigger rollback
//# sourceMappingURL=functional.js.map