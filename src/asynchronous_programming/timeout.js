function longRunningTask() {
    console.info(`Task started at: ${new Date().toLocaleTimeString()}`);

    const taskDuration = Math.random() * 4000 + 2000;

    setTimeout(() => {
        console.info(`current task finished at:${ new Date().toLocaleTimeString()}`)

        // now, wait for fixed 1000ms then start the next `longRunningTask`

        setTimeout(longRunningTask, 1000);

    }, taskDuration);

}

// 1. Promise-based Timeout Utility

function timeoutPromise(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

// Usage:
timeoutPromise(
  new Promise(res => setTimeout(() => res('done!'), 2000)),
  1000
).then(console.log).catch(console.error); // Error: Timeout


longRunningTask();


// 2. AbortController with Timeout (for fetch, etc.)
async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await res.text();
  } finally {
    clearTimeout(id);
  }
}

// Usage (in Node.js 18+ or browser):
// fetchWithTimeout('https://example.com', 1000).then(console.log).catch(console.error);

// 3. Retry Function with Timeout
async function retryWithTimeout(fn, ms, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await timeoutPromise(fn(), ms);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retrying... (${i + 1})`);
    }
  }
}

// Usage:
retryWithTimeout(
  () => new Promise(res => setTimeout(() => res('ok'), 1500)),
  1000,
  2
).then(console.log).catch(console.error);

// 4. Delay Function
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// Usage:
async function run() {
  console.log('Start');
  await delay(1000);
  console.log('After 1 second');
}
run();

// 5. Event with Timeout
const EventEmitter = require('events');
function eventWithTimeout(emitter, event, ms) {
  return timeoutPromise(
    new Promise(res => emitter.once(event, res)),
    ms
  );
}

// Usage:
const emitter = new EventEmitter();
eventWithTimeout(emitter, 'done', 1000)
  .then(data => console.log('Event:', data))
  .catch(console.error);
setTimeout(() => emitter.emit('done', 'finished!'), 500);

// 6. Batch Processing with Timeout
async function batchWithTimeout(tasks, ms) {
  return Promise.all(tasks.map(task => timeoutPromise(task(), ms)));
}

// Usage:
batchWithTimeout([
  () => new Promise(res => setTimeout(() => res(1), 500)),
  () => new Promise(res => setTimeout(() => res(2), 1500))
], 1000).then(console.log).catch(console.error); // Second will timeout