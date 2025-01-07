// @ts-nocheck

class AsyncQueue {
  constructor() {
    this.queue = [];
  }

  // Adds a task to the queue (which could be a promise)
  async enqueue(task) {
    this.queue.push(task);
  }

  // Processes and removes tasks from the queue asynchronously
  async processQueue() {
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await task();  // Waits for the task (promise) to resolve
    }
  }

  // Checks if the queue is empty
  isEmpty() {
    return this.queue.length === 0;
  }
}

// Example usage:
const asyncQueue = new AsyncQueue();
asyncQueue.enqueue(async () => {
  console.log("Task 1 started");
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Task 1 finished");
});
asyncQueue.enqueue(async () => {
  console.log("Task 2 started");
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Task 2 finished");
});
asyncQueue.processQueue();
