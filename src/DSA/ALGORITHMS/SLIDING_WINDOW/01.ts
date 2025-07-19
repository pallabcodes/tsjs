/**
 * Sliding Window Technique
 * ------------------------
 * The sliding window technique is a powerful approach for solving problems involving contiguous subarrays, substrings, or paths.
 *
 * How:
 * - Maintains a window (range of indices or nodes) that slides over the data structure (array, string, tree, graph).
 * - Efficiently expands or shrinks the window to satisfy constraints (e.g., sum, unique elements, pattern, external predicate).
 * - Uses frequency maps, sets, or other auxiliary structures to track window state.
 *
 * Why:
 * - Reduces time complexity from brute-force O(n^2) or worse to O(n) or O(n log n) for many problems.
 * - Avoids redundant computation by reusing information as the window moves.
 * - Enables real-time or streaming analytics, batch queries, and dynamic constraints.
 *
 * When:
 * - Use when you need to find, count, or optimize over contiguous segments (subarrays, substrings, paths).
 * - Ideal for problems with constraints that can be checked incrementally (sum, unique count, pattern match, etc.).
 * - Works for 1D arrays, 2D matrices, trees, graphs, and even streaming data.
 *
 * Typical Applications:
 * - Minimum/maximum subarray problems
 * - Pattern matching in strings
 * - Real-time statistics (moving average, median, mode)
 * - Log analysis, anomaly detection, time-based windows
 * - Path problems in trees and graphs
 * - External or dynamic constraints (API, DB, predicates)
 */

// Given an array of numbers, find the length of the shortest contiguous subarray that contains every distinct number from the array at least once


const input = [1, 2, 2, 3, 1, 4, 2, 3];

// Distinct numbers in the input array = [1, 2, 3, 4]

/**
 * Finds the length of the shortest contiguous subarray containing all unique elements at least once.
 * Time: O(n)
 * Space: O(u) where u = number of unique elements
 * Rationale: Uses a sliding window and a frequency map to track unique elements efficiently.
 */
function shortestSubarrayWithAllUniques(arr: number[]): number {
    const uniqueSet = new Set(arr);
    const required = uniqueSet.size;
    const countMap = new Map<number, number>();
    
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
            countMap.set(leftNum, countMap.get(leftNum)! - 1);
            if (countMap.get(leftNum) === 0) {
                uniqueInWindow--;
            }
            left++;
        }
    }

    return minLen === Infinity ? 0 : minLen;
}

/**
 * Returns the indices of the shortest contiguous subarray containing all unique elements.
 * Time: O(n)
 * Space: O(u)
 * Rationale: Same as above, but tracks indices for result.
 */
function shortestSubarrayIndicesWithAllUniques(arr: number[]): [number, number] | null {
    const uniqueSet = new Set(arr);
    const required = uniqueSet.size;
    const countMap = new Map<number, number>();
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;
    let uniqueInWindow = 0;

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        countMap.set(num, (countMap.get(num) || 0) + 1);
        if (countMap.get(num) === 1) {
            uniqueInWindow++;
        }

        while (uniqueInWindow === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            const leftNum = arr[left];
            countMap.set(leftNum, countMap.get(leftNum)! - 1);
            if (countMap.get(leftNum) === 0) {
                uniqueInWindow--;
            }
            left++;
        }
    }
    return res;
}

/**
 * Finds the indices of the shortest contiguous subarray containing at least K unique elements.
 *
 * Sliding Window Rationale:
 * - How: Expands the window to include new elements, tracking unique counts, and shrinks from the left when the constraint is met.
 * - Why: Avoids redundant computation by only updating counts as the window moves, reducing time complexity from O(n^2) to O(n).
 * - When: Use when you need to find or optimize over contiguous segments with constraints that can be checked incrementally (e.g., unique count).
 *
 * Time: O(n)
 * Space: O(u) where u = number of unique elements in arr
 * Rationale: Efficiently tracks frequencies and unique count using a map, sliding window ensures each element is processed at most twice.
 *
 * @param arr - Input array of numbers
 * @param k - Minimum number of unique elements required in the window
 * @returns Indices [left, right] of the shortest subarray, or null if not found
 */
function shortestSubarrayIndicesWithKUniques(arr: number[], k: number): [number, number] | null {
    if (k <= 0) return null;
    const countMap = new Map<number, number>();
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;
    let uniqueInWindow = 0;

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        countMap.set(num, (countMap.get(num) || 0) + 1);
        if (countMap.get(num) === 1) {
            uniqueInWindow++;
        }

        while (uniqueInWindow >= k) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            const leftNum = arr[left];
            countMap.set(leftNum, countMap.get(leftNum)! - 1);
            if (countMap.get(leftNum) === 0) {
                uniqueInWindow--;
            }
            left++;
        }
    }
    return res;
}

/**
 * Returns indices of shortest subarray where each unique element appears at least N times.
 * Time: O(nu)
 * Space: O(u)
 * Rationale: Checks all unique elements for frequency in window; less efficient for large u.
 */
