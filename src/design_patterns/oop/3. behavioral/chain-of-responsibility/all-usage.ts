// ### Chain of Responsibility Pattern Use Cases
//
// The **Chain of Responsibility Pattern** is a behavioral design pattern that allows a request to be passed along a chain of handlers, where each handler can either process the request or pass it along to the next handler.
// This pattern is useful for handling requests where the handler is not known upfront and different handlers can process the request based on certain conditions.
//
// Key scenarios where you would use the Chain of Responsibility pattern:
//
// 1. **Request Handling**: Allow multiple handlers to process requests, each responsible for a different aspect or condition.
// 2. **Decoupling Sender and Receiver**: Decouple the sender of a request from the receiver, allowing flexibility in handling.
// 3. **Flexible Handling**: Handle requests in a flexible and extensible manner, where new handlers can be added without modifying existing code.
// 4. **Handling Complex Conditions**: Use a series of handlers to process complex conditions step-by-step.
//
// #### 1. **Request Handling**
interface Handler {
  setNext(handler: Handler): Handler;
  handleRequest(request: string): void;
}

class ConcreteHandlerA implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    if (request === 'A') {
      console.log('Handler A processed request A');
    } else if (this.nextHandler) {
      this.nextHandler.handleRequest(request);
    }
  }
}

class ConcreteHandlerB implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    if (request === 'B') {
      console.log('Handler B processed request B');
    } else if (this.nextHandler) {
      this.nextHandler.handleRequest(request);
    }
  }
}

// Usage example
const handlerA = new ConcreteHandlerA();
const handlerB = new ConcreteHandlerB();
handlerA.setNext(handlerB);

handlerA.handleRequest('A'); // Handler A processed request A
handlerA.handleRequest('B'); // Handler B processed request B

// #### 2. **Decoupling Sender and Receiver**
class LoggingHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    console.log(`Logging request: ${request}`);
    if (this.nextHandler) {
      this.nextHandler.handleRequest(request);
    }
  }
}

class ValidationHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    if (request === 'Valid') {
      console.log('Request is valid');
      if (this.nextHandler) {
        this.nextHandler.handleRequest(request);
      }
    } else {
      console.log('Invalid request');
    }
  }
}

// Usage example
const loggingHandler = new LoggingHandler();
const validationHandler = new ValidationHandler();
loggingHandler.setNext(validationHandler);

loggingHandler.handleRequest('Valid'); // Logging request: Valid, Request is valid
loggingHandler.handleRequest('Invalid'); // Logging request: Invalid, Invalid request

// #### 3. **Flexible Handling**
class AuthenticationHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    if (request === 'Authenticated') {
      console.log('Authentication passed');
      if (this.nextHandler) {
        this.nextHandler.handleRequest(request);
      }
    } else {
      console.log('Authentication failed');
    }
  }
}

class AuthorizationHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    if (request === 'Authorized') {
      console.log('Authorization passed');
      if (this.nextHandler) {
        this.nextHandler.handleRequest(request);
      }
    } else {
      console.log('Authorization failed');
    }
  }
}

// Usage example
const authHandler = new AuthenticationHandler();
const authzHandler = new AuthorizationHandler();
authHandler.setNext(authzHandler);

authHandler.handleRequest('Authenticated'); // Authentication passed, Authorization passed
authHandler.handleRequest('NotAuthenticated'); // Authentication failed

// #### 4. **Handling Complex Conditions**
class PaymentHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    if (request === 'Payment') {
      console.log('Handling payment request');
      if (this.nextHandler) {
        this.nextHandler.handleRequest(request);
      }
    } else if (this.nextHandler) {
      this.nextHandler.handleRequest(request);
    }
  }
}

class OrderHandler implements Handler {
  private nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  handleRequest(request: string): void {
    if (request === 'Order') {
      console.log('Handling order request');
      if (this.nextHandler) {
        this.nextHandler.handleRequest(request);
      }
    } else if (this.nextHandler) {
      this.nextHandler.handleRequest(request);
    }
  }
}

// Usage example
const paymentHandler = new PaymentHandler();
const orderHandler = new OrderHandler();
paymentHandler.setNext(orderHandler);

paymentHandler.handleRequest('Payment'); // Handling payment request
paymentHandler.handleRequest('Order'); // Handling order request
