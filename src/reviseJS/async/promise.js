// https://towardsdev.com/how-does-javascript-promise-work-under-the-hood-24fe991761f
// # JS is synchronous single thread language so,  how does it achieve asynchronicity?

// Promise is JavaScript object that handles async tasks, has these modes : pending : fulfilled : rejected
// read: https://www.twilio.com/blog/asynchronous-javascript-advanced-promises-chaining-collections-nodejs#:~:text=Promises%20with%20Node.-,js,the%20values%20returned%20by%20it.

// Promise instance takes a callback fn with two argument for resolve and reject
// as said new Promise takes a callback fn, and it returns a promise which is saved to a variable here to then-catch later
const promise = new Promise((resolve, _) => {
  const list = [1];
  setTimeout(() => {
    resolve(list);
  }, 100);
});

promise.then((data) => {
  console.log(data, [...data, 11]);
  return [...data, 11];
});

// using AND
console.log(true && false);
console.log(true && 1);
console.log("hello" && 11);
console.log(null && NaN && false && 0);

// race, any, all, settled, allSettled, then catch finally

// Promise.all(): wait for all promise to be settled or any promise to be rejected
// If any promise in a collection is rejected the result of the Promise.all method is a rejected promise with the rejection reason taken from the first failing promise
const play = Promise.resolve(`play`);
const games = Promise.reject(new Error(`some error has occurred`));
const quite = Promise.resolve(`quite`);
const moderately = Promise.resolve(`moderately`);

const promises = [play, games, quite, moderately];

Promise.all(promises)
  .then((results) => {
    results.forEach((result) => console.log(result.status));
  })
  .catch((reason) => console.error(`Error: ${reason}`));

// Promise.allSettled(): returns a promise that fulfills after all given promises have either fulfilled or rejected
// runs all promises then return results like this { status: 'fulfilled, value: }, {status: "rejected" , reasons: "foo"}
const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve, reject) =>
  setTimeout(reject, 100, "foo has an error")
);

const promises1 = [
  promise1,
  promise2,
  new Promise((resolve) => setTimeout(() => resolve(66), 1000)),
  10,
];

Promise.allSettled(promises1).then((results) =>
  results.forEach((result) => console.log(result.status))
);

/*
[
  {
    "status": "fulfilled",
    "value": 1
  },
  {
    "status": "rejected",
    "reason": "foo has an error"
  },
  {
    "status": "fulfilled",
    "value": 66
  },
  {
    "status": "fulfilled",
    "value": 10
  }
]
 */

const values = await Promise.allSettled([
  Promise.resolve(11),
  new Promise((resolve) => setTimeout(() => resolve(66), 0)),
  100,
  Promise.reject(new Error("it has an error")),
]);
console.log(values);

// [
//   {status: "fulfilled", value: 33},
//   {status: "fulfilled", value: 66},
//   {status: "fulfilled", value: 99},
//   {status: "rejected",  reason: Error: it has an error}
// ]

// Promise.race()

const promise11 = new Promise((resolve) => {
  setTimeout(resolve, 500, "one");
});

const promise22 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "two");
});

Promise.race([promise11, promise22]).then((value) => {
  console.log(value);
  // Both resolve, but promise22 is faster
});
// expected output: "two"

// # Promise.any()

const zero = Promise.reject(0);
const quick = new Promise((resolve) => setTimeout(resolve, 100, "fastest"));
const slow = new Promise((resolve) => setTimeout(resolve, 500, "slowly"));

const promisesByUsingAny = [zero, quick, slow];

Promise.any(promisesByUsingAny).then((data) => {
  console.log(data);
});

function know() {
  Promise.all(
    [1],
    setTimeout(() => {
      console.log("JS");
    }, 1000),
    Promise.reject("ERROR HERE")
  );
}

know()
  .then((r) => {
    console.log(r);
  })
  .catch((e) => {
    console.log(e);
  });

console.log(`start`);
setTimeout(() => console.log("timer"), 0);
Promise.resolve("resolved");
console.log(`done`);


