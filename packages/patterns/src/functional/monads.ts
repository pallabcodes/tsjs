// Monads encapsulate values and allow for chaining operations.

class Maybe<T> {
    private value?: T;

    constructor(value?: T) {
        this.value = value;
    }

    isNothing(): boolean {
        return this.value === undefined;
    }

    map<U>(fn: (value: T) => U): Maybe<U> {
        return this.isNothing() ? new Maybe<U>() : new Maybe<U>(fn(this.value as T));
    }

    getOrElse(defaultValue: T): T {
        return this.isNothing() ? defaultValue : (this.value as T);
    }
}

// Usage
const maybeValue = new Maybe(5);
const result = maybeValue.map(x => x * 2).getOrElse(0); // result is 10
