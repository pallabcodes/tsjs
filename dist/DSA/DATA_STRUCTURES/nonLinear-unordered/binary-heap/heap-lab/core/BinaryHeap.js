"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryHeap = void 0;
exports.createMinHeap = createMinHeap;
exports.createMaxHeap = createMaxHeap;
class BinaryHeap {
    constructor(compareFn, initialValues = []) {
        this.heap = [];
        this.compare = compareFn;
        if (initialValues.length > 0) {
            this.heap = [...initialValues];
            this.heapify();
        }
    }
    heapify() {
        // Start from the last parent node and move upwards
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
        let currentIndex = index;
        while (currentIndex > 0 && this.compare(this.heap[currentIndex], this.heap[this.parent(currentIndex)]) < 0) {
            this.swap(currentIndex, this.parent(currentIndex));
            currentIndex = this.parent(currentIndex);
        }
    }
    siftDown(index) {
        let currentIndex = index;
        const size = this.size();
        while (true) {
            let smallest = currentIndex;
            const leftIndex = this.left(currentIndex);
            const rightIndex = this.right(currentIndex);
            if (leftIndex < size && this.compare(this.heap[leftIndex], this.heap[smallest]) < 0) {
                smallest = leftIndex;
            }
            if (rightIndex < size && this.compare(this.heap[rightIndex], this.heap[smallest]) < 0) {
                smallest = rightIndex;
            }
            if (smallest === currentIndex)
                break;
            this.swap(currentIndex, smallest);
            currentIndex = smallest;
        }
    }
    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    toArray() {
        return [...this.heap];
    }
    [Symbol.iterator]() {
        let index = 0;
        const data = this.toArray(); // or this.heap if public
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
}
exports.BinaryHeap = BinaryHeap;
function createMinHeap(items = []) {
    return new BinaryHeap((a, b) => (a < b ? -1 : a > b ? 1 : 0), items);
}
function createMaxHeap(items = []) {
    return new BinaryHeap((a, b) => (a > b ? -1 : a < b ? 1 : 0), items);
}
const minHeap = createMinHeap();
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(8);
console.log(minHeap.extract()); // 3
console.log(minHeap.extract()); // 5
const maxHeap = createMaxHeap([10, 20, 15]);
console.log(maxHeap.extract()); // 20
//# sourceMappingURL=BinaryHeap.js.map