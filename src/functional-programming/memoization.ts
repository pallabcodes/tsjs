const multiplyBy10 = (num: number) => num * 10;
type Multi = ReturnType<typeof multiplyBy10>;

const add3 = (num1: number, num2: number, num3: number) => num1 + num2 + num3;
const addMany = (...args: any[]) => args.reduce((acc, num) => acc + num);

const memoize = (fn: Function): Function => {
  const cache: Record<string, any> = {};
  return (...args: any[]) => {
    if (args.toString() in cache) {
      console.log(cache);
      return cache[args.toString()];
    }
    const result = fn(...args);
    cache[args.toString()] = result;
    return result;
  };
};

const memoizeMultiplyBy10 = (): Function => {
  const cache: Record<string, Multi> = {};
  return (num: number) => {
    if (num in cache) {
      console.log(cache);
      return cache[num];
    }
    const result = num * 10;
    cache[num] = result;
    console.log(result);
    console.log(cache);
    return result;
  };
};

const memoized = memoizeMultiplyBy10();
console.log(memoized(10));

const memoizedMultiBy10 = memoize(multiplyBy10);
console.log(memoizedMultiBy10(11));
console.log(memoizedMultiBy10(111));
console.log(memoizedMultiBy10(150));
console.log(memoizedMultiBy10(140));

const memoizedAdd3 = memoize(add3);
console.log(memoizedAdd3(120, 120, 480));

const memoizedAddmany = memoize(addMany);
console.log(memoizedAddmany(120, 120, 481, 151));

// memoized fibonacci
const fib = (pos: number): number => {
  if (pos < 2) return pos;
  return fib(pos - 1) + fib(pos - 2);
}

const memoizedFib = memoize(fib);
console.log(memoizedFib(40), fib(40));

