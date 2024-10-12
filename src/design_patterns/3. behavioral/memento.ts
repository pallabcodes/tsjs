// Memento class to store the state
class Memento {
  constructor(private state: string) {}

  getState(): string {
    return this.state;
  }
}

// Originator class whose state will be saved
class Originator {
  private state: string;

  setState(state: string): void {
    this.state = state;
    console.log(`State set to: ${this.state}`);
  }

  saveState(): Memento {
    return new Memento(this.state); // Save state in a memento
  }

  restoreState(memento: Memento): void {
    this.state = memento.getState(); // Restore state from memento
    console.log(`State restored to: ${this.state}`);
  }
}

// Caretaker class to manage memento objects
class Caretaker {
  private mementos: Memento[] = [];

  addMemento(memento: Memento): void {
    this.mementos.push(memento);
  }

  getMemento(index: number): Memento {
    return this.mementos[index];
  }
}

// Usage
const originator = new Originator();
const caretaker = new Caretaker();

originator.setState('State 1');
caretaker.addMemento(originator.saveState());

originator.setState('State 2');
caretaker.addMemento(originator.saveState());

originator.restoreState(caretaker.getMemento(0)); // Output: State restored to: State 1

// When to use:

// Use this pattern when you want to save and restore the previous state of an object without exposing its internal structure.