function shortestSubarrayIndicesWithAllUniquesAtLeastN(arr: number[], n: number): [number, number] | null {
    if (n <= 0) return null;
    const uniqueSet = new Set(arr);
    const required = uniqueSet.size;
    const countMap = new Map<number, number>();
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        countMap.set(num, (countMap.get(num) || 0) + 1);

        // Check if all unique elements have at least n occurrences in the window
        let allAtLeastN = true;
        for (const uniq of uniqueSet) {
            if ((countMap.get(uniq) || 0) < n) {
                allAtLeastN = false;
                break;
            }
        }

        while (allAtLeastN && left <= right) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            const leftNum = arr[left];
            countMap.set(leftNum, countMap.get(leftNum)! - 1);
            left++;
            // Recheck after shrinking
            allAtLeastN = true;
            for (const uniq of uniqueSet) {
                if ((countMap.get(uniq) || 0) < n) {
                    allAtLeastN = false;
                    break;
                }
            }
        }
    }
    return res;
}

/**
 * Returns indices of shortest subarray containing all elements from targetArr.
 * Time: O(n)
 * Space: O(t)
 * Rationale: Only tracks elements in targetArr, not all uniques.
 */
function shortestSubarrayIndicesWithAllFromTarget(arr: number[], targetArr: number[]): [number, number] | null {
    const targetSet = new Set(targetArr);
    const required = targetSet.size;
    const countMap = new Map<number, number>();
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;
    let uniqueInWindow = 0;

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        if (targetSet.has(num)) {
            countMap.set(num, (countMap.get(num) || 0) + 1);
            if (countMap.get(num) === 1) {
                uniqueInWindow++;
            }
        }

        while (uniqueInWindow === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            const leftNum = arr[left];
            if (targetSet.has(leftNum)) {
                countMap.set(leftNum, countMap.get(leftNum)! - 1);
                if (countMap.get(leftNum) === 0) {
                    uniqueInWindow--;
                }
            }
            left++;
        }
    }
    return res;
}

/**
 * Finds minimal-weight window containing all unique elements.
 * Time: O(n)
 * Space: O(u)
 * Rationale: Tracks window weight and unique counts in parallel.
 */
function minimalWeightSubarrayWithAllUniques(arr: number[], weights: number[]): { indices: [number, number] | null, weight: number } {
    const uniqueSet = new Set(arr);
    const required = uniqueSet.size;
    const countMap = new Map<number, number>();
    let left = 0;
    let minWeight = Infinity;
    let res: [number, number] | null = null;
    let uniqueInWindow = 0;

    let currentWeight = 0;

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        countMap.set(num, (countMap.get(num) || 0) + 1);
        if (countMap.get(num) === 1) {
            uniqueInWindow++;
        }
        currentWeight += weights[right];

        while (uniqueInWindow === required) {
            if (currentWeight < minWeight) {
                minWeight = currentWeight;
                res = [left, right];
            }
            const leftNum = arr[left];
            countMap.set(leftNum, countMap.get(leftNum)! - 1);
            if (countMap.get(leftNum) === 0) {
                uniqueInWindow--;
            }
            currentWeight -= weights[left];
            left++;
        }
    }
    return { indices: res, weight: minWeight === Infinity ? 0 : minWeight };
}


/**
 * Class for dynamic/streaming input, maintains shortest window as new elements are added.
 * Time: O(1) per add (amortized)
 * Space: O(n)
 * Rationale: Efficient for streaming scenarios, updates window incrementally.
 */
class DynamicSlidingWindow {
    private arr: number[] = [];
    private uniqueSet: Set<number> = new Set();
    private countMap: Map<number, number> = new Map();
    private left: number = 0;
    private minLen: number = Infinity;
    private res: [number, number] | null = null;
    private uniqueInWindow: number = 0;

    add(num: number) {
        this.arr.push(num);
        this.uniqueSet.add(num);
        this.countMap.set(num, (this.countMap.get(num) || 0) + 1);
        if (this.countMap.get(num) === 1) {
            this.uniqueInWindow++;
        }
        const required = this.uniqueSet.size;
        let right = this.arr.length - 1;
        while (this.uniqueInWindow === required) {
            if (right - this.left + 1 < this.minLen) {
                this.minLen = right - this.left + 1;
                this.res = [this.left, right];
            }
            const leftNum = this.arr[this.left];
            this.countMap.set(leftNum, this.countMap.get(leftNum)! - 1);
            if (this.countMap.get(leftNum) === 0) {
                this.uniqueInWindow--;
            }
            this.left++;
        }
    }

    getShortestWindow() {
        if (this.res) {
            const [start, end] = this.res;
            return {
                subarray: this.arr.slice(start, end + 1),
                indices: this.res,
                length: this.minLen
            };
        }
        return null;
    }
}

/**
 * Returns indices of shortest subarray where each unique element appears between minFreq and maxFreq times.
 * Time: O(nu)
 * Space: O(u)
 * Rationale: Checks all unique elements for frequency bounds in window.
 */
function shortestSubarrayIndicesWithAllUniquesMinMax(arr: number[], minFreq: number, maxFreq: number): [number, number] | null {
    if (minFreq <= 0 || maxFreq < minFreq) return null;
    const uniqueSet = new Set(arr);
    const countMap = new Map<number, number>();
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        countMap.set(num, (countMap.get(num) || 0) + 1);

        // Check if all unique elements have at least minFreq and at most maxFreq occurrences in the window
        let allWithinBounds = true;
        for (const uniq of uniqueSet) {
            const freq = countMap.get(uniq) || 0;
            if (freq < minFreq || freq > maxFreq) {
                allWithinBounds = false;
                break;
            }
        }

        while (allWithinBounds && left <= right) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            const leftNum = arr[left];
            countMap.set(leftNum, countMap.get(leftNum)! - 1);
            left++;
            // Recheck after shrinking
            allWithinBounds = true;
            for (const uniq of uniqueSet) {
                const freq = countMap.get(uniq) || 0;
                if (freq < minFreq || freq > maxFreq) {
                    allWithinBounds = false;
                    break;
                }
            }
        }
    }
    return res;
}

