Users/piconkayal/Projects/Personal/tsjs/src/DSA/DATA_STRUCTURES/liner-ordered/LINKEDLIST/SINGLY LINKEDLIST/implementation.ts
class Node<T> {
  data: T;
  next: Node<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

/**
 * Represents a linked list.
 */
class LinkedList<T> {
  head: Node<T> | null;

  constructor() {
    this.head = null;
  }

  // Add other methods like insert, etc.

  delete(value: T): boolean | null {
    // Case 1: If the list is empty, then return null
    if (!this.head) {
      console.error('No deletion on an empty array, fool');
      return null;
    }

    // Case 2: If value is at the head
    if (this.head.data === value) {
      this.head = this.head.next;
      return true;
    }

    // Case 3 & 4: Value in middle/end (handles first occurrence)
    let current = this.head;
    while (current.next) {
      if (current.next.data === value) {
        current.next = current.next.next;
        return true;
      }
      current = current;
    }

    return false; // Value not found
  }
}

export default LinkedList;