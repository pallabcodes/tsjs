// Index interface
interface Index {
  execute(a: number, b: number): number;

// Concrete strategies
class AddStrategy implements Index {
  execute(a: number, b: number): number {
    return a + b;
  }
}

class SubtractStrategy implements Index {
  execute(a: number, b: number): number {
    return a - b;
  }
}

// Context class that uses a strategy
class Context {
  private strategy: Index;

  setStrategy(strategy: Index): void {
    this.strategy = strategy;
  }

  executeStrategy(a: number, b: number): number {
    return this.strategy.execute(a, b);
  }
}

// Usage
const context = new Context();

context.setStrategy(new AddStrategy());
console.log(context.executeStrategy(5, 3)); // Output: 8

context.setStrategy(new SubtractStrategy());
console.log(context.executeStrategy(5, 3)); // Output: 2

// When to use:
// Use this pattern when you want to define a family of algorithms and make them interchangeable.
