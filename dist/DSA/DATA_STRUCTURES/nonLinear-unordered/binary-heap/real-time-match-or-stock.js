"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A binary heap implementation for real-time matching or stock operations
 */
class PriorityQueue {
    constructor(isMinHeap = true) {
        this.heap = [];
        this.isMinHeap = isMinHeap;
    }
    /**
     * Get the parent index of a node
     */
    parent(index) {
        return Math.floor((index - 1) / 2);
    }
    /**
     * Get the left child index
     */
    leftChild(index) {
        return 2 * index + 1;
    }
    /**
     * Get the right child index
     */
    rightChild(index) {
        return 2 * index + 2;
    }
    /**
     * Check if first element has higher priority than second
     */
    hasHigherPriority(index1, index2) {
        if (this.isMinHeap) {
            return this.heap[index1].priority < this.heap[index2].priority;
        }
        else {
            return this.heap[index1].priority > this.heap[index2].priority;
        }
    }
    /**
     * Swap elements at two indices
     */
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
    /**
     * Move an element up the heap until heap property is satisfied
     */
    siftUp(index) {
        let currentIndex = index;
        let parentIndex = this.parent(currentIndex);
        // While we're not at root and parent has lower priority
        while (currentIndex > 0 && this.hasHigherPriority(currentIndex, parentIndex)) {
            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
            parentIndex = this.parent(currentIndex);
        }
    }
    /**
     * Move an element down the heap until heap property is satisfied
     */
    siftDown(index) {
        const size = this.heap.length;
        let currentIndex = index;
        let highestPriorityIndex = currentIndex;
        while (true) {
            const leftChildIndex = this.leftChild(currentIndex);
            const rightChildIndex = this.rightChild(currentIndex);
            // Check if left child has higher priority
            if (leftChildIndex < size && this.hasHigherPriority(leftChildIndex, highestPriorityIndex)) {
                highestPriorityIndex = leftChildIndex;
            }
            // Check if right child has higher priority
            if (rightChildIndex < size && this.hasHigherPriority(rightChildIndex, highestPriorityIndex)) {
                highestPriorityIndex = rightChildIndex;
            }
            // If current node has highest priority, we're done
            if (highestPriorityIndex === currentIndex) {
                break;
            }
            // Otherwise swap and continue
            this.swap(currentIndex, highestPriorityIndex);
            currentIndex = highestPriorityIndex;
        }
    }
    /**
     * Add an element to the priority queue
     */
    enqueue(value, priority) {
        this.heap.push({ value, priority });
        this.siftUp(this.heap.length - 1);
    }
    /**
     * Remove and return the highest priority element
     */
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop().value;
        }
        const top = this.heap[0].value;
        this.heap[0] = this.heap.pop();
        this.siftDown(0);
        return top;
    }
    /**
     * View the highest priority element without removing
     */
    peek() {
        return this.isEmpty() ? null : this.heap[0].value;
    }
    /**
     * Check if queue is empty
     */
    isEmpty() {
        return this.heap.length === 0;
    }
    /**
     * Get current size of queue
     */
    size() {
        return this.heap.length;
    }
}
exports.default = PriorityQueue;
//# sourceMappingURL=real-time-match-or-stock.js.map