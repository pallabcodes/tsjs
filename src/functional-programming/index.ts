// Iterative vs Declarative Programming::
let array: Array<number> = [1, 2];

// Here, as seen step by step told to program what to do i.e. imperative programming

for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}

// just import from users; then what to do [not necessarily step by step mentioned unlike above loop]
// basically here told what to do, now how to do unlike the loop where told what to do and how to do exactly?
// import * from users;
// <div></div>


// These are some functional programming paradigms::

// ## 1. Pure Functions : Given the same input it returns the same output [idempotent function]
console.log(Math.abs(-1)); // given the same input i.e. here -1; it'll always return same output i.e. 1
console.log(Math.abs(0)); // 1

Math.abs(Math.abs(Math.abs(-1))); // still return the 1 value as the given input is basically same
Math.abs(Math.abs(Math.abs(Math.abs(1)))); // still return the 1 value as the given input is basically same

// SIDE EFFECTS: When interacting with anything literally outside the function that would change the data within function

// HOF: A function that takes function as argument or return a function or do both

// 2. Avoid mutability side effects : may copy but do not change the external values
const ages = [12, 22, 44, 45];
const newAges = ages.map(function(age) {
  if (age === 12) {
    return 20;
  } else {
    return age;
  }
});

const obj = Object.freeze({ change: "Locked" }); // the `freeze' enforces immutability
// obj.change = 0;
// delete obj.change;
// obj.addProp = "adding";

// any computation done within function should use its local variables and functional arguments
// copy external variable if needed from global state or variables

// ## Don't iterate since it alter the variable's value use something like map


function recurse(start: number = 1, end: number = 10): number | undefined {
  if (start === end) {
    console.log(start, end);
    return;
  } else {
    console.log(start);
    return recurse(start, end);
  }
}

recurse(1, 10); // 1, 2, 3, 4, 5, 6,7, 8, 9, 10


// ## currying: has argument of 1 or more than 1 by returning an inner function

// normal function
function add(firstNum: number, secondNum: number): number {
  return firstNum + secondNum;
}

// now with the currying : so main fn takes one argument then inner function next argument/arguments as needed
function adding(firstNum: number) {
  return function(secondNum: number) {
    return firstNum + secondNum;
  };
}

let addition2 = adding(5);
addition2(10); // 12

// ## Partial application in functional programming
const module = {
  height: 42,
  getComputedHeight: function(height: number) {
    return this.height + height;
  }
};

const unboundGetComputedHeight = module.getComputedHeight;
console.log(unboundGetComputedHeight(44));
/* This function invoked on global scope thus this.height + height = undefined + 44 = return NaN */

// const boundGetComputedHeight = module.getComputedHeight.bind(module); // first, value of this context
const boundGetComputedHeight = unboundGetComputedHeight.bind(module); // first, value of this context
boundGetComputedHeight(55); // required argument(s)


// ## function composition : allows to take two/more functions and turn them into one function that does exactly what the two function (or more) do

function add50<T extends number>(num: T) {
  return num + 50;
}

function add30(num: number) {
  return num + 30;
}

function add20(num: number) {
  return num + 20;
}

function add10(num: number) {
  return num + 10;
}

function add100(num: number) {
  return num + 100;
}

// these two can be composed to =>
function composed(num: number) {
  return add10(add100(num)); // moving last/right to first/left
}

function add50Composed(num: number) {
  return add10(add10(add10(add10(add10(num)))));
}

function add30Composed(num: number) {
  return add10(add10(add10(num)));
}

function add20Composed(num: number) {
  return add10(add10(num));
}

composed(1); // returns 111

