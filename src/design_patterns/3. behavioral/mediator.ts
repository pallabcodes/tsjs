// Mediator interface
interface Mediator {
  notify(sender: object, event: string): void;
}

// Concrete mediator to handle communication between components
class ConcreteMediator implements Mediator {
  private componentA: ComponentA;
  private componentB: ComponentB;

  setComponentA(component: ComponentA) {
    this.componentA = component;
  }

  setComponentB(component: ComponentB) {
    this.componentB = component;
  }

  notify(sender: object, event: string): void {
    if (event === 'A') {
      console.log('Mediator reacting to A');
      this.componentB.doSomething();
    } else if (event === 'B') {
      console.log('Mediator reacting to B');
      this.componentA.doSomething();
    }
  }
}

// Component A
class ComponentA {
  constructor(private mediator: Mediator) {}

  doSomething(): void {
    console.log('Component A does something');
    this.mediator.notify(this, 'A'); // Notify mediator
  }
}

// Component B
class ComponentB {
  constructor(private mediator: Mediator) {}

  doSomething(): void {
    console.log('Component B does something');
    this.mediator.notify(this, 'B'); // Notify mediator
  }
}

// Usage
const mediator = new ConcreteMediator();
const componentA = new ComponentA(mediator);
const componentB = new ComponentB(mediator);

mediator.setComponentA(componentA);
mediator.setComponentB(componentB);

componentA.doSomething(); // Output: Component A does something, Mediator reacting to A, Component B does something
componentB.doSomething(); // Output: Component B does something, Mediator reacting to B, Component A does something

// When to use:
// Use this pattern when you want to reduce the dependencies between communicating classes and centralize the communication logic.
