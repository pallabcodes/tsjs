/**
 * Problem: You need to evaluate a mathematical expression in postfix notation (Reverse Polish Notation).

Solution:

Use a stack to store operands and apply operators when encountered.
 * 
 * 
*/

function evaluatePostfix(expression: string): number {
  const stack: number[] = [];

  for (const char of expression) {
    if (/\d/.test(char)) {
      stack.push(Number(char));
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      if (char === '+') stack.push(a + b);
      else if (char === '-') stack.push(a - b);
      else if (char === '*') stack.push(a * b);
      else if (char === '/') stack.push(a / b);
    }
  }

  return stack.pop()!;
}

console.log(evaluatePostfix("23*5+")); // 11 (2 * 3 + 5)

// Explanation:

// We push operands onto the stack, and when an operator is encountered, we pop the operands off the stack and apply the operator.