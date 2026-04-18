const flatten = (arr: any[]): any[] => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);

console.log(flatten([1, [2, [3, [4, 5]], 6], 7] )); // [1, 2, 3, 4, 5, 6, 7]