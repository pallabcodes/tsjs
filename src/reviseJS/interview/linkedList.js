class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(value) {
    const newNode = new Node(value);
    this.head = newNode;
    this.tail = this.head;
    this.length = 1;
  }
  push(value) {
    // pushing a new Node() to the tail
    const newNode = new Node(value);
    if (!this.head) {
      // when head property has falsy value then newNode will be the value for both head & tail property
      this.head = newNode;
      this.tail = newNode;
    } else {
      // now since head & tail both share same reference i.e. newNode, so updating next property here
      // will update next property on head too thus we see the latest newNode as next value on head property
      this.tail.next = newNode;
      // newNode will be tail now as it's last item now
      this.tail = newNode;
    }
    this.length++;
    return this;
  }
}

const linkedList = new LinkedList(1);
console.log(linkedList);
linkedList.push(2);
console.log(linkedList);
