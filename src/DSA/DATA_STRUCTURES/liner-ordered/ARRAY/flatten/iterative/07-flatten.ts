/**
 * Flattens a deeply nested array using a manual index stack (pointer stack).
 * No recursion, no ES6 methods (no forEach, map, flat, etc).
 * Preserves strict left-to-right order.
 *
 * @param input The nested array to flatten
 * @returns The flattened array
 */
export function flattenPointerStack(input: unknown[]): unknown[] {
    // Each stack frame: { arr: current array, idx: current index }
    const stack: { arr: unknown[]; idx: number }[] = [];
    const result: unknown[] = [];

    // Start with the input array at index 0
    stack.push({ arr: input, idx: 0 });

    while (stack.length > 0) {
        // Look at the top of the stack
        const frame = stack[stack.length - 1];

        if (frame.idx >= frame.arr.length) {
            // Finished this array, pop the stack
            stack.pop();
            continue;
        }

        const elem = frame.arr[frame.idx];
        frame.idx += 1;

        if (Array.isArray(elem)) {
            // Found a nested array, push it onto the stack to process
            stack.push({ arr: elem, idx: 0 });
        } else {
            // Found a value, add to result
            result.push(elem);
        }
    }

    return result;
}

// Example usage:
const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenPointerStack(nested)); // [1, 2, 3, 4, 5, 6, 7]
console.log(flattenPointerStack([])); // []
console.log(flattenPointerStack([1, 2, 3])); // [1, 2, 3]
console.log(flattenPointerStack([1, [2, 3], 4])); // [1, 2, 3, 4]
console.log(flattenPointerStack([1, [2, [3]], 4])); // [1, 2, 3, 4]