// Tail Call Optimization: ensures that recursive calls do not add a new stack frame.

function tailRecursiveFactorial(n: number, accumulator: number = 1): number {
    if (n === 0) return accumulator;
    return tailRecursiveFactorial(n - 1, n * accumulator);
}

const optimizedResult = tailRecursiveFactorial(5); // result is 120
