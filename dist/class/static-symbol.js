"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbolic = void 0;
class Symbolic {
    constructor() {
        this.isSymbolic = true;
    }
    static staticMethod() { return 'I am static!'; }
    static [Symbol.hasInstance](instance) {
        return !!instance && instance.isSymbolic === true;
    }
}
exports.Symbolic = Symbolic;
// Usage
console.log(Symbolic.staticMethod());
const s = new Symbolic();
console.log(s instanceof Symbolic); // true
//# sourceMappingURL=static-symbol.js.map