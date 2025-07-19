"use strict";
class LegacyCollection {
    constructor() {
        this.items = [1, 2, 3];
    }
    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }
}
// Usage
const legacy = new LegacyCollection();
for (const x of legacy) {
    console.log('Monkey-patched:', x);
}
//# sourceMappingURL=monkeypatch-iterable.js.map