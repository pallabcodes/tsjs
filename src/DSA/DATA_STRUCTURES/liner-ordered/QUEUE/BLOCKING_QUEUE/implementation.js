// @ts-nocheck

class BlockingQueue {
  constructor(capacity) {
    this.queue = [];
    this.capacity = capacity;
    this.resolve = null;
  }

  // Adds an element to the queue, blocks if the queue is full
  enqueue(element) {
    return new Promise((resolve, reject) => {
      if (this.queue.length >= this.capacity) {
        this.resolve = resolve;
      } else {
        this.queue.push(element);
        resolve();
      }
    });
  }

  // Removes an element from the queue, blocks if the queue is empty
  dequeue() {
    return new Promise((resolve, reject) => {
      if (this.queue.length === 0) {
        reject('Queue is empty');
      } else {
        const element = this.queue.shift();
        resolve(element);
        if (this.resolve) {
          this.resolve();
        }
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

// Example usage:
const blockingQueue = new BlockingQueue(2);
blockingQueue.enqueue(1).then(() => {
  console.log("Element added");
});
blockingQueue.enqueue(2).then(() => {
  console.log("Element added");
});
blockingQueue.enqueue(3).then(() => {
  console.log("Element added");
});
blockingQueue.dequeue().then((el) => console.log(el));  // Removes 1
