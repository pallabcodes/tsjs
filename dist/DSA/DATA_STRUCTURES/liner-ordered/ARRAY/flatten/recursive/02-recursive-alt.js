"use strict";
function flattenHelper(arr, processed = []) {
    for (const val of arr) {
        if (Array.isArray(val)) {
            flattenHelper(val, processed);
        }
        else {
            processed.push(val);
        }
    }
    return processed;
}
// Wrapper for API consistency
function flattenAlt(arr) {
    return flattenHelper(arr, []);
}
console.log(flattenAlt([1, [2, [3, 4], 5], 6])); // Output: [1, 2, 3, 4, 5, 6]
// export default flattenAlt;
//# sourceMappingURL=02-recursive-alt.js.map