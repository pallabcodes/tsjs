"use strict";
class ConcreteHandlerA {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        if (request === 'A') {
            console.log('Handler A processed request A');
        }
        else if (this.nextHandler) {
            this.nextHandler.handleRequest(request);
        }
    }
}
class ConcreteHandlerB {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        if (request === 'B') {
            console.log('Handler B processed request B');
        }
        else if (this.nextHandler) {
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
class LoggingHandler {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        console.log(`Logging request: ${request}`);
        if (this.nextHandler) {
            this.nextHandler.handleRequest(request);
        }
    }
}
class ValidationHandler {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        if (request === 'Valid') {
            console.log('Request is valid');
            if (this.nextHandler) {
                this.nextHandler.handleRequest(request);
            }
        }
        else {
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
class AuthenticationHandler {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        if (request === 'Authenticated') {
            console.log('Authentication passed');
            if (this.nextHandler) {
                this.nextHandler.handleRequest(request);
            }
        }
        else {
            console.log('Authentication failed');
        }
    }
}
class AuthorizationHandler {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        if (request === 'Authorized') {
            console.log('Authorization passed');
            if (this.nextHandler) {
                this.nextHandler.handleRequest(request);
            }
        }
        else {
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
class PaymentHandler {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        if (request === 'Payment') {
            console.log('Handling payment request');
            if (this.nextHandler) {
                this.nextHandler.handleRequest(request);
            }
        }
        else if (this.nextHandler) {
            this.nextHandler.handleRequest(request);
        }
    }
}
class OrderHandler {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handleRequest(request) {
        if (request === 'Order') {
            console.log('Handling order request');
            if (this.nextHandler) {
                this.nextHandler.handleRequest(request);
            }
        }
        else if (this.nextHandler) {
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
//# sourceMappingURL=all-usage.js.map