type Comparator<T> = (a: T, b: T) => number;

export class BinaryHeap<T> {
    private heap: T[];
    private compare: Comparator<T>;

    constructor(compareFn: Comparator<T>, initialValues: T[] = []) {
        this.heap = [];
        this.compare = compareFn;

        if (initialValues.length > 0) {
            this.heap = [...initialValues];
            this.heapify();
        }
    }

    private heapify(): void {
        // Start from the last parent node and move upwards
        for (let i = Math.floor(this.size() / 2) - 1; i >= 0; i--) {
            this.siftDown(i);
        }
    }

    public size(): number {
        return this.heap.length;
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public peek(): T | undefined {
        return this.isEmpty() ? undefined : this.heap[0];
    }

    public insert(value: T): void {
        this.heap.push(value);
        this.siftUp(this.size() - 1);
    }

    public extract(): T | undefined {
        if (this.isEmpty()) return undefined;

        const top = this.heap[0];
        const end = this.heap.pop();

        if (this.size() > 0 && end !== undefined) {
            this.heap[0] = end;
            this.siftDown(0);
        }

        return top;
    }

    private parent(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private left(index: number): number {
        return 2 * index + 1;
    }

    private right(index: number): number {
        return 2 * index + 2;
    }

    private siftUp(index: number): void {
        let currentIndex = index;
        

        while (currentIndex > 0 && this.compare(this.heap[currentIndex], this.heap[this.parent(currentIndex)]) < 0) {
            this.swap(currentIndex, this.parent(currentIndex));
            currentIndex = this.parent(currentIndex);
        }

    }

    private siftDown(index: number): void {
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

            if (smallest === currentIndex) break;

            this.swap(currentIndex, smallest);
            currentIndex = smallest;
        }
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    public toArray(): T[] {
        return [...this.heap];
    }

    [Symbol.iterator](): Iterator<T> {
        let index = 0;
        const data = this.toArray(); // or this.heap if public
        return {
            next(): IteratorResult<T> {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                } else {
                    return { value: undefined as any, done: true };
                }
            }
        };
    }
}

export function createMinHeap<T>(items: T[] = []): BinaryHeap<T> {
  return new BinaryHeap<T>((a, b) => (a < b ? -1 : a > b ? 1 : 0), items);
}

export function createMaxHeap<T>(items: T[] = []): BinaryHeap<T> {
  return new BinaryHeap<T>((a, b) => (a > b ? -1 : a < b ? 1 : 0), items);
}


const minHeap = createMinHeap<number>();
minHeap.insert(5);
minHeap.insert(3);
minHeap.insert(8);
console.log(minHeap.extract()); // 3
console.log(minHeap.extract()); // 5

const maxHeap = createMaxHeap<number>([10, 20, 15]);
console.log(maxHeap.extract()); // 20