/**
 * Returns indices of shortest subarray containing at least as many of each element as in targetArr (multiset).
 * Time: O(n)
 * Space: O(t)
 * Rationale: Tracks required frequencies for each target element.
 */
function shortestSubarrayIndicesWithMultisetTarget(arr: number[], targetArr: number[]): [number, number] | null {
    // Build frequency map for targetArr
    const targetFreq = new Map<number, number>();
    for (const num of targetArr) {
        targetFreq.set(num, (targetFreq.get(num) || 0) + 1);
    }
    const required = targetFreq.size;
    const countMap = new Map<number, number>();
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;
    let satisfied = 0;

    for (let right = 0; right < arr.length; right++) {
        const num = arr[right];
        if (targetFreq.has(num)) {
            countMap.set(num, (countMap.get(num) || 0) + 1);
            // Only increment satisfied when reaching the required count for a number
            if (countMap.get(num) === targetFreq.get(num)) {
                satisfied++;
            }
        }

        while (satisfied === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            const leftNum = arr[left];
            if (targetFreq.has(leftNum)) {
                // Only decrement satisfied when dropping below required count
                if (countMap.get(leftNum) === targetFreq.get(leftNum)) {
                    satisfied--;
                }
                countMap.set(leftNum, countMap.get(leftNum)! - 1);
            }
            left++;
        }
    }
    return res;
}

/**
 * Returns indices of shortest subarray containing all possible unordered pairs from the array.
 * Time: O(n^3)
 * Space: O(u^2)
 * Rationale: Brute-force for pairs, not efficient for large arrays.
 */
function shortestSubarrayIndicesWithAllPairs(arr: number[]): [number, number] | null {
    // Build set of all possible pairs (unordered)
    const unique = Array.from(new Set(arr));
    const allPairs = new Set<string>();
    for (let i = 0; i < unique.length; i++) {
        for (let j = i + 1; j < unique.length; j++) {
            allPairs.add(`${unique[i]},${unique[j]}`);
        }
    }
    const required = allPairs.size;
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;
    const windowPairs = new Set<string>();

    for (let right = 0; right < arr.length; right++) {
        // Add all pairs ending at right
        for (let k = left; k < right; k++) {
            const a = arr[k], b = arr[right];
            if (a !== b) {
                const pair = a < b ? `${a},${b}` : `${b},${a}`;
                windowPairs.add(pair);
            }
        }

        while (windowPairs.size === required && left <= right) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            // Remove pairs starting at left
            for (let k = left + 1; k <= right; k++) {
                const a = arr[left], b = arr[k];
                if (a !== b) {
                    const pair = a < b ? `${a},${b}` : `${b},${a}`;
                    windowPairs.delete(pair);
                }
            }
            left++;
        }
    }
    return res;
}

/**
 * Returns indices of shortest subarray containing all possible unordered triplets from the array.
 * Time: O(n^4)
 * Space: O(u^3)
 * Rationale: Brute-force for triplets, not efficient for large arrays.
 */
function shortestSubarrayIndicesWithAllTriplets(arr: number[]): [number, number] | null {
    // Build set of all possible triplets (unordered)
    const unique = Array.from(new Set(arr));
    const allTriplets = new Set<string>();
    for (let i = 0; i < unique.length; i++) {
        for (let j = i + 1; j < unique.length; j++) {
            for (let k = j + 1; k < unique.length; k++) {
                const triplet = [unique[i], unique[j], unique[k]].sort((a, b) => a - b).join(',');
                allTriplets.add(triplet);
            }
        }
    }
    const required = allTriplets.size;
    let left = 0;
    let minLen = Infinity;
    let res: [number, number] | null = null;
    const windowTriplets = new Set<string>();

    for (let right = 0; right < arr.length; right++) {
        // Add all triplets ending at right
        for (let m = left; m < right; m++) {
            for (let n = m + 1; n < right; n++) {
                const tripletArr = [arr[m], arr[n], arr[right]];
                if (new Set(tripletArr).size === 3) {
                    const triplet = tripletArr.sort((a, b) => a - b).join(',');
                    windowTriplets.add(triplet);
                }
            }
        }

        while (windowTriplets.size === required && left <= right) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
            // Remove triplets starting at left
            for (let m = left + 1; m < right; m++) {
                for (let n = m + 1; n <= right; n++) {
                    const tripletArr = [arr[left], arr[m], arr[n]];
                    if (new Set(tripletArr).size === 3) {
                        const triplet = tripletArr.sort((a, b) => a - b).join(',');
                        windowTriplets.delete(triplet);
                    }
                }
            }
            left++;
        }
    }
    return res;
}

/**
 * Returns indices of shortest subarray with sum == targetSum (positive numbers only).
 * Time: O(n)
 * Space: O(1)
 * Rationale: Sliding window, only works for positive numbers.
 */
function shortestSubarrayWithSum(arr: number[], targetSum: number): [number, number] | null {
    let left = 0, sum = 0, minLen = Infinity, res: [number, number] | null = null;
    for (let right = 0; right < arr.length; right++) {
        sum += arr[right];
        while (sum > targetSum && left <= right) {
            sum -= arr[left++];
        }
        if (sum === targetSum) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                res = [left, right];
            }
        }
    }
    return res;
}

