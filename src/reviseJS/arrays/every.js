// returns a boolean value

const isBelowThreshold = (currentValue) => currentValue < 40;

const array1 = [1, 30, 39, 29, 10, 13];

console.log(array1.every(isBelowThreshold)); // expected output: true


// Arrow function
every((element) => { /* … */ } )
every((element, index) => { /* … */ } )
every((element, index, array) => { /* … */ } )

// Callback function
every(callbackFn)
every(callbackFn, thisArg)

// Inline callback function
every(function(element) { /* … */ })
every(function(element, index) { /* … */ })
every(function(element, index, array){ /* … */ })
every(function(element, index, array) { /* … */ }, thisArg)


function isBigEnough(element, index, array) {
  return element >= 10;
}
[12, 5, 8, 130, 44].every(isBigEnough);   // false
[12, 54, 18, 130, 44].every(isBigEnough); // true


const isSubset = (array1, array2) => array2.every((element) => array1.includes(element));

console.log(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 7, 6])); // true
console.log(isSubset([1, 2, 3, 4, 5, 6, 7], [5, 8, 7])); // false


[12, 5, 8, 130, 44].every((x) => x >= 10);   // false
[12, 54, 18, 130, 44].every((x) => x >= 10); // true


// ---------------
// Modifying items
// ---------------
let arr = [1, 2, 3, 4];
arr.every((elem, index, arr) => {
  arr[index+1] -= 1
  console.log(`[${arr}][${index}] -> ${elem}`)
  return elem < 2
})

// Loop runs for 3 iterations, but would
// have run 2 iterations without any modification
//
// 1st iteration: [1,1,3,4][0] -> 1
// 2nd iteration: [1,1,2,4][1] -> 1
// 3rd iteration: [1,1,2,3][2] -> 2

// ---------------
// Appending items
// ---------------
arr = [1, 2, 3];
arr.every((elem, index, arr) => {
  arr.push('new')
  console.log(`[${arr}][${index}] -> ${elem}`)
  return elem < 4
})

// Loop runs for 3 iterations, even after appending new items
//
// 1st iteration: [1, 2, 3, new][0] -> 1
// 2nd iteration: [1, 2, 3, new, new][1] -> 2
// 3rd iteration: [1, 2, 3, new, new, new][2] -> 3

// ---------------
// Deleting items
// ---------------
arr = [1, 2, 3, 4];
arr.every((elem, index, arr) => {
  arr.pop()
  console.log(`[${arr}][${index}] -> ${elem}`)
  return elem < 4
})

// Loop runs for 2 iterations only, as the remaining
// items are `pop()`ed off
//
// 1st iteration: [1,2,3][0] -> 1
// 2nd iteration: [1,2][1] -> 2





