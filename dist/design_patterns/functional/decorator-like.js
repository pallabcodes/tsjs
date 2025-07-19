"use strict";
class Calculator {
    // A basic add function that takes two parameters
    add(a, b) {
        return a + b;
    }
    // A subtract function that takes two parameters
    subtract(a, b) {
        return a - b;
    }
    // A multiply function that takes two parameters
    multiply(a, b) {
        return a * b;
    }
}
// Wrapper function that intercepts the method calls and returns the original function
function methodWrapper(target, methodName, originalMethod) {
    return function (...args) {
        // Ensure args is a tuple of two numbers
        if (args.length !== 2) {
            throw new Error(`Invalid number of arguments for ${methodName}. Expected 2 arguments.`);
        }
        // Log the method and the arguments
        console.log(`Method Name: ${methodName}`);
        console.log('Arguments: ', args);
        // Call the original method with the arguments and return the result
        const result = originalMethod.apply(target, args);
        // Log the result
        console.log(`Result: ${result}`);
        return result; // Return the original method's result
    };
}
// Create a Calculator instance
const calculator = new Calculator();
// Manually wrap each method with the correct type
calculator.add = methodWrapper(calculator, 'add', calculator.add);
calculator.subtract = methodWrapper(calculator, 'subtract', calculator.subtract);
calculator.multiply = methodWrapper(calculator, 'multiply', calculator.multiply);
// Use the wrapped methods
const addResult = calculator.add(10, 5); // Logs method name, args, and result
const subResult = calculator.subtract(20, 4); // Logs method name, args, and result
const mulResult = calculator.multiply(3, 7); // Logs method name, args, and result
// Final results
console.log(`Add Result: ${addResult}`);
console.log(`Subtract Result: ${subResult}`);
console.log(`Multiply Result: ${mulResult}`);
// Output Example:
// The output of running the wrapped methods will be the same:
// bash
// Copy code
// Method Name: add
// Arguments:  [ 10, 5 ]
// Result: 15
// Add Result: 15
// Method Name: subtract
// Arguments:  [ 20, 4 ]
// Result: 16
// Subtract Result: 16
// Method Name: multiply
// Arguments:  [ 3, 7 ]
// Result: 21
// Multiply Result: 21
//# sourceMappingURL=decorator-like.js.map