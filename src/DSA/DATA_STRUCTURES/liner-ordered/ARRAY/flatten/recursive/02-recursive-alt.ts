function flattenHelper(arr: any[], processed: any[] = []): any[] {
  for (const val of arr) {
    if (Array.isArray(val)) {
      flattenHelper(val, processed);
    } else {
      processed.push(val);
    }
  }
  return processed;
}

// Wrapper for API consistency
function flattenAlt(arr: any[]): any[] {
  return flattenHelper(arr, []);
}

console.log(flattenAlt([1, [2, [3, 4], 5], 6])); // Output: [1, 2, 3, 4, 5, 6]

// export default flattenAlt;