"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncCounter = void 0;
class AsyncCounter {
    constructor(max) {
        this.max = max;
    }
    [Symbol.asyncIterator]() {
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
exports.AsyncCounter = AsyncCounter;
// Usage
(async () => {
    for await (const n of new AsyncCounter(3)) {
        console.log('AsyncCounter:', n);
    }
})();
//# sourceMappingURL=async-iterators.js.map