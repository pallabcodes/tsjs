// State interface
interface State {
  handle(context: Context): void;
}

// Context class that holds a reference to a State instance
class Context {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  setState(state: State): void {
    this.state = state;
  }

  request(): void {
    this.state.handle(this); // Delegate to the current state
  }
}

// Concrete states
class ConcreteStateA implements State {
  handle(context: Context): void {
    console.log('Handling request in State A');
    context.setState(new ConcreteStateB()); // Switch to State B
  }
}

class ConcreteStateB implements State {
  handle(context: Context): void {
    console.log('Handling request in State B');
    context.setState(new ConcreteStateA()); // Switch back to State A
  }
}

// Usage
const context = new Context(new ConcreteStateA());
context.request(); // Output: Handling request in State A
context.request(); // Output: Handling request in State B

// When to use:
// Use this pattern when an object should change its behavior when its internal state changes.
