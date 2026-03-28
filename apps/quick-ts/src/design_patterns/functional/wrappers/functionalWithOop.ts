// 1. Logging / Side Effects — Strategy Pattern
interface LogStrategy {
  log(message: string): void;
}

class ConsoleLogStrategy implements LogStrategy {
  log(message: string): void {
    console.log('Log:', message);
  }
}

class FunctionLogger {
  constructor(private logStrategy: LogStrategy) {}

  execute(func: (...args: any[]) => any, ...args: any[]): any {
    // Use specific function type
    this.logStrategy.log(`Calling function with args: ${JSON.stringify(args)}`);
    return func(...args);
  }
}

// Usage
const logger = new FunctionLogger(new ConsoleLogStrategy());
const add = (a: number, b: number) => a + b;
logger.execute(add, 2, 3); // Logs the arguments before calling the function

// 2. Memoization — Flyweight Pattern
class Memoizer {
  private cache: Map<string, any> = new Map();

  execute(func: (...args: any[]) => any, ...args: any[]): any {
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
const addMemo = (a: number, b: number) => a + b;
console.log(memoizer.execute(addMemo, 1, 2)); // First call: calculates
console.log(memoizer.execute(addMemo, 1, 2)); // Second call: returns cached result

// 3. Delay Execution / Throttling — Command Pattern
interface Command {
  execute(): void;
}

class DelayedCommand implements Command {
  constructor(private func: (...args: any[]) => void, private args: any[], private delay: number) {}

  execute(): void {
    setTimeout(() => {
      this.func(...this.args);
    }, this.delay);
  }
}

// Usage
const delayedAdd = new DelayedCommand(
  (a: number, b: number) => {
    console.log(a + b);
  },
  [1, 2],
  1000
);
delayedAdd.execute(); // Will call the function after 1 second

// 4. Retry on Failure — Template Method Pattern
abstract class RetryOperation {
  abstract doOperation(...args: any[]): any;

  executeWithRetry(retries: number, ...args: any[]): any {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return this.doOperation(...args);
      } catch (error) {
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
  doOperation(a: number, b: number): number {
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
function timeDecorator<T extends (...args: any[]) => any>(func: T): T {
  return function (...args: any[]): any {
    const start = Date.now();
    const result = func(...args);
    const end = Date.now();
    console.log(`Execution time: ${end - start}ms`);
    return result;
  } as T;
}

// Usage
const timedAdd = timeDecorator((a: number, b: number) => a + b);
timedAdd(5, 6); // Will log the execution time

// 6. Throttling — Adapter Pattern
class ThrottleAdapter {
  private lastCall = 0;

  constructor(private func: (...args: any[]) => any, private limit: number) {}

  execute(...args: any[]): any {
    const now = Date.now();
    if (now - this.lastCall >= this.limit) {
      this.lastCall = now;
      return this.func(...args);
    }
    console.log('Function call throttled');
  }
}

// Usage
const throttledAdd = new ThrottleAdapter((a: number, b: number) => a + b, 2000);
throttledAdd.execute(1, 2); // Will execute
throttledAdd.execute(3, 4); // Will be throttled

// 7. Transactional — State Pattern
interface TransactionState {
  start(): void;
  commit(): void;
  rollback(): void;
}

class Transaction {
  private state: TransactionState;

  constructor() {
    this.state = new StartedState(this);
  }

  setState(state: TransactionState) {
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

class StartedState implements TransactionState {
  constructor(private transaction: Transaction) {}

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

class CommittedState implements TransactionState {
  constructor(private transaction: Transaction) {}

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

class RolledBackState implements TransactionState {
  constructor(private transaction: Transaction) {}

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
