"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenInPlace = flattenInPlace;
/**
 * Flattens a deeply nested array in-place using classic loops and splice.
 * No recursion, no ES6 methods (no forEach, map, flat, etc).
 * Mutates the input array. Preserves strict left-to-right order.
 *
 * @param arr The nested array to flatten (will be mutated)
 * @returns The same array, now flat
 */
function flattenInPlace(arr) {
    let i = 0;
    while (i < arr.length) {
        if (Array.isArray(arr[i])) {
            // Remove the nested array and insert its elements at the same position
            const nested = arr[i];
            // Remove the array at i
            arr.splice(i, 1);
            // Insert its elements at i (if any)
            if (nested.length > 0) {
                // Insert all elements of nested at position i
                for (let j = nested.length - 1; j >= 0; j--) {
                    arr.splice(i, 0, nested[j]);
                }
            }
            // Do not increment i, since new elements are now at i
        }
        else {
            i++;
        }
    }
    return arr;
}
// Example usage:
const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenInPlace(nested)); // [1, 2, 3, 4, 5, 6, 7]
console.log(flattenInPlace([])); // []
console.log(flattenInPlace([1, 2, 3])); // [1, 2, 3]
console.log(flattenInPlace([1, [2, 3], 4])); // [1, 2, 3, 4]
console.log(flattenInPlace([1, [2, [3]], 4])); // [1, 2, 3, 4]
//# sourceMappingURL=08-flatten.js.map