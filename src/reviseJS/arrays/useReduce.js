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

//  async reduce

function getById(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(resolve(id));
      resolve(id);
    }, 1000);
  });
}


const ids = [10, 20];

const re = Promise.resolve("actual value");
console.log(await re);

ids.reduce(async (promise, id) => {
  await promise;
  // 0: promise = Promise.resolve(undefined) : resolved by using await promise = undefined returned 10 but since cb fn is async so Promise.resolve(10)
  // 1: promise = Promise.resolve(10) : resolved by using await promise = undefined
  console.log(await promise);
  // do something
  const data = getById(id);
  // returns an actual value as getById resolves the promise and then return the data
  return data; // 10
}, Promise.resolve());

getById(ids);

const sleep = (delay) => new Promise(resolve => setTimeout(resolve, delay));
let array = [1, 2, 4, 5];

const asyncRes = await array.reduce(async (memo, e) => {
  await sleep(10);
  return (await memo) + e;
}, 0);

console.log(asyncRes);

array = [1, 2, 4, 5, 6];

const reducer = async (acc, key) => {
  let data;
  console.log(acc);
  try {
    data = await getById(key);
    return { ...await acc, [key]: data };
  } catch (error) {
    return { ...await acc, [key]: error };
  }
};
const result = await ["a", "b", "c", "d"].reduce(reducer, {});
console.log(result);
// https://gyandeeps.com/array-reduce-async-await/

// get all the pull request using GitHub api from a repo with commit not starting with "fix" or "docs"

// it will return all the PR projects from a repo that doesn't qualify as semver patch pr based on commit message
const getNonSemverPatchPRs = async () => {
  const allOpenPrs = await getAllOpenPRs();

  return allOpenPrs.reduce(async (previosPromise, pr) => {
    // by
    // to get the actual data from a resolved promise either user then or use await before it
    console.log(`PROMISE:: `, acc, "VALUE:: ", await acc);
    const collection = await previosPromise;
    console.log("collection: ", collection);
    // 1. This is where we want to get all the commits of the PR by number
    const allCommits = await getAllCommitsForaPr(pr.number);
    // 2. Then we want to see if the commit message of the first commit message starts with `Fix:` or `Docs:`
    const isNotSemverPatchPR = checkCommitMessageForPatch(allCommits[0]);
    // 3. If yes then ignore it otherwise adds it to the collection.
    if (isNotSemverPatchPR) {
      collection.push(pr);
    }

    // problem: since this cb function is async thus and so the collection's returned value is promise not the actual array
    // solution:
    //           i) rather than empty array, make it dummy promise & resolve it Promise.resolve([])
    //           ii) make a collection within reduce cb fn that can be extracted by resolving the passed Promise
    return collection;
    // }, Promise.resolve([]));
  }, Promise.resolve([]));
};