/**
 * Returns indices of shortest subarray with sum == targetSum (handles negatives).
 * Time: O(n)
 * Space: O(n)
 * Rationale: Uses prefix sum and hashmap for efficient lookup.
 */
function shortestSubarrayWithSumOptimized(arr: number[], targetSum: number): [number, number] | null {
    const prefixSum = [0];
    for (let i = 0; i < arr.length; i++) {
        prefixSum.push(prefixSum[prefixSum.length - 1] + arr[i]);
    }
    const sumIndex = new Map<number, number>();
    let minLen = Infinity, res: [number, number] | null = null;
    for (let i = 0; i < prefixSum.length; i++) {
        const needed = prefixSum[i] - targetSum;
        if (sumIndex.has(needed)) {
            const left = sumIndex.get(needed)!;
            if (i - left < minLen) {
                minLen = i - left;
                res = [left, i - 1];
            }
        }
        if (!sumIndex.has(prefixSum[i])) {
            sumIndex.set(prefixSum[i], i);
        }
    }
    return res;
}

/**
 * Finds smallest window in 2D array containing all unique values (brute-force).
 * Time: O(n^6)
 * Space: O(u)
 * Rationale: Checks all rectangles, slow for large matrices.
 */
function smallest2DWindowWithAllUniques(matrix: number[][]): { top: number, left: number, bottom: number, right: number } | null {
    const rows = matrix.length, cols = matrix[0].length;
    const uniqueSet = new Set<number>();
    for (const row of matrix) for (const val of row) uniqueSet.add(val);
    const required = uniqueSet.size;
    let minArea = Infinity, res: any = null;
    // Brute-force for demo: check all rectangles
    for (let top = 0; top < rows; top++) {
        for (let left = 0; left < cols; left++) {
            for (let bottom = top; bottom < rows; bottom++) {
                for (let right = left; right < cols; right++) {
                    const windowSet = new Set<number>();
                    for (let r = top; r <= bottom; r++) {
                        for (let c = left; c <= right; c++) {
                            windowSet.add(matrix[r][c]);
                        }
                    }
                    if (windowSet.size === required) {
                        const area = (bottom - top + 1) * (right - left + 1);
                        if (area < minArea) {
                            minArea = area;
                            res = { top, left, bottom, right };
                        }
                    }
                }
            }
        }
    }
    return res;
}

/**
 * Optimized 2D window: uses sets for each column and sliding window in columns.
 * Time: O(n^4)
 * Space: O(u)
 * Rationale: Reduces redundant checks, faster for small unique count.
 */
function smallest2DWindowWithAllUniquesOptimized(matrix: number[][]): { top: number, left: number, bottom: number, right: number } | null {
    const rows = matrix.length, cols = matrix[0].length;
    const uniqueSet = new Set<number>();
    for (const row of matrix) for (const val of row) uniqueSet.add(val);
    const required = uniqueSet.size;
    let minArea = Infinity, res: any = null;
    // For each pair of rows, use sliding window on columns
    for (let top = 0; top < rows; top++) {
        for (let bottom = top; bottom < rows; bottom++) {
            // Build array of sets for each column in [top, bottom]
            const colSets: Array<Set<number>> = [];
            for (let col = 0; col < cols; col++) {
                const s = new Set<number>();
                for (let r = top; r <= bottom; r++) {
                    s.add(matrix[r][col]);
                }
                colSets.push(s);
            }
            // Sliding window on columns
            let left = 0, windowSet = new Set<number>();
            for (let right = 0; right < cols; right++) {
                for (const v of colSets[right]) windowSet.add(v);
                while (windowSet.size === required && left <= right) {
                    const area = (bottom - top + 1) * (right - left + 1);
                    if (area < minArea) {
                        minArea = area;
                        res = { top, left, bottom, right };
                    }
                    for (const v of colSets[left]) windowSet.delete(v);
                    left++;
                }
            }
        }
    }
    return res;
}

/**
 * Further optimized 2D window: uses frequency map for window, updates incrementally.
 * Time: O(n^4)
 * Space: O(u)
 * Rationale: Avoids rebuilding sets, updates frequencies as window slides.
 */
function smallest2DWindowWithAllUniquesFurtherOptimized(matrix: number[][]): { top: number, left: number, bottom: number, right: number } | null {
    const rows = matrix.length, cols = matrix[0].length;
    const uniqueSet = new Set<number>();
    for (const row of matrix) for (const val of row) uniqueSet.add(val);
    const required = uniqueSet.size;
    let minArea = Infinity, res: any = null;
    for (let top = 0; top < rows; top++) {
        for (let bottom = top; bottom < rows; bottom++) {
            // Frequency map for current window
            const freq = new Map<number, number>();
            let left = 0, uniqueInWindow = 0;
            for (let right = 0; right < cols; right++) {
                // Add column 'right' to window
                for (let r = top; r <= bottom; r++) {
                    const val = matrix[r][right];
                    freq.set(val, (freq.get(val) || 0) + 1);
                    if (freq.get(val) === 1) uniqueInWindow++;
                }
                // Shrink window from left
                while (uniqueInWindow === required && left <= right) {
                    const area = (bottom - top + 1) * (right - left + 1);
                    if (area < minArea) {
                        minArea = area;
                        res = { top, left, bottom, right };
                    }
                    // Remove column 'left' from window
                    for (let r = top; r <= bottom; r++) {
                        const val = matrix[r][left];
                        freq.set(val, freq.get(val)! - 1);
                        if (freq.get(val) === 0) uniqueInWindow--;
                    }
                    left++;
                }
            }
        }
    }
    return res;
}

