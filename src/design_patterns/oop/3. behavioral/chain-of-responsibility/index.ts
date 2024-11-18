// When to use:
/**
 * 1. Use this pattern when you have multiple handlers for a request and want to decouple the sender of the request from its receivers.
 * 2. It promotes loose coupling and flexibility in assigning responsibilities.
 */

// Handler interface for the Chain of Responsibility
interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}

// Base class for handlers
abstract class BaseHandler implements Handler {
  private nextHandler: Handler;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: string): string | null {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

// Concrete handler for handling specific requests
class ConcreteHandlerA extends BaseHandler {
  handle(request: string): string | null {
    if (request === 'A') {
      return `Handled by Handler A`;
    }
    return super.handle(request); // Pass to the next handler
  }
}

class ConcreteHandlerB extends BaseHandler {
  handle(request: string): string | null {
    if (request === 'B') {
      return `Handled by Handler B`;
    }
    return super.handle(request); // Pass to the next handler
  }
}

// Usage
const handlerA = new ConcreteHandlerA();
const handlerB = new ConcreteHandlerB();

// Set up the chain of responsibility
handlerA.setNext(handlerB);

console.log(handlerA.handle('A')); // Output: Handled by Handler A
console.log(handlerA.handle('B')); // Output: Handled by Handler B
console.log(handlerA.handle('C')); // Output: null
