const array1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

console.log(array1.copyWithin(0, 3, 5));
console.log(array1.copyWithin(0, 4));

// copy to index 1 all elements from index 3 to the end
console.log(array1.copyWithin(1, 3));
// expected output: Array ["d", "d", "e", "d", "e"]


// noinspection JSCheckFunctionSignatures
// [1, 2, 3, 4, 5].copyWithin(-2)
// [1, 2, 3, 1, 2]

  // [1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]

  // [1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

  // [1, 2, 3, 4, 5].copyWithin(-2, -3, -1)
// [1, 2, 3, 3, 4]

  // [].copyWithin.call({ length: 5, 3: 1 }, 0, 3);
// {0: 1, 3: 1, length: 5}

// ES2015 Typed Arrays are subclasses of Array
const i32a = new Int32Array([1, 2, 3, 4, 5])

i32a.copyWithin(0, 2)
// Int32Array [3, 4, 5, 4, 5]

// On platforms that are not yet ES2015 compliant:
//   [].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]