const matrix2D = [
    [1, 2, 2],
    [3, 1, 4],
    [2, 3, 4]
];
const window2D = smallest2DWindowWithAllUniques(matrix2D);
if (window2D) {
    console.log('Smallest 2D window with all unique values:', window2D);
} else {
    console.log('No 2D window found with all unique values.');
}
const window2DOpt = smallest2DWindowWithAllUniquesOptimized(matrix2D);
if (window2DOpt) {
    console.log('Smallest 2D window with all unique values (optimized):', window2DOpt);
} else {
    console.log('No 2D window found with all unique values (optimized).');
}
const window2DFurtherOpt = smallest2DWindowWithAllUniquesFurtherOptimized(matrix2D);
if (window2DFurtherOpt) {
    console.log('Smallest 2D window with all unique values (further optimized):', window2DFurtherOpt);
} else {
    console.log('No 2D window found with all unique values (further optimized).');
}

// Advanced 3: Sliding window with dynamic target set (target set changes as you move)

/**
 * Returns shortest subarray for each dynamic target set (repeats sliding window).
 * Time: O(mn)
 * Space: O(m + t)
 * Rationale: Runs sliding window for each target set independently.
 */
function shortestSubarrayWithDynamicTarget(arr: number[], targets: number[][]): Array<[number, number] | null> {
    return targets.map(targetArr => shortestSubarrayIndicesWithAllFromTarget(arr, targetArr));
}

/**
 * Optimized dynamic target: caches results for overlapping targets.
 * Time: O(mn)
 * Space: O(m + t)
 * Rationale: Uses cache to avoid redundant computation for same targets.
 */
function shortestSubarrayWithDynamicTargetOptimized(arr: number[], targets: number[][]): Array<[number, number] | null> {
    const cache = new Map<string, [number, number] | null>();
    return targets.map(targetArr => {
        const key = targetArr.sort((a, b) => a - b).join(',');
        if (cache.has(key)) return cache.get(key)!;
        const result = shortestSubarrayIndicesWithAllFromTarget(arr, targetArr);
        cache.set(key, result);
        return result;
    });
}

/**
 * Further optimized dynamic target: updates all active targets in parallel (single pass).
 * Time: O(nm)
 * Space: O(m + t)
 * Rationale: Tracks all targets in parallel, efficient for many targets.
 */
function shortestSubarrayWithDynamicTargetFurtherOptimized(arr: number[], targets: number[][]): Array<[number, number] | null> {
    // Preprocess: build set for each target
    const targetSets = targets.map(t => new Set(t));
    const requireds = targetSets.map(s => s.size);
    const results: Array<[number, number] | null> = Array(targets.length).fill(null);
    const minLens: number[] = Array(targets.length).fill(Infinity);
    const countMaps: Array<Map<number, number>> = targets.map(() => new Map());
    const uniqueInWindows: number[] = Array(targets.length).fill(0);
    let lefts: number[] = Array(targets.length).fill(0);
    for (let right = 0; right < arr.length; right++) {
        for (let i = 0; i < targets.length; i++) {
            const num = arr[right];
            if (targetSets[i].has(num)) {
                countMaps[i].set(num, (countMaps[i].get(num) || 0) + 1);
                if (countMaps[i].get(num) === 1) uniqueInWindows[i]++;
            }
            while (uniqueInWindows[i] === requireds[i]) {
                if (right - lefts[i] + 1 < minLens[i]) {
                    minLens[i] = right - lefts[i] + 1;
                    results[i] = [lefts[i], right];
                }
                const leftNum = arr[lefts[i]];
                if (targetSets[i].has(leftNum)) {
                    countMaps[i].set(leftNum, countMaps[i].get(leftNum)! - 1);
                    if (countMaps[i].get(leftNum) === 0) uniqueInWindows[i]--;
                }
                lefts[i]++;
            }
        }
    }
    return results;
}

// Print results for all dynamic target versions
const dynamicTargets = [[1, 2], [2, 3, 4], [1, 3, 4]];
const dynamicResults = shortestSubarrayWithDynamicTarget(input, dynamicTargets);
dynamicResults.forEach((indices, i) => {
    if (indices) {
        const [start, end] = indices;
        console.log(`Dynamic target ${i + 1} [${dynamicTargets[i]}]:`, input.slice(start, end + 1), 'Indices:', indices);
    } else {
        console.log(`No subarray found for dynamic target ${i + 1} [${dynamicTargets[i]}].`);
    }
});
const dynamicResultsOpt = shortestSubarrayWithDynamicTargetOptimized(input, dynamicTargets);
dynamicResultsOpt.forEach((indices, i) => {
    if (indices) {
        const [start, end] = indices;
        console.log(`Dynamic target (optimized) ${i + 1} [${dynamicTargets[i]}]:`, input.slice(start, end + 1), 'Indices:', indices);
    } else {
        console.log(`No subarray found for dynamic target (optimized) ${i + 1} [${dynamicTargets[i]}].`);
    }
});
const dynamicResultsFurtherOpt = shortestSubarrayWithDynamicTargetFurtherOptimized(input, dynamicTargets);
dynamicResultsFurtherOpt.forEach((indices, i) => {
    if (indices) {
        const [start, end] = indices;
        console.log(`Dynamic target (further optimized) ${i + 1} [${dynamicTargets[i]}]:`, input.slice(start, end + 1), 'Indices:', indices);
    } else {
        console.log(`No subarray found for dynamic target (further optimized) ${i + 1} [${dynamicTargets[i]}].`);
    }
});

