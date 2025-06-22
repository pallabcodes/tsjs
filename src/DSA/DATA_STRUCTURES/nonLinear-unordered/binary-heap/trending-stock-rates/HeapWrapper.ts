// src/HeapWrapper.ts

export type Comparator<T> = (a: T, b: T) => number;

export class BinaryHeap<T> {
  private heap: T[];
  private compare: Comparator<T>;

  constructor(compareFn: Comparator<T>, initialValues: T[] = []) {
    this.compare = compareFn;
    this.heap = [...initialValues];
    if (this.heap.length > 0) {
      this.heapify();
    }
  }

  private heapify(): void {
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
    let i = index;
    while (i > 0 && this.compare(this.heap[i], this.heap[this.parent(i)]) < 0) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private siftDown(index: number): void {
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

      if (smallest === i) break;

      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  public toArray(): T[] {
    return [...this.heap];
  }
}

export function createMinHeap<T>(items: T[] = []): BinaryHeap<T> {
  return new BinaryHeap<T>((a, b) => (a < b ? -1 : a > b ? 1 : 0), items);
}

export function createMaxHeap<T>(items: T[] = []): BinaryHeap<T> {
  return new BinaryHeap<T>((a, b) => (a > b ? -1 : a < b ? 1 : 0), items);
}
