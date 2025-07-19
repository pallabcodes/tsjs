"use strict";
// Index class to store the state
class Index {
    constructor(state) {
        this.state = state;
    }
    getState() {
        return this.state;
    }
}
// Originator class whose state will be saved
class Originator {
    constructor() {
        this.state = '';
    }
    setState(state) {
        this.state = state;
        console.log(`State set to: ${this.state}`);
    }
    saveState() {
        return new Index(this.state); // Save state in a memento
    }
    restoreState(memento) {
        this.state = memento.getState(); // Restore state from memento
        console.log(`State restored to: ${this.state}`);
    }
}
// Caretaker class to manage memento objects
class Caretaker {
    constructor() {
        this.mementos = [];
    }
    addMemento(memento) {
        this.mementos.push(memento);
    }
    getMemento(index) {
        const memento = this.mementos[index];
        if (!memento)
            throw new Error('Memento not found');
        return memento;
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
//# sourceMappingURL=index.js.map