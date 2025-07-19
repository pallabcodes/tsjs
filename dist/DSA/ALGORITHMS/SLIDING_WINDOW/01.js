"use strict";
// Given an array of numbers, find the length of the shortest contiguous subarray that contains every distinct number from the array at least once
const input = [1, 2, 2, 3, 1, 4, 2, 3];
// Distinct numbers in the input array = [1, 2, 3, 4]
function shortestSubarrayWithAllUniques(arr) {
    const uniqueSet = new Set(arr);
    const required = uniqueSet.size;
    const countMap = new Map();
    let left = 0;
    let minLen = Infinity;
    let uniqueInWindow = 0;
    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        countMap.set(num, (countMap.get(num) || 0) + 1);
        if (countMap.get(num) === 1) {
            uniqueInWindow++;
        }
        while (uniqueInWindow === required) {
            minLen = Math.min(minLen, right - left + 1);
            const leftNum = arr[left];
            countMap.set(leftNum, countMap.get(leftNum) - 1);
            if (countMap.get(leftNum) === 0) {
                uniqueInWindow--;
            }
            left++;
        }
    }
    return minLen === Infinity ? 0 : minLen;
}
console.log(shortestSubarrayWithAllUniques(input)); // Output: 4
//# sourceMappingURL=01.js.map