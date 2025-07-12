export class DualIterable implements Iterable<number>, AsyncIterable<number> {
  private readonly arr = [1, 2, 3];

  [Symbol.iterator](): Iterator<number> {
    let i = 0, arr = this.arr;
    return {
      next(): IteratorResult<number> {
        if (i < arr.length) {
          return { value: arr[i++], done: false };
        }
        return { value: undefined as any, done: true };
      }
    };
  }

  [Symbol.asyncIterator](): AsyncIterator<number> {
    let i = 0, arr = this.arr;
    return {
      async next(): Promise<IteratorResult<number>> {
        await new Promise(res => setTimeout(res, 50));
        if (i < arr.length) {
          return { value: arr[i++], done: false };
        }
        return { value: undefined as any, done: true };
      }
    };
  }
}

// Usage
const dual = new DualIterable();
for (const x of dual) console.log('sync', x);
(async () => {
  for await (const x of dual) console.log('async', x);
})();