// currying: transforms a function that takes multiple arguments into a sequence of functions.
const add = (a: number) => (b: number) => a + b;

const addFive = add(5);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const curriedResult = addFive(10); // result is 15
