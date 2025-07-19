"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualIterable = void 0;
class DualIterable {
    constructor() {
        this.arr = [1, 2, 3];
    }
    [Symbol.iterator]() {
        let i = 0, arr = this.arr;
        return {
            next() {
                if (i < arr.length) {
                    return { value: arr[i++], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
    [Symbol.asyncIterator]() {
        let i = 0, arr = this.arr;
        return {
            async next() {
                await new Promise(res => setTimeout(res, 50));
                if (i < arr.length) {
                    return { value: arr[i++], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
}
exports.DualIterable = DualIterable;
// Usage
const dual = new DualIterable();
for (const x of dual)
    console.log('sync', x);
(async () => {
    for await (const x of dual)
        console.log('async', x);
})();
//# sourceMappingURL=dual-iterator.js.map