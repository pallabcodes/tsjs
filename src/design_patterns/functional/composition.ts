// Function Composition : allows you to combine multiple functions into one.

const double = (x: number) => x * 2;
const increment = (x: number) => x + 1;

const compose = (f: Function, g: Function) => (x: any) => f(g(x));

const doubleThenIncrement = compose(increment, double);

const result = doubleThenIncrement(5); // result is 11
