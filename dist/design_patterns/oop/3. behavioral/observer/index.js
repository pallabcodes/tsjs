"use strict";
// Subject class that maintains a list of observers
class Subject {
    constructor() {
        this.observers = [];
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notifyObservers(message) {
        this.observers.forEach(observer => observer.update(message));
    }
}
// Concrete observer
class ConcreteObserver {
    constructor(name) {
        this.name = name;
    }
    update(message) {
        console.log(`${this.name} received message: ${message}`);
    }
}
// Usage
const subject = new Subject();
const observer1 = new ConcreteObserver('Index 1');
const observer2 = new ConcreteObserver('Index 2');
subject.addObserver(observer1);
subject.addObserver(observer2);
subject.notifyObservers('Hello Observers!');
// Output:
// Index 1 received message: Hello Observers!
// Index 2 received message: Hello Observers!
// When to use:
// Use this pattern when you want to establish a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
//# sourceMappingURL=index.js.map