"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenStackThenQueue = flattenStackThenQueue;
/**
 * Flattens a nested array using a stack first (depth-first), then a queue.
 * This demonstrates the stack-then-queue approach.
 *
 * Note: This approach will produce a depth-first (preorder) flattening,
 * but the queue phase can be used to further process or reorder the output if needed.
 *
 * @param input The nested array to flatten
 * @returns The flattened array (depth-first order)
 */
function flattenStackThenQueue(input) {
    // Step 1: Depth-first traversal using a stack
    const stack = [...input].reverse(); // Stack: process leftmost first
    const temp = []; // Temporarily holds non-array elements in DFS order
    while (stack.length > 0) {
        const elem = stack.pop(); // Pop from end (LIFO)
        if (Array.isArray(elem)) {
            // If it's an array, push its elements onto the stack in reverse order
            // so that the leftmost element is processed first
            stack.push(...elem.slice().reverse());
        }
        else {
            // Otherwise, collect the value
            temp.push(elem);
        }
    }
    // Step 2: Use a queue to process the result (optional, for demonstration)
    // Here, we simply dequeue all elements to preserve order (no change)
    const queue = [...temp];
    const result = [];
    while (queue.length > 0) {
        result.push(queue.shift());
    }
    return result;
}
// Example usage:
const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenStackThenQueue(nested)); // [1, 2, 3, 4, 5, 6, 7]
/**
 * Note:
 * This approach produces a depth-first flatten (strict left-to-right order).
 * The queue phase here is illustrative; it doesn't change the order,
 * but could be used for further processing if needed.
 * If you want a strict left-to-right depth-first flattening,
 */
//# sourceMappingURL=03-flatten.js.map