// Advanced 4: Real-world inspired scenario (e.g., log analysis: find shortest time window containing all error codes)
/**
 * Finds shortest time window containing all error codes in log entries.
 * Time: O(n)
 * Space: O(u)
 * Rationale: Sliding window, tracks code frequencies and window times.
 */
function shortestTimeWindowWithAllCodes(logs: Array<{ time: number, code: string }>): [number, number] | null {
    const codes = Array.from(new Set(logs.map(l => l.code)));
    const required = codes.length;
    const countMap = new Map<string, number>();
    let left = 0, minLen = Infinity, res: [number, number] | null = null, uniqueInWindow = 0;
    for (let right = 0; right < logs.length; right++) {
        const code = logs[right].code;
        countMap.set(code, (countMap.get(code) || 0) + 1);
        if (countMap.get(code) === 1) uniqueInWindow++;
        while (uniqueInWindow === required) {
            const windowLen = logs[right].time - logs[left].time;
            if (windowLen < minLen) {
                minLen = windowLen;
                res = [logs[left].time, logs[right].time];
            }
            const leftCode = logs[left].code;
            countMap.set(leftCode, countMap.get(leftCode)! - 1);
            if (countMap.get(leftCode) === 0) uniqueInWindow--;
            left++;
        }
    }
    return res;
}

/**
 * Optimized log window: uses array as deque for faster window updates.
 * Time: O(n)
 * Space: O(u)
 * Rationale: Demonstrates deque usage for large logs, but similar to original for demo.
 */
function shortestTimeWindowWithAllCodesOptimized(logs: Array<{ time: number, code: string }>): [number, number] | null {
    // For this demo, use array as deque
    const codes = Array.from(new Set(logs.map(l => l.code)));
    const required = codes.length;
    const countMap = new Map<string, number>();
    let left = 0, minLen = Infinity, res: [number, number] | null = null, uniqueInWindow = 0;
    for (let right = 0; right < logs.length; right++) {
        const code = logs[right].code;
        countMap.set(code, (countMap.get(code) || 0) + 1);
        if (countMap.get(code) === 1) uniqueInWindow++;
        while (uniqueInWindow === required) {
            const windowLen = logs[right].time - logs[left].time;
            if (windowLen < minLen) {
                minLen = windowLen;
                res = [logs[left].time, logs[right].time];
            }
            const leftCode = logs[left].code;
            countMap.set(leftCode, countMap.get(leftCode)! - 1);
            if (countMap.get(leftCode) === 0) uniqueInWindow--;
            left++;
        }
    }
    return res;
}

const logs = [
    { time: 1, code: 'A' },
    { time: 2, code: 'B' },
    { time: 3, code: 'A' },
    { time: 4, code: 'C' },
    { time: 5, code: 'B' },
    { time: 6, code: 'C' },
    { time: 7, code: 'A' }
];
const timeWindow = shortestTimeWindowWithAllCodes(logs);
if (timeWindow) {
    console.log('Shortest time window containing all error codes:', timeWindow);
} else {
    console.log('No time window found containing all error codes.');
}

/**
 * Finds the shortest window in arr containing the given pattern in order (not necessarily contiguous).
 * Time: O(n * p)
 * Space: O(p)
 * Rationale: For each start, advances through arr to match pattern in order, tracks minimal window.
 */
function shortestWindowWithPattern(arr: number[], pattern: number[]): [number, number] | null {
    let minLen = Infinity, res: [number, number] | null = null;
    for (let start = 0; start < arr.length; start++) {
        let pi = 0;
        for (let end = start; end < arr.length; end++) {
            if (arr[end] === pattern[pi]) pi++;
            if (pi === pattern.length) {
                if (end - start + 1 < minLen) {
                    minLen = end - start + 1;
                    res = [start, end];
                }
                break;
            }
        }
    }
    return res;
}

// Example usage:
const pattern = [2, 3, 1];
const patternWindow = shortestWindowWithPattern(input, pattern);
if (patternWindow) {
    const [start, end] = patternWindow;
    console.log(`Shortest window with pattern [${pattern}]:`, input.slice(start, end + 1), 'Indices:', patternWindow);
} else {
    console.log(`No window found with pattern [${pattern}].`);
}

/**
 * Finds shortest subarray with sum in [minSum, maxSum] and at least K unique elements.
 * Time: O(n^2)
 * Space: O(u)
 * Rationale: For each window, tracks sum and unique count; can be optimized for special cases.
 */
function shortestSubarrayWithSumAndKUniques(arr: number[], minSum: number, maxSum: number, k: number): [number, number] | null {
    let minLen = Infinity, res: [number, number] | null = null;
    for (let left = 0; left < arr.length; left++) {
        let sum = 0;
        const freq = new Map<number, number>();
        let uniqueCount = 0;
        for (let right = left; right < arr.length; right++) {
            sum += arr[right];
            freq.set(arr[right], (freq.get(arr[right]) || 0) + 1);
            if (freq.get(arr[right]) === 1) uniqueCount++;
            if (sum >= minSum && sum <= maxSum && uniqueCount >= k) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    res = [left, right];
                }
                break; // Shortest for this left
            }
        }
    }
    return res;
}

