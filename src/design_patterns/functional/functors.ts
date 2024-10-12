// Functors can be mapped over, allowing transformations.

class Box<T> {
    constructor(public value: T) {}

    map<U>(fn: (value: T) => U): Box<U> {
        return new Box(fn(this.value));
    }
}

// Usage
const box = new Box(3);

const re = box.map(x => x + 1).value; // 4
