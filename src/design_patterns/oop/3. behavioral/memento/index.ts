// Index class to store the state
class Index {
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

  saveState(): Index {
    return new Index(this.state); // Save state in a memento
  }

  restoreState(memento: Index): void {
    this.state = memento.getState(); // Restore state from memento
    console.log(`State restored to: ${this.state}`);
  }
}

// Caretaker class to manage memento objects
class Caretaker {
  private mementos: Index[] = [];

  addMemento(memento: Index): void {
    this.mementos.push(memento);
  }

  getMemento(index: number): Index {
    return this.mementos[index];
  }
}

// Usage
const originator = new Originator();
const caretaker = new Caretaker();

originator.setState('Index 1');
caretaker.addMemento(originator.saveState());

originator.setState('Index 2');
caretaker.addMemento(originator.saveState());

originator.restoreState(caretaker.getMemento(0)); // Output: Index restored to: Index 1

// When to use:

// Use this pattern when you want to save and restore the previous state of an object without exposing its internal structure.
