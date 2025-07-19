"use strict";
// Partial Application: creates a new function by fixing some arguments of the original function.
const multiply = (a, b) => a * b;
const double = multiply.bind(null, 2);
const partialResult = double(5); // 10
//# sourceMappingURL=partial-application.js.map