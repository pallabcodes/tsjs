"use strict";
// Function Composition : allows you to combine multiple functions into one.
// Type-safe functions
const double = (x) => x * 2;
const increment = (x) => x + 1;
// Type-safe compose function
const compose = (f, g) => (x) => f(g(x));
const doubleThenIncrement = compose(increment, double);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const result = doubleThenIncrement(5); // result is 11
//# sourceMappingURL=composition.js.map