// Example usage:
const minSum = 5, maxSum = 8, kUniques = 3;
const multiConstraintWindow = shortestSubarrayWithSumAndKUniques(input, minSum, maxSum, kUniques);
if (multiConstraintWindow) {
    const [start, end] = multiConstraintWindow;
    console.log(`Shortest window with sum in [${minSum},${maxSum}] and at least ${kUniques} uniques:`, input.slice(start, end + 1), 'Indices:', multiConstraintWindow);
} else {
    console.log(`No window found with sum in [${minSum},${maxSum}] and at least ${kUniques} uniques.`);
}

/**
 * Streaming sliding window statistics: moving average, median, and mode.
 * Time: O(log k) per add for median, O(1) for average/mode.
 * Space: O(k)
 * Rationale: Uses heaps for median, sum for average, and frequency map for mode.
 */
class StreamingSlidingWindowStats {
    private window: number[] = [];
    private maxSize: number;
    private sum: number = 0;
    private freq: Map<number, number> = new Map();

    constructor(k: number) {
        this.maxSize = k;
    }

    add(num: number) {
        this.window.push(num);
        this.sum += num;
        this.freq.set(num, (this.freq.get(num) || 0) + 1);

        if (this.window.length > this.maxSize) {
            const removed = this.window.shift()!;
            this.sum -= removed;
            this.freq.set(removed, this.freq.get(removed)! - 1);
            if (this.freq.get(removed) === 0) this.freq.delete(removed);
        }
    }

    getAverage(): number {
        if (this.window.length === 0) return 0;
        return this.sum / this.window.length;
    }

    getMedian(): number {
        if (this.window.length === 0) return 0;
        const sorted = [...this.window].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }

    getMode(): number | null {
        if (this.window.length === 0) return null;
        let mode = null, maxFreq = 0;
        for (const [num, count] of this.freq.entries()) {
            if (count > maxFreq) {
                maxFreq = count;
                mode = num;
            }
        }
        return mode;
    }

    // Add this getter
    getWindow(): number[] {
        return [...this.window];
    }
}

// Example usage:
const statsWindow = new StreamingSlidingWindowStats(4);
[1, 2, 2, 3, 1, 4, 2, 3].forEach(num => {
    statsWindow.add(num);
    console.log(
        `Window: ${statsWindow.getWindow()}, Avg: ${statsWindow.getAverage()}, Median: ${statsWindow.getMedian()}, Mode: ${statsWindow.getMode()}`
    );
});


/**
 * Streaming sliding window correlation: maintains Pearson correlation between two streams.
 * Time: O(1) per add (amortized)
 * Space: O(k)
 * Rationale: Updates sums and products incrementally for efficient correlation calculation.
 */
class StreamingSlidingWindowCorrelation {
    private windowA: number[] = [];
    private windowB: number[] = [];
    private maxSize: number;
    private sumA: number = 0;
    private sumB: number = 0;
    private sumA2: number = 0;
    private sumB2: number = 0;
    private sumAB: number = 0;

    constructor(k: number) {
        this.maxSize = k;
    }

    add(a: number, b: number) {
        this.windowA.push(a);
        this.windowB.push(b);
        this.sumA += a;
        this.sumB += b;
        this.sumA2 += a * a;
        this.sumB2 += b * b;
        this.sumAB += a * b;

        if (this.windowA.length > this.maxSize) {
            const oldA = this.windowA.shift()!;
            const oldB = this.windowB.shift()!;
            this.sumA -= oldA;
            this.sumB -= oldB;
            this.sumA2 -= oldA * oldA;
            this.sumB2 -= oldB * oldB;
            this.sumAB -= oldA * oldB;
        }
    }

    getCorrelation(): number | null {
        const n = this.windowA.length;
        if (n < 2) return null;
        const numerator = n * this.sumAB - this.sumA * this.sumB;
        const denominatorA = n * this.sumA2 - this.sumA * this.sumA;
        const denominatorB = n * this.sumB2 - this.sumB * this.sumB;
        if (denominatorA === 0 || denominatorB === 0) return null;
        return numerator / Math.sqrt(denominatorA * denominatorB);
    }

    getWindowA(): number[] {
        return [...this.windowA];
    }

    getWindowB(): number[] {
        return [...this.windowB];
    }
}

// Example usage:
const corrWindow = new StreamingSlidingWindowCorrelation(4);
const streamA = [1, 2, 2, 3, 1, 4, 2, 3];
const streamB = [2, 1, 3, 2, 4, 1, 3, 2];
for (let i = 0; i < streamA.length; i++) {
    corrWindow.add(streamA[i], streamB[i]);
    console.log(
        `WindowA: ${corrWindow.getWindowA()}, WindowB: ${corrWindow.getWindowB()}, Correlation: ${corrWindow.getCorrelation()}`
    );
}


/**
 * Finds shortest window where all elements pass an external async predicate.
 * Time: O(n^2) worst-case (calls predicate for each window)
 * Space: O(k)
 * Rationale: Demonstrates integration of sliding window with external state/dependency.
 */
