/**
 * Flattens a deeply nested array in-place using a classic while loop and splice.
 * No recursion, no ES6 methods (no forEach, map, flat, etc).
 * Mutates the input array but preserves strict left-to-right order.
 *
 * @param input The nested array to flatten (will be mutated)
 * @returns The flattened array (same as input reference)
 */
export function flattenInPlace(input: unknown[]): unknown[] {
    let i = 0;
    while (i < input.length) {
        if (Array.isArray(input[i])) {
            // Remove the nested array at index i and insert its elements in its place
            // This mutates the original array in-place
            const nested = input.splice(i, 1)[0] as unknown[];
            // Insert all elements of nested at position i
            for (let j = nested.length - 1; j >= 0; j--) {
                input.splice(i, 0, nested[j]);
            }
            // Do not increment i, as we need to check the newly inserted elements
        } else {
            i++;
        }
    }
    return input;
}


// Example usage:

const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenInPlace(nested)); // [1, 2, 3, 4, 5, 6, 7]
console.log(nested === flattenInPlace(nested)); // true, input is mutated in-place
console.log(nested); // [1, 2, 3, 4, 5, 6, 7]
console.log(flattenInPlace([])); // []
console.log(flattenInPlace([1, 2, 3])); // [1, 2, 3]
console.log(flattenInPlace([1, [2, 3], 4])); // [1, 2, 3, 4]
console.log(flattenInPlace([1, [2, [3]], 4])); // [1, 2, 3, 4]
console.log(flattenInPlace([1, [2, [3, [4]]], 5])); // [1, 2, 3, 4, 5]
console.log(flattenInPlace([1, [2, [3, [4, [5]]]], 6])); // [1, 2, 3, 4, 5, 6]
console.log(flattenInPlace([1, [2, [3, [4, [5, [6]]]]], 7])); // [1, 2, 3, 4, 5, 6, 7]
console.log(flattenInPlace([1, [2, [3, [4, [5, [6, [7]]]]]], 8])); // [1, 2, 3, 4, 5, 6, 7, 8]
console.log(flattenInPlace([1, [2, [3, [4, [5, [6, [7, [8]]]]]]], 9])); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(flattenInPlace([1, [2, [3, [4, [5, [6, [7, [8, [9]]]]]]]], 10])); // [1, 2,