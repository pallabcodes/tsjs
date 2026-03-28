/**
 * Class representing a node in the Doubly Linked List.
 */
class DoublyLinkedListNode {
  /**
   * Creates a new node.
   * @param {any} value - The value of the node.
   * @param {DoublyLinkedListNode} [next=null] - The next node in the list.
   * @param {DoublyLinkedListNode} [prev=null] - The previous node in the list.
   */
  // @ts-ignore
  constructor(value = null, next = null, prev = null) {
      this.value = value;
      this.next = next;
      this.prev = prev;
  }
}

/**
* Class representing a Doubly Linked List (DLL).
*/
class DoublyLinkedList {
  /**
   * Creates a new Doubly Linked List.
   */
  constructor() {
      // @ts-ignore
      this.head = null; // Points to the first node in the list.
      this.tail = null; // Points to the last node in the list.
      this.size = 0; // Tracks the size of the list.
  }

  /**
   * Adds a new node with the specified value to the beginning of the list.
   * @param {any} value - The value to be added.
   * @returns {DoublyLinkedList} The current list instance.
   */
  prepend(value) {
      // @ts-ignore
      const newNode = new DoublyLinkedListNode(value, this.head, null);

      if (this.size === 0) {
          this.head = newNode;
          this.tail = newNode;
      } else {
          this.head.prev = newNode;
          this.head = newNode;
      }

      this.size++;
      return this;
  }

  /**
   * Adds a new node with the specified value to the end of the list.
   * @param {any} value - The value to be added.
   * @returns {DoublyLinkedList} The current list instance.
   */
  append(value) {
      // @ts-ignore
      const newNode = new DoublyLinkedListNode(value, null, this.tail);

      if (this.size === 0) {
          this.head = newNode;
          this.tail = newNode;
      } else {
          this.tail.next = newNode;
          this.tail = newNode;
      }

      this.size++;
      return this;
  }

  /**
   * Inserts a new node with the specified value at a given index.
   * @param {any} value - The value to be inserted.
   * @param {number} index - The index where the value should be inserted.
   * @returns {DoublyLinkedList} The current list instance.
   */
  insert(value, index) {
      const normalizedIndex = index < 0 ? 0 : index;

      if (normalizedIndex === 0) {
          this.prepend(value);
      } else if (normalizedIndex === this.size) {
          this.append(value);
      } else {
          let currentNode = this.head;
          let count = 0;
          const newNode = new DoublyLinkedListNode(value);

          while (count < normalizedIndex) {
              currentNode = currentNode.next;
              count++;
          }

          newNode.next = currentNode;
          newNode.prev = currentNode.prev;
          currentNode.prev.next = newNode;
          currentNode.prev = newNode;

          this.size++;
      }

      return this;
  }

  /**
   * Deletes the head node from the list.
   * @returns {DoublyLinkedListNode|null} The deleted node or null if the list is empty.
   */
  deleteHead() {
      if (this.size === 0) return null;

      const deletedNode = this.head;

      if (this.size === 1) {
          this.head = null;
          this.tail = null;
      } else {
          this.head = this.head.next;
          this.head.prev = null;
      }

      this.size--;
      return deletedNode;
  }

  /**
   * Deletes the tail node from the list.
   * @returns {DoublyLinkedListNode|null} The deleted node or null if the list is empty.
   */
  deleteTail() {
      if (this.size === 0) return null;

      const deletedNode = this.tail;

      if (this.size === 1) {
          this.head = null;
          this.tail = null;
      } else {
          this.tail = this.tail.prev;
          this.tail.next = null;
      }

      this.size--;
      return deletedNode;
  }

  /**
   * Deletes a node with the specified value from the list.
   * @param {any} value - The value to be deleted.
   * @returns {DoublyLinkedListNode|null} The deleted node or null if the value is not found.
   */
  delete(value) {
      if (this.size === 0) return null;

      let currentNode = this.head;

      // Handle the case where the value to delete is the head node
      if (currentNode.value === value) {
          return this.deleteHead();
      }

      // Traverse to find the node to delete
      while (currentNode !== this.tail && currentNode.value !== value) {
          currentNode = currentNode.next;
      }

      if (currentNode === this.tail && currentNode.value === value) {
          return this.deleteTail();
      }

      if (currentNode.value === value) {
          currentNode.prev.next = currentNode.next;
          currentNode.next.prev = currentNode.prev;
          this.size--;
          return currentNode;
      }

      return null; // Value not found
  }

  /**
   * Converts the linked list to an array representation.
   * @returns {Array<number>} An array of node values from head to tail.
   */
  toArray() {
      const nodes = [];
      let currentNode = this.head;
      while (currentNode) {
          nodes.push(currentNode.value);
          currentNode = currentNode.next;
      }
      return nodes;
  }

  /**
   * Converts the linked list to a string representation.
   * @param {function} [callback] - An optional callback function to format each node's value.
   * @returns {string} A string representation of the linked list.
   */
  toString(callback) {
      // @ts-ignore
      return this.toArray().map(node => node.toString(callback)).toString();
  }

  /**
   * Converts the linked list to an array representation, traversing in reverse order.
   * @returns {Array<number>} An array of node values from tail to head.
   */
  toArrayReverse() {
      const nodes = [];
      let currentNode = this.tail;
      while (currentNode) {
          nodes.push(currentNode.value);
          currentNode = currentNode.prev;
      }
      return nodes;
  }
}

// Example usage
const dll = new DoublyLinkedList();
dll.append(1);
dll.append(2);
dll.append(3);
dll.append(4);
console.log(dll.toArray()); // [1, 2, 3, 4]

dll.delete(2);
console.log(dll.toArray()); // [1, 3, 4]

dll.deleteHead();
console.log(dll.toArray()); // [3, 4]

dll.deleteTail();
console.log(dll.toArray()); // [3]

dll.prepend(5);
console.log(dll.toArray()); // [5, 3]

console.log(dll.toArrayReverse()); // [3, 5]
