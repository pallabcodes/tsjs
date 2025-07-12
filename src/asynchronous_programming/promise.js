createPromise(0).then(response => response).then(data => data * 10).then(multiplied => console.log(`multiplied: ${multiplied}`));

console.log("start");


Promise.resolve(2).then(() => console.log(2));
Promise.resolve(5)
  .then(x => x * 2)
  .then(x => Promise.resolve(x + 1))
  .then(console.log); // 11


function createPromise (delay = 0) {
    return new Promise ((resolve) => {
        console.log(`This console.log is sync, so it will print first`);
        setTimeout(() => {
            resolve(10);
        }, delay);
        
    });
}

// createPromise(0).then(response => console.log("response: ", response));


Promise.all([Promise.resolve(1), Promise.resolve(2)]).then(console.log); // [1, 2]

Promise.race([
  new Promise(res => setTimeout(() => res('A'), 100)),
  new Promise(res => setTimeout(() => res('B'), 50))
]).then(console.log); // 'B'

Promise.any([
  Promise.reject('fail'),
  Promise.resolve('success')
]).then(console.log); // 'success'

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject('err')
]).then(console.log); // [{status: 'fulfilled', value: 1}, {status: 'rejected', reason: 'err'}]


console.log("end");

function promisify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, data) => err ? reject(err) : resolve(data));
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

const tasks = [1, 2, 3];
tasks.reduce((p, n) => p.then(() => Promise.resolve(n).then(console.log)), Promise.resolve());

async function parallelLimit(tasks, limit) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array(limit).fill(0).map(worker));
  return results;
}

// Usage:
const jobs = [1,2,3,4,5].map(n => () => new Promise(res => setTimeout(() => res(n), 100)));
parallelLimit(jobs, 2).then(console.log);

Promise.resolve('done')
  .finally(() => console.log('cleanup'))
  .then(console.log);

const batch = [Promise.resolve(1), Promise.reject('fail')];
Promise.allSettled(batch).then(results => {
  results.forEach(r => {
    if (r.status === 'fulfilled') console.log('Success:', r.value);
    else console.log('Error:', r.reason);
  });
});

async function doWork() {
  try {
    const data = await Promise.resolve(42);
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    console.log('Always runs');
  }
}
doWork();

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
delay(500).then(() => console.log('Waited 500ms'));

async function promisePool(tasks, poolLimit) {
  const ret = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    ret.push(p);
    if (poolLimit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) await Promise.race(executing);
    }
  }
  return Promise.all(ret);
}

const origThen = Promise.prototype.then;
Promise.prototype.then = function (...args) {
  console.log('Promise then called');
  return origThen.apply(this, args);
};

Promise.resolve('immediate').then(console.log);
Promise.reject('fail').catch(console.error);

function eventPromise() {
  let resolve;
  const p = new Promise(res => { resolve = res; });
  setTimeout(() => resolve('event fired!'), 1000);
  return p;
}
eventPromise().then(console.log);

function allFulfilled(promises) {
  return Promise.allSettled(promises).then(results =>
    results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
  );
}

// Usage:
allFulfilled([
  Promise.resolve(1),
  Promise.reject('fail'),
  Promise.resolve(3)
]).then(console.log); // [1, 3]

function allSettledWithErrors(promises) {
  return Promise.allSettled(promises).then(results => {
    const errors = results.filter(r => r.status === 'rejected').map(r => r.reason);
    const values = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    return { values, errors };
  });
}

// Usage:
allSettledWithErrors([
  Promise.resolve('ok'),
  Promise.reject('bad'),
  Promise.resolve('fine')
]).then(({ values, errors }) => {
  console.log('Values:', values); // ['ok', 'fine']
  console.log('Errors:', errors); // ['bad']
});

function customAny(promises) {
  return Promise.allSettled(promises).then(results => {
    const fulfilled = results.find(r => r.status === 'fulfilled');
    if (fulfilled) return fulfilled.value;
    throw new AggregateError(results.map(r => r.reason), 'All promises were rejected');
  });
}

// Usage:
customAny([
  Promise.reject('fail'),
  Promise.resolve('success')
]).then(console.log); // 'success'

async function promiseBatch(items, batchSize, asyncFn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    // Map each item to a promise and wait for all in the batch
    const batchResults = await Promise.all(batch.map(asyncFn));
    results.push(...batchResults);
  }
  return results;
}

// Usage example:
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
promiseBatch(nums, 3, n =>
  new Promise(res => setTimeout(() => res(n * 2), 100))
).then(console.log); // [2, 4, 6, 8, 10, 12, 14, 16, 18]

const EventEmitter = require('events');

// 1. Promise with EventEmitter
// Integrate Promises with Node.js EventEmitter for event-driven async flows:

function promiseWithEvent(emitter, event) {
  return new Promise((resolve, reject) => {
    emitter.once(event, resolve);
    emitter.once('error', reject);
  });
}

// Usage:
const emitter = new EventEmitter();
promiseWithEvent(emitter, 'done').then(data => console.log('Event data:', data));
setTimeout(() => emitter.emit('done', 'finished!'), 500);

// 2. Promise with Queue Processing
// Process tasks in a queue, one at a time (or with concurrency):

class PromiseQueue {
  constructor(concurrency = 1) {
    this.queue = [];
    this.running = 0;
    this.concurrency = concurrency;
  }
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve, reject));
      this.next();
    });
  }
  next() {
    if (this.running >= this.concurrency || !this.queue.length) return;
    this.running++;
    const fn = this.queue.shift();
    fn().finally(() => {
      this.running--;
      this.next();
    });
  }
}

// Usage:
const q = new PromiseQueue(2);
for (let i = 1; i <= 5; i++) {
  q.add(() => new Promise(res => setTimeout(() => {
    console.log('Processed', i);
    res(i);
  }, 200 * i)));
}

// 3. Promise with Streaming (Readable Stream to Promise)
// Consume a Node.js Readable stream as a Promise (collect all data):

const { Readable } = require('stream');

function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString()));
    stream.on('error', reject);
  });
}

// Usage:
const readable = Readable.from(['Hello ', 'World!']);
streamToPromise(readable).then(console.log); // 'Hello World!'