"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryHeap = void 0;
class BinaryHeap {
    constructor(compare) {
        this.heap = [];
        this.compare = compare;
    }
    insert(value) {
        this.heap.push(value);
        this.siftUp(this.heap.length - 1);
    }
    extract() {
        if (this.heap.length === 0)
            return undefined;
        const top = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0 && end !== undefined) {
            this.heap[0] = end;
            this.siftDown(0);
        }
        return top;
    }
    peek() {
        return this.heap[0];
    }
    size() {
        return this.heap.length;
    }
    toArray() {
        return [...this.heap];
    }
    // Make the heap iterable
    [Symbol.iterator]() {
        let index = 0;
        const data = this.toArray();
        return {
            next() {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
    parent(i) {
        return Math.floor((i - 1) / 2);
    }
    left(i) {
        return 2 * i + 1;
    }
    right(i) {
        return 2 * i + 2;
    }
    siftUp(i) {
        while (i > 0 && this.compare(this.heap[i], this.heap[this.parent(i)]) < 0) {
            this.swap(i, this.parent(i));
            i = this.parent(i);
        }
    }
    siftDown(i) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const left = this.left(i);
            const right = this.right(i);
            if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) {
                smallest = left;
            }
            if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) {
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
}
exports.BinaryHeap = BinaryHeap;
//# sourceMappingURL=BinaryHeap.js.map