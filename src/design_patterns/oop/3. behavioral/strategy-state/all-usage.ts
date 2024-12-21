// ### Hybrid Strategy + State Pattern Use Cases

// The **Strategy Pattern** allows an object to change its behavior dynamically by delegating the implementation of specific algorithms to a strategy object.

// The **State Pattern** allows an object to alter its behavior when its internal state changes, without changing the class that is using the state.

// Combining both patterns helps in scenarios where an object needs to dynamically change behavior based on its internal state and context.

interface Strategy {
  execute(): void;
}

class ConcreteStrategyA implements Strategy {
  execute() {
    console.log('Executing Strategy A');
  }
}

class ConcreteStrategyB implements Strategy {
  execute() {
    console.log('Executing Strategy B');
  }
}

interface State {
  handleState(context: Context): void;
}

class ConcreteStateA implements State {
  handleState(context: Context) {
    console.log('Handling state A');
    context.setStrategy(new ConcreteStrategyA());
  }
}

class ConcreteStateB implements State {
  handleState(context: Context) {
    console.log('Handling state B');
    context.setStrategy(new ConcreteStrategyB());
  }
}

class Context {
  private strategy: Strategy;
  private state: State;

  constructor(state: State) {
    this.state = state;
    this.strategy = new ConcreteStrategyA(); // Default strategy
  }

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  setState(state: State) {
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
