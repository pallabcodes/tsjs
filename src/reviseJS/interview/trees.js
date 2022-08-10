class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  insert(value) {
    // make a new Node(value) → let temp = this.root → loop → alter temp to move left/right
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    let temp = this.root;
    // keep lopping until temp isn't become falsy (i.e here null)
    while (temp) {
      if (newNode.value === temp.value) return undefined;
      if (newNode.value < temp.value) {
        // see if the left spot open (here assumed open/empty i.e null)
        if (temp.left === null) {
          temp.left = newNode;
          return this;
        }
        temp = temp.left;
      } else {
        // see if the right spot open (here assumed open/empty i.e null)
        if (temp.right === null) {
          temp.right = newNode;
          return this;
        }
        temp = temp.right;
      }
    }
  }
  contains(value) {
    if (this.root === null) return false;
    let temp = this.root;
    while (temp) {
      if (value < temp.value) {
        //   any given value < null will always be false
        temp = temp.left;
      } else if (value > temp.value) {
        //   any given value > null will always be false
        temp = temp.right;
      } else {
        //   thus this else run at the end to return true
        return true;
      }
    }
    return false;
  }
  BFS() {
    let currentNode = this.root;
    let results = [];
    let queue = [];
    queue.push(currentNode);
    while (queue.length) {
      currentNode = queue.shift();
      results.push(currentNode.value);
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }
    return results;
  }
  DFSPreOrder() {
    let results = [];
    function traverse(currentNode) {
      results.push(currentNode.value);
      if (currentNode.left) traverse(currentNode.left);
      if (currentNode.right) traverse(currentNode.right);
    }
    traverse(this.root);
    return results;
  }
  DFSPostOrder() {
    let results = [];
    function traverse(currentNode) {
      if (currentNode.left) traverse(currentNode.left);
      if (currentNode.right) traverse(currentNode.right);
      results.push(currentNode.value);
    }
    traverse(this.root);
    return results;
  }
  DFSInOrder() {
    let results = [];
    function traverse(currentNode) {
      if (currentNode.left) traverse(currentNode.left);
      results.push(currentNode.value);
      if (currentNode.right) traverse(currentNode.right);
    }
    traverse(this.root);
    return results;
  }
}
const bst = new BST();
bst.insert(47);
bst.insert(21);
bst.insert(76);
bst.insert(18);
bst.insert(27);
bst.insert(52);
bst.insert(82);
console.log(bst.BFS());
console.log(bst.DFSPreOrder());
console.log(bst.DFSPostOrder());
console.log(bst.DFSInOrder());
