// Using map and reduce for transforming and aggregating data.

const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8, 10]

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0); // sum is 15

// The fold function reduces a collection to a single value.
function fold<T, U>(array: T[], fn: (acc: U, val: T) => U, initialValue: U): U {
    return array.reduce(fn, initialValue);
}

// Usage
const total = fold(numbers, (acc, n) => acc + n, 0); // total is 15
