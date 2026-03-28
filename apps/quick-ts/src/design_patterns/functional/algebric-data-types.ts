// Algebraic Data Types: combine types using sums and products.

type Result<T> =
  | { success: true; value: T }
  | { success: false; error: string };

function divide(a: number, b: number): Result<number> {
  if (b === 0) return { success: false, error: 'Cannot divide by zero' };
  return { success: true, value: a / b };
}

// Usage
const algebraicResult = divide(10, 2);
if (algebraicResult.success) {
  console.log(algebraicResult.value); // result is 5
} else {
  console.error(algebraicResult.error); // Error handling
}
