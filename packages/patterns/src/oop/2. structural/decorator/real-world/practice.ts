// Corrected simple decorator definition
function SimpleDecorator(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // Save the original method
    const originalMethod = descriptor.value;

    // Overwrite the method with new behavior
    descriptor.value = async function (...args: any[]) {
      try {
        console.log('Before method execution');
        // Simulate some logic that might fail
        throw new Error('Something went wrong!');
      } catch (err) {
        console.error('Error in decorator:', err);
        throw err; // Re-throw the error
      }
    };

    // Return the modified descriptor
    return descriptor;
  };
}

class UserController {
  @SimpleDecorator() // Applying the simple decorator
  async me(): Promise<void> {
    // This will not be executed due to the error in the decorator
    console.info('This will not log because the decorator throws an error');
  }
}

async function runDemo() {
  const userController = new UserController();
  try {
    await userController.me(); // Trigger the method decorated with SimpleDecorator
  } catch (error) {
    console.error('Caught error in runDemo:', error); // Catch and log the error
  }
}

runDemo();
