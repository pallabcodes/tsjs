"use strict";
// ### Hybrid Observer + Mediator Pattern Use Cases
//
// The **Observer Pattern** allows one object to notify other dependent objects about changes.
// The **Mediator Pattern** centralizes communication between objects, reducing direct dependencies.
//
// Combining both patterns allows managing complex interactions between many objects while reducing coupling by centralizing the communication logic.
class ConcreteObserver {
    constructor(name) {
        this.name = name;
    }
    update(state) {
        console.log(`${this.name} received state change: ${state}`);
    }
}
class Mediator {
    constructor() {
        this.observers = [];
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    notifyObservers(state) {
        this.observers.forEach(observer => observer.update(state));
    }
    sendMessage(message) {
        console.log(`Mediator sending message: ${message}`);
        this.notifyObservers(message);
    }
}
// Usage example
const mediator = new Mediator();
const observer1 = new ConcreteObserver('Observer 1');
const observer2 = new ConcreteObserver('Observer 2');
mediator.addObserver(observer1);
mediator.addObserver(observer2);
mediator.sendMessage('Hello, World!'); // Both observers get notified
//# sourceMappingURL=all-usage.js.map