// @ts-nocheck

class ThreadSafeQueue {
  constructor() {
    this.queue = [];
    this.lock = false; // Simple lock mechanism
  }

  // Adds an element to the queue in a thread-safe manner
  enqueue(element) {
    return new Promise((resolve, reject) => {
      while (this.lock) { } // Simulating lock wait
      this.lock = true;
      this.queue.push(element);
      this.lock = false;
      resolve();
    });
  }

  // Removes an element from the queue in a thread-safe manner
  dequeue() {
    return new Promise((resolve, reject) => {
      while (this.lock) { } // Simulating lock wait
      this.lock = true;
      if (this.queue.length === 0) {
        reject('Queue is empty');
      } else {
        const element = this.queue.shift();
        this.lock = false;
        resolve(element);
      }
    });
  }

  // Checks if the queue is empty
  isEmpty() {
    return this.queue.length === 0;
  }

  // Returns the current size of the queue
  currentSize() {
    return this.queue.length;
  }
}
