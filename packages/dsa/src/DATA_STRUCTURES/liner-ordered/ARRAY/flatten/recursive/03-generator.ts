function* flattenGen(arr: any[]): Generator<any> {
  for (const val of arr) {
    if (Array.isArray(val)) {
      yield* flattenGen(val);
    } else {
      yield val;
    }
  }
}

// Usage example:
const flatArr = Array.from(flattenGen([1, [2, [3, 4]], 5]));
console.log(flatArr); // [1, 2, 3, 4, 5]

export default flattenGen;