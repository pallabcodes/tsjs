"use strict";
// Context class that holds a reference to a Index instance
class Context {
    constructor(state) {
        this.state = state;
    }
    setState(state) {
        this.state = state;
    }
    request() {
        this.state.handle(this); // Delegate to the current state
    }
}
// Concrete states
class ConcreteStateA {
    handle(context) {
        console.log('Handling request in Index A');
        context.setState(new ConcreteStateB()); // Switch to Index B
    }
}
class ConcreteStateB {
    handle(context) {
        console.log('Handling request in Index B');
        context.setState(new ConcreteStateA()); // Switch back to Index A
    }
}
// Usage
const context = new Context(new ConcreteStateA());
context.request(); // Output: Handling request in Index A
context.request(); // Output: Handling request in Index B
// When to use:
// Use this pattern when an object should change its behavior when its internal state changes.
//# sourceMappingURL=index.js.map