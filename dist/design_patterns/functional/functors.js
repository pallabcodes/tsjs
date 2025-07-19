"use strict";
// Functors can be mapped over, allowing transformations.
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = void 0;
class Box {
    constructor(value) {
        this.value = value;
    }
    map(fn) {
        return new Box(fn(this.value));
    }
}
// Usage
const box = new Box(3);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.result = box.map(x => x + 1).value; // 4
//# sourceMappingURL=functors.js.map