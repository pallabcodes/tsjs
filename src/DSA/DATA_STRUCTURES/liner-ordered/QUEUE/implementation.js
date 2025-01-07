// @ts-nocheck

/**
 * Queue class represents a simple queue with operations to add and remove elements
 * following the First In, First Out (FIFO) principle.
 */
class Queue {
  /**
   * Creates an instance of the Queue.
   */
  constructor() {
    this.queue = [];
  }

  /**
   * Adds an element to the rear of the queue.
   * @param {*} element - The element to add to the queue.
   * @returns {boolean} - Returns true if the element is added successfully.
   */
  enqueue(element) {
    this.queue.push(element);
    return true;
  }

  /**
   * Removes and returns the element at the front of the queue.
   * @returns {*} - The element that was removed from the front of the queue.
   */
  dequeue() {
    if (this.isEmpty()) {
      console.log("Queue is empty!");
      return null;
    }
    return this.queue.shift();
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
    return this.queue[0];
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} - Returns true if the queue is empty, false otherwise.
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /**
   * Returns the current size of the queue.
   * @returns {number} - The number of elements in the queue.
   */
  currentSize() {
    return this.queue.length;
  }

  /**
   * Clears the queue.
   */
  clear() {
    this.queue = [];
  }
}

// Example usage:
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.dequeue());  // 1
console.log(queue.peek());     // 2
console.log(queue.isEmpty());  // false
queue.clear();
console.log(queue.isEmpty());  // true
