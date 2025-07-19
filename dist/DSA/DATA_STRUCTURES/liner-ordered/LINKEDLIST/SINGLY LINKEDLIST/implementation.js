"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Users / piconkayal / Projects / Personal / tsjs / src / DSA / DATA_STRUCTURES / liner - ordered / LINKEDLIST / SINGLY;
LINKEDLIST / implementation.ts;
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}
/**
 * Represents a linked list.
 */
class LinkedList {
    constructor() {
        this.head = null;
    }
    // Add other methods like insert, etc.
    delete(value) {
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
exports.default = LinkedList;
//# sourceMappingURL=implementation.js.map