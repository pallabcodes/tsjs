// @ts-nocheck

/**
 * CircularQueue class represents a circular queue with fixed size.
 * It allows for enqueueing and dequeueing elements in a circular manner.
 */
class CircularQueue {
  /**
   * Creates an instance of CircularQueue.
   * @param {number} size - The maximum size of the queue.
   */
  constructor(size) {
    this.size = size;
    this.queue = new Array(size);
    this.front = 0;
    this.rear = 0;
    this.count = 0;
  }

  /**
   * Adds an element to the queue.
   * @param {*} element - The element to add to the queue.
   * @returns {boolean} - Returns true if the element is successfully added, false if the queue is full.
   */
  enqueue(element) {
    if (this.isFull()) {
      console.log("Queue is full!");
      return false;
    }
    this.queue[this.rear] = element;
    this.rear = (this.rear + 1) % this.size; // Wrap around if we reach the end
    this.count++;
    return true;
  }

  /**
   * Removes and returns an element from the front of the queue.
   * @returns {*} - The element that was removed from the queue.
   */
  dequeue() {
    if (this.isEmpty()) {
      console.log("Queue is empty!");
      return null;
    }
    const element = this.queue[this.front];
    this.front = (this.front + 1) % this.size; // Wrap around if we reach the end
    this.count--;
    return element;
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * @returns {*} - The element at the front of the queue.
   */
  peek() {
    if (this.isEmpty()) {
      console.log("Queue is empty!");
      return null;
    }
    return this.queue[this.front];
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} - Returns true if the queue is empty, false otherwise.
   */
  isEmpty() {
    return this.count === 0;
  }

  /**
   * Checks if the queue is full.
   * @returns {boolean} - Returns true if the queue is full, false otherwise.
   */
  isFull() {
    return this.count === this.size;
  }

  /**
   * Returns the current size of the queue.
   * @returns {number} - The number of elements currently in the queue.
   */
  currentSize() {
    return this.count;
  }

  /**
   * Clears the queue.
   */
  clear() {
    this.queue = new Array(this.size);
    this.front = 0;
    this.rear = 0;
    this.count = 0;
  }
}

// Example usage:
const queue = new CircularQueue(5);
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.dequeue());  // 1
console.log(queue.peek());     // 2
queue.enqueue(4);
console.log(queue.isFull());   // false
queue.clear();
console.log(queue.isEmpty());  // true
