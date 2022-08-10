class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Stack {
  constructor(value) {
    const newNode = new Node(value);
    this.top = newNode; // it has top rather than head
    // this.bottom = newNode;
    this.length = 1;
  }
  push(value) {
    const newNode = new Node(value);
    // add value ontop  of last value (new value) ↓ 11 ↓ 2 ↓ 25 ↓ 4
    if (this.length === 0) {
      this.top = newNode;
    } else {
      newNode.next = this.top;
      this.top = newNode;
    }
    this.length++;
    return this;
  }
  pop() {
    if (this.length === 0) return undefined;
    let temp = this.top;
    this.top = this.top.next;
    temp.next = null;

    this.length--;
    return temp;
  }
}
const stack = new Stack(1);
console.log(stack);

class Queue {
  constructor(value) {
    const newNode = new Node(value); // { value, next }
    this.first = newNode;
    this.last = this.first;
    this.length = 1
  }
  enqueue(value) {
    // adding new Node(value) from the back side kinda like array push
    const newNode = new Node(value);
    if(this.length === 0) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    this.length++;
    return this;
  }
  dequeue() {
    if (!this.length) return undefined;
    // removing from the front/head side
    let temp = this.first;
    if (this.length === 1) {
      this.last = null;
    } else {
      this.first = this.first.next;
      temp.next = null;
    }
    this.length--;
    return temp;
  }
}

const queue = new Queue(1);
queue.enqueue(2);
console.log(queue);
queue.dequeue();
console.log(queue);
