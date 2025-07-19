"use strict";
class ConsoleLogStrategy {
    log(message) {
        console.log('Log:', message);
    }
}
class FunctionLogger {
    constructor(logStrategy) {
        this.logStrategy = logStrategy;
    }
    execute(func, ...args) {
        // Use specific function type
        this.logStrategy.log(`Calling function with args: ${JSON.stringify(args)}`);
        return func(...args);
    }
}
// Usage
const logger = new FunctionLogger(new ConsoleLogStrategy());
const add = (a, b) => a + b;
logger.execute(add, 2, 3); // Logs the arguments before calling the function
// 2. Memoization — Flyweight Pattern
class Memoizer {
    constructor() {
        this.cache = new Map();
    }
    execute(func, ...args) {
        const key = JSON.stringify(args);
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        const result = func(...args);
        this.cache.set(key, result);
        return result;
    }
}
// Usage
const memoizer = new Memoizer();
const addMemo = (a, b) => a + b;
console.log(memoizer.execute(addMemo, 1, 2)); // First call: calculates
console.log(memoizer.execute(addMemo, 1, 2)); // Second call: returns cached result
class DelayedCommand {
    constructor(func, args, delay) {
        this.func = func;
        this.args = args;
        this.delay = delay;
    }
    execute() {
        setTimeout(() => {
            this.func(...this.args);
        }, this.delay);
    }
}
// Usage
const delayedAdd = new DelayedCommand((a, b) => {
    console.log(a + b);
}, [1, 2], 1000);
delayedAdd.execute(); // Will call the function after 1 second
// 4. Retry on Failure — Template Method Pattern
class RetryOperation {
    executeWithRetry(retries, ...args) {
        let attempt = 0;
        while (attempt < retries) {
            try {
                return this.doOperation(...args);
            }
            catch (error) {
                attempt++;
                if (attempt >= retries) {
                    throw error;
                }
                console.log(`Retrying... attempt ${attempt}`);
            }
        }
    }
}
class AddWithRetry extends RetryOperation {
    doOperation(a, b) {
        if (Math.random() > 0.5) {
            throw new Error('Random failure');
        }
        return a + b;
    }
}
// Usage
const retryAdd = new AddWithRetry();
console.log(retryAdd.executeWithRetry(3, 2, 3)); // Retries the add operation on failure
// 5. Timing Execution — Decorator Pattern
function timeDecorator(func) {
    return function (...args) {
        const start = Date.now();
        const result = func(...args);
        const end = Date.now();
        console.log(`Execution time: ${end - start}ms`);
        return result;
    };
}
// Usage
const timedAdd = timeDecorator((a, b) => a + b);
timedAdd(5, 6); // Will log the execution time
// 6. Throttling — Adapter Pattern
class ThrottleAdapter {
    constructor(func, limit) {
        this.func = func;
        this.limit = limit;
        this.lastCall = 0;
    }
    execute(...args) {
        const now = Date.now();
        if (now - this.lastCall >= this.limit) {
            this.lastCall = now;
            return this.func(...args);
        }
        console.log('Function call throttled');
    }
}
// Usage
const throttledAdd = new ThrottleAdapter((a, b) => a + b, 2000);
throttledAdd.execute(1, 2); // Will execute
throttledAdd.execute(3, 4); // Will be throttled
class Transaction {
    constructor() {
        this.state = new StartedState(this);
    }
    setState(state) {
        this.state = state;
    }
    start() {
        this.state.start();
    }
    commit() {
        this.state.commit();
    }
    rollback() {
        this.state.rollback();
    }
}
class StartedState {
    constructor(transaction) {
        this.transaction = transaction;
    }
    start() {
        console.log('Transaction started.');
    }
    commit() {
        console.log('Committing transaction...');
        this.transaction.setState(new CommittedState(this.transaction));
    }
    rollback() {
        console.log('Rolling back transaction...');
        this.transaction.setState(new RolledBackState(this.transaction));
    }
}
class CommittedState {
    constructor(transaction) {
        this.transaction = transaction;
    }
    start() {
        console.log('Transaction already committed.');
    }
    commit() {
        console.log('Transaction already committed.');
    }
    rollback() {
        console.log('Cannot rollback, transaction already committed.');
    }
}
class RolledBackState {
    constructor(transaction) {
        this.transaction = transaction;
    }
    start() {
        console.log('Transaction already rolled back.');
    }
    commit() {
        console.log('Cannot commit, transaction already rolled back.');
    }
    rollback() {
        console.log('Transaction already rolled back.');
    }
}
// Usage
const transaction = new Transaction();
transaction.start();
transaction.commit();
transaction.rollback(); // Will show that it can't rollback after commit
//# sourceMappingURL=functionalWithOop.js.map