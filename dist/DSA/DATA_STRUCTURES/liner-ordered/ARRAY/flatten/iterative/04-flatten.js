"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenWithLinkedListQueue = flattenWithLinkedListQueue;
exports.flattenWithLinkedListStack = flattenWithLinkedListStack;
/**
 * Minimal singly linked list node for stack/queue
 */
class ListNode {
    constructor(value) {
        this.next = null;
        this.value = value;
    }
}
/**
 * Linked list based queue (FIFO)
 */
class LinkedListQueue {
    constructor() {
        this.head = null;
        this.tail = null;
    }
    enqueue(value) {
        const node = new ListNode(value);
        if (!this.tail) {
            this.head = this.tail = node;
        }
        else {
            this.tail.next = node;
            this.tail = node;
        }
    }
    dequeue() {
        if (!this.head)
            return undefined;
        const value = this.head.value;
        this.head = this.head.next;
        if (!this.head)
            this.tail = null;
        return value;
    }
    isEmpty() {
        return this.head === null;
    }
}
/**
 * Flattens a nested array using a queue implemented with a linked list.
 * This preserves strict left-to-right order (like recursion or stack-based DFS).
 */
function flattenWithLinkedListQueue(input) {
    const queue = new LinkedListQueue();
    const result = [];
    // Enqueue all input elements
    for (const item of input)
        queue.enqueue(item);
    while (!queue.isEmpty()) {
        const elem = queue.dequeue();
        if (Array.isArray(elem)) {
            // Enqueue array elements in order
            for (const item of elem)
                queue.enqueue(item);
        }
        else {
            result.push(elem);
        }
    }
    return result;
}
/**
 * Minimal singly linked list based stack (LIFO)
 */
class LinkedListStack {
    constructor() {
        this.head = null;
    }
    push(value) {
        const node = new ListNode(value);
        node.next = this.head;
        this.head = node;
    }
    pop() {
        if (!this.head)
            return undefined;
        const value = this.head.value;
        this.head = this.head.next;
        return value;
    }
    isEmpty() {
        return this.head === null;
    }
}
/**
 * Flattens a nested array using a stack implemented with a linked list.
 * This also preserves strict left-to-right order.
 */
function flattenWithLinkedListStack(input) {
    const stack = new LinkedListStack();
    const result = [];
    // Push input elements onto stack in reverse order
    for (let i = input.length - 1; i >= 0; i--) {
        stack.push(input[i]);
    }
    while (!stack.isEmpty()) {
        const elem = stack.pop();
        if (Array.isArray(elem)) {
            // Push array elements in reverse order
            for (let i = elem.length - 1; i >= 0; i--) {
                stack.push(elem[i]);
            }
        }
        else {
            result.push(elem);
        }
    }
    return result;
}
// Example usage:
const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenWithLinkedListQueue(nested)); // [1, 2, 3, 4, 5, 6, 7]
console.log(flattenWithLinkedListStack(nested)); // [1, 2, 3, 4, 5, 6, 7]
//# sourceMappingURL=04-flatten.js.map