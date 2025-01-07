// @ts-nocheck

/**
 * Deque class represents a double-ended queue (deque) with operations
 * to add or remove elements from both ends.
 */
class Deque {
  /**
   * Creates an instance of the Deque.
   * @param {number} size - The maximum size of the deque.
   */
  constructor(size) {
    this.size = size;
    this.deque = [];
  }

  /**
   * Adds an element to the front of the deque.
   * @param {*} element - The element to add to the front.
   * @returns {boolean} - Returns true if the element is added, false if the deque is full.
   */
  addFront(element) {
    if (this.isFull()) {
      console.log("Deque is full!");
      return false;
    }
    this.deque.unshift(element);
    return true;
  }

  /**
   * Adds an element to the rear of the deque.
   * @param {*} element - The element to add to the rear.
   * @returns {boolean} - Returns true if the element is added, false if the deque is full.
   */
  addRear(element) {
    if (this.isFull()) {
      console.log("Deque is full!");
      return false;
    }
    this.deque.push(element);
    return true;
  }

  /**
   * Removes and returns an element from the front of the deque.
   * @returns {*} - The element that was removed from the front.
   */
  removeFront() {
    if (this.isEmpty()) {
      console.log("Deque is empty!");
      return null;
    }
    return this.deque.shift();
  }

  /**
   * Removes and returns an element from the rear of the deque.
   * @returns {*} - The element that was removed from the rear.
   */
  removeRear() {
    if (this.isEmpty()) {
      console.log("Deque is empty!");
      return null;
    }
    return this.deque.pop();
  }

  /**
   * Returns the element at the front of the deque without removing it.
   * @returns {*} - The element at the front of the deque.
   */
  peekFront() {
    if (this.isEmpty()) {
      console.log("Deque is empty!");
      return null;
    }
    return this.deque[0];
  }

  /**
   * Returns the element at the rear of the deque without removing it.
   * @returns {*} - The element at the rear of the deque.
   */
  peekRear() {
    if (this.isEmpty()) {
      console.log("Deque is empty!");
      return null;
    }
    return this.deque[this.deque.length - 1];
  }

  /**
   * Checks if the deque is empty.
   * @returns {boolean} - Returns true if the deque is empty, false otherwise.
   */
  isEmpty() {
    return this.deque.length === 0;
  }

  /**
   * Checks if the deque is full.
   * @returns {boolean} - Returns true if the deque is full, false otherwise.
   */
  isFull() {
    return this.deque.length === this.size;
  }

  /**
   * Returns the current size of the deque.
   * @returns {number} - The number of elements currently in the deque.
   */
  currentSize() {
    return this.deque.length;
  }

  /**
   * Clears the deque.
   */
  clear() {
    this.deque = [];
  }
}

// Example usage:
const deque = new Deque(5);
deque.addRear(1);
deque.addFront(2);
deque.addRear(3);
console.log(deque.removeFront());  // 2
console.log(deque.removeRear());   // 3
console.log(deque.peekFront());    // 1
console.log(deque.peekRear());     // 1
deque.clear();
console.log(deque.isEmpty());      // true
