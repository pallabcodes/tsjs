// normal function can have a single return or none while generator fn can return(i.e. "yield") multiple value with a single return



function* generatorSequence() {
  yield 11; // when first next called then execution stops here and return { value: 11, done: false }
  yield 22;
  yield `greeting`;
  return `greeted`;
}
// string and array is iterable thus when spread they have been copied
const ar = ["JavaScript", 'REACT'];
const gameTitle = 'FIFA'
console.log([`Hello`, ...ar, ...gameTitle]);
// since generatorSequence() is iterable by spreading it copies each of its elements
const numbers = [0, ...generatorSequence()];

// so to copy the value from generators to an array (done value is excluded)
const sequenceArray = [...generatorSequence()];
console.log(sequenceArray);

const sequence = generatorSequence(); // to get value either iterate (for of) or use the next method()
// console.log(sequence);

// to call it uses next method; it runs till the nearest yield statement then fn execution pauses and that yield value is returned
  console.log(sequence.next());
console.log(sequence.next());
// console.log(sequence.next().value.next());
console.log(sequence.next());

// generators are totally iterable so rather than using next it could iterate like this as well
// however for of ignore the value which has done true thus use yield if needed
for (const s of sequence) {
  console.log(s);
}

// throw error explicitly with try catch

// Define a generator function with a try...catch
function* generatorFunction() {
  try {
    yield 'Neo'
    yield 'Morpheus'
  } catch (error) {
    console.log(error)
  }
}

// Invoke the generator and throw an error
const generator = generatorFunction()

console.log(generator.next());
generator.throw(new Error('Error thrown here explicitly to stop after the first yield'));
console.log(generator.next());

// # delegation

// Generator function that will be delegated to
function* delegate(num1, num2) {
  yield num1;
  yield num2;
  if (num1 < 5) {
    num1 = 55;
  }
  yield num1 + num2;
}

// Outer generator function
function* begin() {
  yield 1;
  yield 2;
  yield* delegate(-5, 6);
}

const be = begin();

for (const b of be) {
  console.log(b);
}


// Define a generator function that increments by one
function* incrementer() {
  let i = 0

  while (true) {
    yield i++
  }
}

// Initiate the generator
const counter = incrementer()

console.log(counter.next());
console.log(counter.next());


// Create a fibonacci generator function
function* fibonacci() {
  let prev = 0
  let next = 1

  yield prev
  yield next

  // Add previous and next values and yield them forever
  while (true) {
    const newVal = next + prev

    yield newVal

    prev = next
    next = newVal
  }
}

// Print the first 10 values of fibonacci
const fib = fibonacci()

for (let i = 0; i < 10; i++) {
  console.log(fib.next().value)
}

// # passing value to generators

function* generatorFunction() {
  console.log(yield)
  console.log(yield)

  return 'The end'
}

const generator = generatorFunction()

generator.next()
generator.next(100)
generator.next(200)
