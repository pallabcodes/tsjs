// Function Composition : allows you to combine multiple functions into one.

// Type-safe functions
const double = (x: number): number => x * 2;
const increment = (x: number): number => x + 1;

// Type-safe compose function
const compose =
  <T>(f: (arg: T) => T, g: (arg: T) => T) =>
  (x: T): T =>
    f(g(x));

const doubleThenIncrement = compose(increment, double);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const result = doubleThenIncrement(5); // result is 11
