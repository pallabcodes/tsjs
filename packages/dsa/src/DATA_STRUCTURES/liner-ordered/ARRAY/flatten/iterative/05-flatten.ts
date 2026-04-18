/**
 * Flattens a deeply nested array using a manual index stack (pointer stack).
 * No recursion, no ES6 methods (no forEach, map, flat, etc).
 * Preserves strict left-to-right order.
 *
 * @param input The nested array to flatten
 * @returns The flattened array
 */
export function flattenManualIndexStack(input: unknown[]): unknown[] {
    // Define the type for each stack frame
    type Frame = { arr: unknown[]; idx: number };

    // Each stack frame: { arr: array to process, idx: current index }
    const stack: Frame[] = [];
    const result: unknown[] = [];

    // Start with the input array and index 0
    stack.push({ arr: input, idx: 0 });

    while (stack.length > 0) {
        let frame = stack[stack.length - 1];

        // If finished with this array, pop and continue
        if (frame.idx >= frame.arr.length) {
            stack.pop();
            continue;
        }

        let elem: unknown = frame.arr[frame.idx];
        frame.idx++;

        if (Object.prototype.toString.call(elem) === '[object Array]') {
            // Push new frame for the nested array
            stack.push({ arr: elem as unknown[], idx: 0 });
        } else {
            result.push(elem);
        }
    }

    return result;
}


// Example usage:


var nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenManualIndexStack(nested)); // [1, 2, 3, 4, 5, 6, 7]