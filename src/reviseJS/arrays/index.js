// forEach, map, filter, reduce, sort, some, every, find, Array.from(), Array.of(), includes
// https://www.youtube.com/watch?v=DjzlGfhUyAM&list=PLNqp92_EXZBJmAHWnJbVnXsl71hiHCrQh&index=5&ab_channel=JackHerrington

let numbers = [10, 11, 15, 28, 48, 50];
console.log(numbers.indexOf((4)));
console.log(numbers.lastIndexOf(""));

for (const index in numbers) {
  console.log(index);
  console.log(numbers[index]);
}

for (const value of numbers) {
  console.log(value);
}

numbers.forEach((value, i) => {
  console.log(i);
  console.log(value);
});




// # Reduce/ReduceRight method

numbers = [10, 20, 25, 45, 55];

let sum = 0;

// for (const n of numbers) {
//   console.log(n);
//   sum += n
// }
// console.log(sum);

// console.log(numbers.reduce((acc, num) => acc + num, sum));

const n = numbers.reduce((acc, num) => {
  acc += num;
  return acc;
}, 0);

console.log(n);

// string formatting
const languages = ["REACT", "ANGULAR", "VUE", "NODE", "NEXT"];
const l = languages.reduce((str, lang) => `${str} ${lang}`, "");
console.log(typeof l, l);

//  reducing to an array
let arr = [];

for (const number of numbers) {
  arr = [number, ...arr];
  console.log(arr);
}
console.log(arr);

console.log(numbers.reduce((arr, number) => [...arr, number], []));

const groups = [
  [3, 2],
  [2, 5],
  [3, 7]
];

// [ 2, 2, 2, 5, 5 , 7, 7, 7 ]

groups.reduce((array, [key, value]) => {
  for (let index = 0; index < key; index++) {
    array.push(value);
  }
  console.log(array);
  return array;
}, []);

// # reducing to an object i.e. frequently pattern
const lookup = {};
numbers = [10, 20, 25, 2, 6, 6, 2, 12];
for (const number of numbers) {
  lookup[number] = (lookup[number] ?? 0) + 1;
}
console.log(lookup);

console.log(
  numbers.reduce(
    (lookup, value) => ({
      ...lookup,
      [value]: (lookup[value] ?? 0) + 1
    }),
    {}
  )
);

console.log(
  numbers.reduce(
    ({ max, min }, value) => ({
      min: Math.min(min, value),
      max: Math.max(max, value)
    }),
    {
      min: Infinity,
      max: -Infinity
    }
  )
);

numbers = [1, 2, 3, 4, 5];

// include
console.log(
  numbers.reduce(
    (includes, value) => (includes ? includes : value === 2),
    false
  )
);
console.log(
  numbers.reduce(
    (includes, value) => (includes ? includes : value === 10),
    false
  )
);

//  async

function getById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`got ${id}`);
      resolve(id);
    }, 1000);
  });
}

const ids = [10, 20];

ids.reduce(async (promise, id) => {
  // first await for promise to resolve then moev to next line
  console.log(promise);
  await promise;
  // return getById(id);
  const data = getById(id); // it returns a promise which is the return value
  console.log(data);
  return data;
}, Promise.resolve());

getById(ids);
