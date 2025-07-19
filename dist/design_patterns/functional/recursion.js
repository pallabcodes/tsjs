"use strict";
// when a function calls itself as below
function factorial(n) {
    if (n === 0)
        return 1;
    return n * factorial(n - 1);
}
// Usage
const usage = factorial(5); // result is 120
//# sourceMappingURL=recursion.js.map