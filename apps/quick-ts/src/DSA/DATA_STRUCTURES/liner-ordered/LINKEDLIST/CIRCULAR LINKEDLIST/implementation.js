class CircularLinkedListNode {
  constructor(value = null, next = null) {
      this.value = value;
      this.next = next;
  }
}

class CircularLinkedList {
  constructor() {
      this.head = null;
      this.tail = null;
      this.size = 0;
  }

  // Adds a new node with the specified value to the beginning of the list
  prepend(value) {
      const newNode = new CircularLinkedListNode(value);

      if (this.size === 0) {
          this.head = newNode;
          this.tail = newNode;
          newNode.next = this.head; // Point to head, forming a circular link
      } else {
          newNode.next = this.head;
          this.head = newNode;
          this.tail.next = this.head; // Ensure the tail still points to head
      }

      this.size++;
      return this;
  }

  // Adds a new node with the specified value to the end of the list
  append(value) {
      const newNode = new CircularLinkedListNode(value);

      if (this.size === 0) {
          this.head = newNode;
          this.tail = newNode;
          newNode.next = this.head; // Circular link
      } else {
          this.tail.next = newNode;
          this.tail = newNode;
          this.tail.next = this.head; // Circular link
      }

      this.size++;
      return this;
  }

  // Inserts a new node with the specified value at a given index
  insert(value, index) {
      const normalizedIndex = index < 0 ? 0 : index;

      if (normalizedIndex === 0) {
          this.prepend(value);
      } else if (normalizedIndex === this.size) {
          this.append(value);
      } else {
          let currentNode = this.head;
          let count = 0;
          const newNode = new CircularLinkedListNode(value);

          while (count < normalizedIndex - 1) {
              currentNode = currentNode.next;
              count++;
          }

          newNode.next = currentNode.next;
          currentNode.next = newNode;

          this.size++;
      }

      return this;
  }

  // Deletes the head node
  deleteHead() {
      if (this.size === 0) return null;

      const deletedNode = this.head;

      if (this.size === 1) {
          this.head = null;
          this.tail = null;
      } else {
          this.head = this.head.next;
          this.tail.next = this.head; // Keep circular reference
      }

      this.size--;
      return deletedNode;
  }

  // Deletes the tail node
  deleteTail() {
      if (this.size === 0) return null;

      let currentNode = this.head;
      while (currentNode.next !== this.tail) {
          currentNode = currentNode.next;
      }

      const deletedNode = this.tail;
      this.tail = currentNode;
      this.tail.next = this.head; // Keep circular reference

      this.size--;
      return deletedNode;
  }

  // Deletes a node with a specific value
  delete(value) {
      if (this.size === 0) return null;

      let currentNode = this.head;
      let previousNode = null;

      // Handle the case where the value to delete is the head node
      if (currentNode.value === value) {
          return this.deleteHead();
      }

      // Traverse to find the node to delete
      while (currentNode !== this.tail && currentNode.value !== value) {
          previousNode = currentNode;
          currentNode = currentNode.next;
      }

      if (currentNode === this.tail && currentNode.value === value) {
          return this.deleteTail();
      }

      if (currentNode.value === value) {
          previousNode.next = currentNode.next;
          this.size--;
          return currentNode;
      }

      return null; // Value not found
  }

  // Converts the linked list to an array
  toArray() {
      const nodes = [];
      if (this.size === 0) return nodes;

      let currentNode = this.head;
      do {
          nodes.push(currentNode.value);
          currentNode = currentNode.next;
      } while (currentNode !== this.head);

      return nodes;
  }

  // Converts the linked list to a string representation
  toString(callback) {
      return this.toArray().map(node => node.toString(callback)).toString();
  }
}

// Example usage
const cll = new CircularLinkedList();
cll.append(1);
cll.append(2);
cll.append(3);
cll.append(4);
console.log(cll.toArray()); // [1, 2, 3, 4]

cll.delete(2);
console.log(cll.toArray()); // [1, 3, 4]

cll.deleteHead();
console.log(cll.toArray()); // [3, 4]

cll.deleteTail();
console.log(cll.toArray()); // [3]

cll.prepend(5);
console.log(cll.toArray()); // [5, 3]
