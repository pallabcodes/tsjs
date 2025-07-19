"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenQueueThenStack = flattenQueueThenStack;
/**
 * Flattens a nested array using a queue first (breadth-first), then a stack.
 * This does NOT guarantee strict left-to-right flattening for deeply nested arrays,
 * but demonstrates the queue-then-stack approach as discussed.
 *
 * @param input The nested array to flatten
 * @returns The flattened array (breadth-first order)
 */
function flattenQueueThenStack(input) {
    // Step 1: Breadth-first traversal using a queue
    const queue = [...input]; // Initialize queue with input elements
    const temp = []; // Temporarily holds non-array elements in BFS order
    while (queue.length > 0) {
        const elem = queue.shift(); // Dequeue from front
        if (Array.isArray(elem)) {
            // If it's an array, enqueue its elements (in order)
            queue.push(...elem);
        }
        else {
            // Otherwise, collect the value
            temp.push(elem);
        }
    }
    // Step 2: Use a stack to reverse the order (optional, for demonstration)
    // This will reverse the BFS order, but is not a true DFS flatten.
    const stack = [...temp];
    const result = [];
    while (stack.length > 0) {
        result.push(stack.pop());
    }
    // If you want the BFS order, return temp; if you want reversed, return result.
    // For demonstration, let's return both:
    return result.reverse(); // To restore the original BFS order
}
// Example usage and test cases:
const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenQueueThenStack(nested)); // [1, 2, 7, 3, 6, 4, 5]
/**
 * Note:
 * This approach produces a breadth-first flatten, not a strict left-to-right depth-first flatten.
 * If you want strict flattening (like [1,2,3,4,5,6,7]), use the stack-only approach from before.
 * This code is for educational purposes to demonstrate queue-then-stack as discussed.
 *
*/ 
//# sourceMappingURL=02-flatten.js.map