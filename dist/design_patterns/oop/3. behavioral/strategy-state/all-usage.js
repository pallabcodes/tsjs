"use strict";
// ### Hybrid Strategy + State Pattern Use Cases
class ConcreteStrategyA {
    execute() {
        console.log('Executing Strategy A');
    }
}
class ConcreteStrategyB {
    execute() {
        console.log('Executing Strategy B');
    }
}
class ConcreteStateA {
    handleState(context) {
        console.log('Handling state A');
        context.setStrategy(new ConcreteStrategyA());
    }
}
class ConcreteStateB {
    handleState(context) {
        console.log('Handling state B');
        context.setStrategy(new ConcreteStrategyB());
    }
}
class Context {
    constructor(state) {
        this.state = state;
        this.strategy = new ConcreteStrategyA(); // Default strategy
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    setState(state) {
        this.state = state;
    }
    applyStrategy() {
        this.strategy.execute();
    }
    applyState() {
        this.state.handleState(this);
    }
}
// Usage example
const context = new Context(new ConcreteStateA());
context.applyState(); // Handling state A
context.applyStrategy(); // Executing Strategy A
context.setState(new ConcreteStateB());
context.applyState(); // Handling state B
context.applyStrategy(); // Executing Strategy B
//# sourceMappingURL=all-usage.js.map