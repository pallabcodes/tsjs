// The find() method returns the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.


const array1 = [5, 12, 8, 130, 44];

const found = array1.find(element => element > 10);

console.log(found);
// expected output: 12

const inventory = [
  {name: 'apples', quantity: 2},
  {name: 'bananas', quantity: 0},
  {name: 'cherries', quantity: 5}
];

function isCherries(fruit) {
  return fruit.name === 'cherries';
}

console.log(inventory.find(isCherries));
// { name: 'cherries', quantity: 5 }


const inventory = [
  {name: 'apples', quantity: 2},
  {name: 'bananas', quantity: 0},
  {name: 'cherries', quantity: 5}
];

const result = inventory.find(({ name }) => name === 'cherries');

console.log(result) // { name: 'cherries', quantity: 5 }


function isPrime(element, index, array) {
  let start = 2;
  while (start <= Math.sqrt(element)) {
    if (element % start++ < 1) {
      return false;
    }
  }
  return element > 1;
}

console.log([4, 6, 8, 12].find(isPrime)); // undefined, not found
console.log([4, 5, 8, 12].find(isPrime)); // 5


// Declare array with no elements at indexes 2, 3, and 4
const array = [0,1,,,,5,6];

// Shows all indexes, not just those with assigned values
array.find(function(value, index) {
  console.log('Visited index ', index, ' with value ', value);
});

// Shows all indexes, including deleted
array.find(function(value, index) {
  // Delete element 5 on first iteration
  if (index === 0) {
    console.log('Deleting array[5] with value ', array[5]);
    delete array[5];
  }
  // Element 5 is still visited even though deleted
  console.log('Visited index ', index, ' with value ', value);
});
// expected output:
// Visited index 0 with value 0
// Visited index 1 with value 1
// Visited index 2 with value undefined
// Visited index 3 with value undefined
// Visited index 4 with value undefined
// Visited index 5 with value 5
// Visited index 6 with value 6
// Deleting array[5] with value 5
// Visited index 0 with value 0
// Visited index 1 with value 1
// Visited index 2 with value undefined
// Visited index 3 with value undefined
// Visited index 4 with value undefined
// Visited index 5 with value undefined
// Visited index 6 with value 6

// ## findIndex()

const array1 = [5, 12, 8, 130, 44];

const isLargeNumber = (element) => element > 5;

console.log(array1.findIndex(isLargeNumber));

function isPrime(element) {
  if (element % 2 === 0 || element < 2) {
    return false;
  }
  for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
    if (element % factor === 0) {
      return false;
    }
  }
  return true;
}

console.log([4, 6, 8, 9, 12].findIndex(isPrime)); // -1, not found
console.log([4, 6, 7, 9, 12].findIndex(isPrime)); // 2 (array[2] is 7)

const fruits = ["apple", "banana", "cantaloupe", "blueberries", "grapefruit"];

const index = fruits.findIndex((fruit) => fruit === "blueberries");

console.log(index); // 3
console.log(fruits[index]); // blueberries

// ## findLast - findLastIndex

const array1 = [5, 12, 50, 130, 44];

const found = array1.findLast((element) => element > 45);

console.log(found);

const inventory = [
  {name: 'apples', quantity: 2},
  {name: 'bananas', quantity: 0},
  {name: 'fish', quantity: 1},
  {name: 'cherries', quantity: 5}
];

// return true inventory stock is low
function isNotEnough(item) {
  return item.quantity < 2;
}

console.log(inventory.findLast(isNotEnough));
// { name: "fish", quantity: 1 }


const inventory = [
  {name: 'apples', quantity: 2},
  {name: 'bananas', quantity: 0},
  {name: 'fish', quantity: 1},
  {name: 'cherries', quantity: 5},
];

const result = inventory.findLast(({ quantity }) => quantity < 2);

console.log(result);
// { name: "fish", quantity: 1 }


function isPrime(element) {
  if (element % 2 === 0 || element < 2) {
    return false;
  }
  for (let factor = 3; factor <= Math.sqrt(element); factor += 2) {
    if (element % factor === 0) {
      return false;
    }
  }
  return true;
}

console.log([4, 6, 8, 12].findLast(isPrime)); // undefined, not found
console.log([4, 5, 7, 8, 9, 11, 12].findLast(isPrime)); // 11


// Declare array with no elements at indexes 2, 3, and 4
const array = [0,1,,,,5,6];

// Shows all indexes, not just those with assigned values
array.findLast(function(value, index) {
  console.log(`Visited index ${index} with value ${value}`);
});

// Shows all indexes, including deleted
array.findLast(function(value, index) {
  // Delete element 5 on first iteration
  if (index === 6) {
    console.log(`Deleting array[5] with value ${array[5]}`);
    delete array[5];
  }
  // Element 5 is still visited even though deleted
  console.log(`Visited index ${index} with value ${value}`);
});
// expected output:
// > "Visited index 6 with value 6"
// > "Visited index 5 with value 5"
// > "Visited index 4 with value undefined"
// > "Visited index 3 with value undefined"
// > "Visited index 2 with value undefined"
// > "Visited index 1 with value 1"
// > "Visited index 0 with value 0"
// > "Deleting array[5] with value 5"
// > "Visited index 6 with value 6"
// > "Visited index 5 with value undefined"
// > "Visited index 4 with value undefined"
// > "Visited index 3 with value undefined"
// > "Visited index 2 with value undefined"
// > "Visited index 1 with value 1"
// > "Visited index 0 with value 0"


const array1 = [5, 12, 50, 130, 44];

const isLargeNumber = (element) => element > 45;

console.log(array1.findLastIndex(isLargeNumber));
// expected output: 3  (of element with value: 30)





