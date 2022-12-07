// ## Asynchronous iteration https://2ality.com/2016/10/asynchronous-iteration.html
// https://javascript.plainenglish.io/promise-all-vs-promise-allsettled-vs-for-await-of-c32e1a327a20#:~:text=Use%20for%20await%20of%20if,need%20all%20calls%20to%20succeed.


// for await of resolve async tasks one at a time, so the loop could be break, continue by specific value(s)
// Promise.all() would create all given promises at the same time & only complete when all are resolve or fails when one of them are rejected
// Promise.allSettled(): same as Promise.all() but it doesn't stop/fail when one of the promise is rejected

// for await of with rejections

const fetchJobs = async () => {
https://www.stackfive.io/work/javascript/using-async-await-with-the-array-reduce-method
  const locations = [ 'toronto', 'vancouver', 'boston' ];

  return await locations.reduce(async (previousPromise, location) => {
    // just in case if previousValue isn't already the first resolve to get actual value via "await"

    let jobsArray = await previousPromise;

    // do the async task
    const jobPostingsCall = await fetch(`https://jobs.github.com/positions.json?description=javascript&location=${location}` );
    const jobPostings = await jobPostingsCall.json();

    // so now "push" method could be used and then return
    jobsArray.push({
      location,
      jobPostings,
    });

    return jobsArray;
  }, Promise.resolve([]));
}


// async / await with reduce

const list = [1, 2];

// @ts-ignore
async function printFiles () {
  const files = await getFilePaths();

  await files.reduce(async (promise, file) => {
    // the initialValue is Promise.Resolve([]) which returns a Promise<[]> then it resolved with await so []
    const myArr = await promise;
    // do something = make the asynchronous call
    const contents = await fs.readFile(file, 'utf8');
    console.log(contents);
    // myArr = [], contents = {.....}
    // return [...myArr, ...contents] or return
  }, Promise.resolve([]));
}

// const data = list.reduce<any>(reduceFn, Promise.resolve());

// const data = list.reduce(useReduce, <string[]>[]); list.reduce(useReduce, [] as string[])


// async loop with for of

// async function printFiles () {
//   const files = await getFilePaths();
//   for(const file of files) {
//     const contetns = await fs.readFile(file, "utf8");
//     console.log(contetns);
//   }
// }

// parallel async looping with Promise.all or Promise.allSettled

// async function printFiles() {
//   const files = await getFilePaths();
//
//   for await (const contents of files.map(file => fs.readFile(file, "utf8"))) {
//     console.log(contents);
//   }
// }

// for await for looping async tasks

// for await (const results of array) {
//   await longRunningTask()
// }
//
// console.log('I will wait')
