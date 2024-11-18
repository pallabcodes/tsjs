// Index interface
interface Index {
  handle(context: Context): void;
}

// Context class that holds a reference to a Index instance
class Context {
  private state: Index;

  constructor(state: Index) {
    this.state = state;
  }

  setState(state: Index): void {
    this.state = state;
  }

  request(): void {
    this.state.handle(this); // Delegate to the current state
  }
}

// Concrete states
class ConcreteStateA implements Index {
  handle(context: Context): void {
    console.log('Handling request in Index A');
    context.setState(new ConcreteStateB()); // Switch to Index B
  }
}

class ConcreteStateB implements Index {
  handle(context: Context): void {
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
