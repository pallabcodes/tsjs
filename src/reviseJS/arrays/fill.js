const array1 = [1, 2, 3, 4];

// fill with 0 from position 2 until position 4
console.log(array1.fill(0, 2, 4));
// expected output: [1, 2, 0, 0]

// fill with 5 from position 1
console.log(array1.fill(5, 1));
// expected output: [1, 5, 5, 5]

console.log(array1.fill(6));
// expected output: [6, 6, 6, 6]


// [1, 2, 3].fill(4)                // [4, 4, 4]
//   [1, 2, 3].fill(4, 1)             // [1, 4, 4]
//   [1, 2, 3].fill(4, 1, 2)          // [1, 4, 3]
//   [1, 2, 3].fill(4, 1, 1)          // [1, 2, 3]
//   [1, 2, 3].fill(4, 3, 3)          // [1, 2, 3]
//   [1, 2, 3].fill(4, -3, -2)        // [4, 2, 3]
//   [1, 2, 3].fill(4, NaN, NaN)      // [1, 2, 3]
//   [1, 2, 3].fill(4, 3, 5)          // [1, 2, 3]
// Array(3).fill(4)                 // [4, 4, 4]
//   [].fill.call({ length: 3 }, 4)   // {0: 4, 1: 4, 2: 4, length: 3}

// A single object, referenced by each slot of the array:
let arr = Array(3).fill({}) // [{}, {}, {}]
arr[0].hi = "hi"            // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]


const arr = new Array(3);
for (let i=0; i<arr.length; i++) {
  arr[i] = new Array(4).fill(1); // Creating an array of size 4 and filled of 1
}
arr[0][0] = 10;
console.log(arr[0][0]); // 10
console.log(arr[1][0]); // 1
console.log(arr[2][0]); // 1


let tempGirls = Array(5).fill("girl",0);
console.log(tempGirls);
