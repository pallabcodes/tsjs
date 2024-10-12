// Observer interface
interface Observer {
  update(message: string): void;
}

// Subject class that maintains a list of observers
class Subject {
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notifyObservers(message: string): void {
    this.observers.forEach(observer => observer.update(message));
  }
}

// Concrete observer
class ConcreteObserver implements Observer {
  constructor(private name: string) {}

  update(message: string): void {
    console.log(`${this.name} received message: ${message}`);
  }
}

// Usage
const subject = new Subject();
const observer1 = new ConcreteObserver('Observer 1');
const observer2 = new ConcreteObserver('Observer 2');

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notifyObservers('Hello Observers!');
// Output:
// Observer 1 received message: Hello Observers!
// Observer 2 received message: Hello Observers!

// When to use:
// Use this pattern when you want to establish a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
