// Lazy evaluation delays the computation of values until they are needed.

function lazyValue<T>(fn: () => T): () => T {
    let cached: T | undefined;
    return () => {
        if (cached === undefined) {
            cached = fn();
        }
        return cached;
    };
}

// Usage
const lazyNum = lazyValue(() => {
    console.log('Computing value...');
    return 42;
});

const result1 = lazyNum(); // Logs 'Computing value...' and returns 42
const result2 = lazyNum(); // Returns cached value 42 without logging
