"use strict";
// Concrete strategies
class AddStrategy {
    execute(a, b) {
        return a + b;
    }
}
class SubtractStrategy {
    execute(a, b) {
        return a - b;
    }
}
// Context class that uses a strategy
class Context {
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    executeStrategy(a, b) {
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
//# sourceMappingURL=index.js.map