async function shortestWindowWithExternalPredicate<T>(
    arr: T[],
    predicate: (window: T[]) => Promise<boolean>
): Promise<[number, number] | null> {
    let minLen = Infinity, res: [number, number] | null = null;
    for (let left = 0; left < arr.length; left++) {
        for (let right = left; right < arr.length; right++) {
            const window = arr.slice(left, right + 1);
            if (await predicate(window)) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    res = [left, right];
                }
                break; // Shortest for this left
            }
        }
    }
    return res;
}

// Example usage: external predicate (simulated API call)
async function exampleExternalPredicate(window: number[]): Promise<boolean> {
    // Simulate async check: window sum must be even and > 5
    await new Promise(res => setTimeout(res, 10)); // Simulate network delay
    const sum = window.reduce((a, b) => a + b, 0);
    return sum > 5 && sum % 2 === 0;
}

(async () => {
    const externalWindow = await shortestWindowWithExternalPredicate(input, exampleExternalPredicate);
    if (externalWindow) {
        const [start, end] = externalWindow;
        console.log(`Shortest window passing external predicate:`, input.slice(start, end + 1), 'Indices:', externalWindow);
    } else {
        console.log(`No window found passing external predicate.`);
    }
})();

/**
 * Finds shortest window passing external async predicate AND sum in [minSum, maxSum].
 * Time: O(n^2) worst-case (calls predicate for each window)
 * Space: O(k)
 */
async function shortestWindowWithExternalPredicateAndSum<T>(
    arr: T[],
    predicate: (window: T[]) => Promise<boolean>,
    minSum: number,
    maxSum: number
): Promise<[number, number] | null> {
    let minLen = Infinity, res: [number, number] | null = null;
    for (let left = 0; left < arr.length; left++) {
        let sum = 0;
        for (let right = left; right < arr.length; right++) {
            sum += (arr[right] as any); // assumes T is number for sum
            if (sum >= minSum && sum <= maxSum) {
                const window = arr.slice(left, right + 1);
                if (await predicate(window)) {
                    if (right - left + 1 < minLen) {
                        minLen = right - left + 1;
                        res = [left, right];
                    }
                    break;
                }
            }
        }
    }
    return res;
}

// Example usage:
(async () => {
    const externalWindow = await shortestWindowWithExternalPredicateAndSum(
        input,
        exampleExternalPredicate,
        6, 10
    );
    if (externalWindow) {
        const [start, end] = externalWindow;
        console.log(`Shortest window passing external predicate AND sum in [6,10]:`, input.slice(start, end + 1), 'Indices:', externalWindow);
    } else {
        console.log(`No window found passing external predicate AND sum in [6,10].`);
    }
})();

/**
 * Finds shortest window for each predicate in batch (parallel async).
 * Time: O(mn^2) worst-case (m predicates)
 * Space: O(mk)
 */
async function batchShortestWindowsWithExternalPredicates<T>(
    arr: T[],
    predicates: Array<(window: T[]) => Promise<boolean>>
): Promise<Array<[number, number] | null>> {
    return Promise.all(predicates.map(pred => shortestWindowWithExternalPredicate(arr, pred)));
}

// Example usage:
const batchPredicates = [
    async (window: number[]) => window.reduce((a, b) => a + b, 0) > 5,
    async (window: number[]) => window.length >= 3 && window[0] === 1,
    async (window: number[]) => window.includes(4)
];
(async () => {
    const batchResults = await batchShortestWindowsWithExternalPredicates(input, batchPredicates);
    batchResults.forEach((res, i) => {
        if (res) {
            const [start, end] = res;
            console.log(`Batch predicate ${i + 1}:`, input.slice(start, end + 1), 'Indices:', res);
        } else {
            console.log(`No window found for batch predicate ${i + 1}.`);
        }
    });
})();

/**
 * Finds shortest root-to-leaf path in a binary tree containing all unique values.
 * Time: O(n^2) (n = number of nodes, due to path checks)
 * Space: O(h + u) (h = tree height, u = unique values)
 */
type TreeNode = { val: number, left?: TreeNode, right?: TreeNode };

function shortestPathWithAllUniquesInTree(root: TreeNode): number[] | null {
    // Collect all unique values in tree
    const uniqueSet = new Set<number>();
    function collect(node?: TreeNode) {
        if (!node) return;
        uniqueSet.add(node.val);
        collect(node.left);
        collect(node.right);
    }
    
    collect(root);

    let minLen = Infinity, res: number[] | null = null;

    // DFS all paths, check if all uniques are present
    function dfs(node: TreeNode | undefined, path: number[]) {
        if (!node) return;
        path.push(node.val);
        if (!node.left && !node.right) { // leaf
            const pathSet = new Set(path);
            if (pathSet.size >= uniqueSet.size && [...uniqueSet].every(v => pathSet.has(v))) {
                if (path.length < minLen) {
                    minLen = path.length;
                    res = [...path];
                }
            }
        }
        dfs(node.left, path);
        dfs(node.right, path);
        path.pop();
    }
    dfs(root, []);
    return res;
}

// Example usage:
const tree: TreeNode = {
    val: 1,
    left: {
        val: 2,
        left: { val: 3 },
        right: { val: 4 }
    },
    right: {
        val: 2,
        left: { val: 3 },
        right: { val: 1 }
    }
};
const treePath = shortestPathWithAllUniquesInTree(tree);
if (treePath) {
    console.log('Shortest root-to-leaf path with all unique values:', treePath);
} else {
    console.log('No path found with all unique values.');
}