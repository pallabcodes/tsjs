class LegacyCollection {
  items = [1, 2, 3];
  [Symbol.iterator](): Iterator<number> {
    return this.items[Symbol.iterator]();
  }
}

// Usage
const legacy = new LegacyCollection();
for (const x of legacy) {
  console.log('Monkey-patched:', x);
}