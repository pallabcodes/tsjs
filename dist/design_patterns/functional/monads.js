"use strict";
// Monads encapsulate values and allow for chaining operations.
class Maybe {
    constructor(value) {
        this.value = value;
    }
    isNothing() {
        return this.value === undefined;
    }
    map(fn) {
        return this.isNothing() ? new Maybe() : new Maybe(fn(this.value));
    }
    getOrElse(defaultValue) {
        return this.isNothing() ? defaultValue : this.value;
    }
}
// Usage
const maybeValue = new Maybe(5);
const result = maybeValue.map(x => x * 2).getOrElse(0); // result is 10
//# sourceMappingURL=monads.js.map