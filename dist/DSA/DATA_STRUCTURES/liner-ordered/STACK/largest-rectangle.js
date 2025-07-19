"use strict";
/**
 * Problem: Given a histogram, find the largest rectangle that can be formed from the bars.
 * --------------------------------------------------------
 * Solution:
 * Use a monotonic stack to maintain heights in decreasing order, and calculate the area for each rectangle.
 *
*/
function largestRectangleArea(heights) {
    const stack = [];
    let maxArea = 0;
    for (let i = 0; i <= heights.length; i++) {
        while (stack.length && (i === heights.length || heights[stack[stack.length - 1]] > heights[i])) {
            const height = heights[stack.pop()];
            const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}
console.log(largestRectangleArea([2, 1, 5, 6, 2, 3])); // Output: 10
/**
 * Explanation:
 * A monotonic stack is used to track the bars in non-increasing height order. We calculate the area by popping bars from the stack when a shorter bar is encountered.
*/ 
//# sourceMappingURL=largest-rectangle.js.map