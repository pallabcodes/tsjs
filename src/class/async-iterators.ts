export class AsyncCounter implements AsyncIterable<number> {
  constructor(private max: number) {}

  [Symbol.asyncIterator](): AsyncIterator<number> {
    let count = 0;
    return {
      next: async () => {
        await new Promise(res => setTimeout(res, 100)); // simulate async
        if (count < this.max) {
          return { value: count++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

// Usage
(async () => {
  for await (const n of new AsyncCounter(3)) {
    console.log('AsyncCounter:', n);
  }
})();