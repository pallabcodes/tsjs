/**
 * Problem: Check if an expression has balanced parentheses (brackets).

Solution:

Use a stack to push open brackets (, {, [ and pop when a closing bracket ), }, ] is found.
 * 
*/
function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: { [key: string]: string } = { '(': ')', '{': '}', '[': ']' };

  for (const char of s) {
    if (map[char]) {
      stack.push(char); // Push opening brackets
    } else {
      const top = stack.pop();
      if (top === undefined || map[top] !== char) return false; // Check if matching
    }
  }

  return stack.length === 0; // If empty, all brackets matched
}

console.log(isValid("()[]{}")); // true
console.log(isValid("([)]")); // false

/**
 * Explanation:
 * We use a stack to match opening and closing parentheses.
*/