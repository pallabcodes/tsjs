"use strict";
// src/HeapWrapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryHeap = void 0;
exports.createMinHeap = createMinHeap;
exports.createMaxHeap = createMaxHeap;
class BinaryHeap {
    constructor(compareFn, initialValues = []) {
        this.compare = compareFn;
        this.heap = [...initialValues];
        if (this.heap.length > 0) {
            this.heapify();
        }
    }
    heapify() {
        for (let i = Math.floor(this.size() / 2) - 1; i >= 0; i--) {
            this.siftDown(i);
        }
    }
    size() {
        return this.heap.length;
    }
    isEmpty() {
        return this.size() === 0;
    }
    peek() {
        return this.isEmpty() ? undefined : this.heap[0];
    }
    insert(value) {
        this.heap.push(value);
        this.siftUp(this.size() - 1);
    }
    extract() {
        if (this.isEmpty())
            return undefined;
        const top = this.heap[0];
        const end = this.heap.pop();
        if (this.size() > 0 && end !== undefined) {
            this.heap[0] = end;
            this.siftDown(0);
        }
        return top;
    }
    parent(index) {
        return Math.floor((index - 1) / 2);
    }
    left(index) {
        return 2 * index + 1;
    }
    right(index) {
        return 2 * index + 2;
    }
    siftUp(index) {
        let i = index;
        while (i > 0 && this.compare(this.heap[i], this.heap[this.parent(i)]) < 0) {
            this.swap(i, this.parent(i));
            i = this.parent(i);
        }
    }
    siftDown(index) {
        let i = index;
        const size = this.size();
        while (true) {
            let smallest = i;
            const left = this.left(i);
            const right = this.right(i);
            if (left < size && this.compare(this.heap[left], this.heap[smallest]) < 0) {
                smallest = left;
            }
            if (right < size && this.compare(this.heap[right], this.heap[smallest]) < 0) {
                smallest = right;
            }
            if (smallest === i)
                break;
            this.swap(i, smallest);
            i = smallest;
        }
    }
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    toArray() {
        return [...this.heap];
    }
}
exports.BinaryHeap = BinaryHeap;
function createMinHeap(items = []) {
    return new BinaryHeap((a, b) => (a < b ? -1 : a > b ? 1 : 0), items);
}
function createMaxHeap(items = []) {
    return new BinaryHeap((a, b) => (a > b ? -1 : a < b ? 1 : 0), items);
}
//# sourceMappingURL=HeapWrapper.js.map