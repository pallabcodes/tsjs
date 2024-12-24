class Calculator {
  add(a, b) {
    return a + b;
  }
}

// 2. Here's our simple decorator function
function logDecorator(target, propertyKey, descriptor) {
  // descriptor.value is the original method (add in this case)
  const originalMethod = descriptor.value;

  console.info('original method method: ', originalMethod.toString());

  // We replace the original method with our new function
  descriptor.value = function (...args) {
    // console.log(`Calling method with args:`, args);  // Log the arguments
    const result = originalMethod.apply(this, args); // Call the original method
    // console.log(`Result was:`, result);  // Log the result
    return result;  // Return the result
  };

  // Return the modified descriptor
  return descriptor;
}

// 3. Get the method descriptor
const descriptor = Object.getOwnPropertyDescriptor(Calculator.prototype, 'add');
// console.info(descriptor);

// 4. Apply the decorator manually (so this modifies the og add method)
Object.defineProperty(Calculator.prototype, 'add', logDecorator(Calculator.prototype, 'add', descriptor));

// Proof: original add method has been modified -> Log after the decorator is applied to inspect the modified method
console.info('Decorated add method signature: ', Calculator.prototype.add.toString());


// 5. Using the modified class
const calc = new Calculator();
console.log("answer: ", calc.add(5, 3)); // Logs args and result


// Original method signature: function add(a, b) {
//   return a + b;
// }

// Modified add method signature: function (...args) {
//   console.log(`Calling method with args:`, args);
//   const result = originalMethod.apply(this, args);
//   console.log(`Result was:`, result);
//   return result;
// }

// answer: 8
