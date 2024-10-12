// Higher-Order Functions: are functions that take other functions as arguments or return them.

function higherOrder(fn: (x: number) => number) {
    return (y: number) => fn(y) + 1;
}

const addOne = higherOrder((x) => x); // Returns a function that adds one
const output = addOne(5); // result is 6
