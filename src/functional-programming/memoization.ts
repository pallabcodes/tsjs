// Function to multiply by 10
const multiplyBy10 = (num: number): number => num * 10;

// Types
type Multi = ReturnType<typeof multiplyBy10>;

// Function to add three numbers
const add3 = (num1: number, num2: number, num3: number): number => num1 + num2 + num3;

// Function to add many numbers
const addMany = (...args: number[]): number => args.reduce((acc, num) => acc + num, 0);

// Memoization function
const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache: Record<string, ReturnType<T>> = {};
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args); // More robust keying
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  }) as T; // Casting to T for type safety
};

// Memoized specific multiplication function
const memoizeMultiplyBy10 = (): ((num: number) => Multi) => {
  const cache: Record<number, Multi> = {};
  return (num: number): Multi => {
    if (cache.hasOwnProperty(num)) { // More explicit check
      return cache[num];
    }
    const result = multiplyBy10(num); // Call the original function
    cache[num] = result;
    return result;
  };
};

// Usage
const memoizedMultiplyBy10 = memoizeMultiplyBy10();
console.log(memoizedMultiplyBy10(10)); // 100

const memoizedMultiplyBy10General = memoize(multiplyBy10);
console.log(memoizedMultiplyBy10General(11)); // 110
console.log(memoizedMultiplyBy10General(11)); // Cached result

const memoizedAdd3 = memoize(add3);
console.log(memoizedAdd3(120, 120, 480)); // 720

const memoizedAddMany = memoize(addMany);
console.log(memoizedAddMany(120, 120, 481, 151)); // 872

// Memoized Fibonacci
const fib = (pos: number): number => {
  if (pos < 2) return pos;
  return fib(pos - 1) + fib(pos - 2);
};

const memoizedFib = memoize(fib);
console.log(memoizedFib(40)); // 102334155
console.log(fib(40)); // 102334155
