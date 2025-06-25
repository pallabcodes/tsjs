interface FlattenStackEntry {
    arr: unknown[];
    idx: number;
}


/**
 * Flattens an arbitrarily nested array (of any depth) into a single-level array.
 * No recursion is used; only iterative structures (stack).
 * Order is preserved (left-to-right).
 *
 * @param input The nested array to flatten
 * @returns The flattened array
 */
export function flattenIterative(input: unknown[]): unknown[] {
    // Result array to collect flattened elements
    const result: unknown[] = [];
    
    // Stack to keep track of arrays/elements to process each stack entry is a pair: [current array, current index]
    const stack: Array<FlattenStackEntry> = [];

    // Start with the input array and index 0
    stack.push({ arr: input, idx: 0 });

    // Process until the stack is empty
    while (stack.length > 0) {
        // Look at the top of the stack
        const top = stack[stack.length - 1];

        // If we've processed all elements in this array, pop and continue
        if (top.idx >= top.arr.length) {
            stack.pop();
            continue;
        }

        // Get the current element and advance the index
        const elem = top.arr[top.idx];
        top.idx += 1;

        // If the element is an array, push it onto the stack to process its elements
        if (Array.isArray(elem)) {
            stack.push({ arr: elem, idx: 0 });
        } else {
            // Otherwise, add the element to the result
            result.push(elem);
        }
    }

    return result;
}



// Example input and expected output:
const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenIterative(nested)); // [1, 2, 3, 4, 5, 6, 7]

