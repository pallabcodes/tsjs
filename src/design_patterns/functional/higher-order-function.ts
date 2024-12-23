// Higher-Order Functions: are functions that take other functions as arguments or return them.

function higherOrder(fn: (x: number) => number) {
  return (y: number) => fn(y) + 1;
}

const addOne = higherOrder(x => x); // Returns a function that adds one
export const output = addOne(5); // result is 6

// Q: write a function to return 2 after a given time of delay and the value should be available to use outside without using global variable

// Solution: Callback type for the result
type Callback = (result: number) => void;

function getTwo(): number {
  return 2;
}

function withDelay(fn: () => number, delay: number, callback: Callback): void {
  setTimeout(() => {
    const result = fn();
    callback(result); // Pass the result to the callback
  }, delay);
}

// Usage
withDelay(getTwo, 1000, result => {
  console.log(`Result from callback: ${result}`); // Logs 2 after 1 second
});

// SOLUTION: State Encapsulation (via Closures)
function withDelayAlt(fn: () => number, delay: number): () => void {
  let result: number;

  setTimeout(() => {
    result = fn();
    console.log(`Result from closure: ${result}`); // Logs 2 after 1 second
  }, delay);

  // Return a function to access the result later (closure)
  return () => result;
}

// Usage
const getResult = withDelayAlt(getTwo, 1000);

// `getResult` can be called later to access the result, but it will still return `undefined` initially
setTimeout(() => {
  const result = getResult();
  console.log('Accessing stored result:', result); // Logs undefined initially, then 2 after 1 second
}, 1500);

//  SOLUTION: Using Promises

function withDelayAlternate(fn: () => number, delay: number): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => {
      const result = fn();
      resolve(result); // Resolve with the result
    }, delay);
  });
}

// Usage
withDelayAlternate(getTwo, 1000).then(result => {
  console.log(`Result from promise: ${result}`); // Logs 2 after 1 second and now it could be used/stored whenever needed
});
