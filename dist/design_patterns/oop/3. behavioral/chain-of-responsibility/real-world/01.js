"use strict";
// The **Chain of Responsibility (CoR)** pattern is designed to pass a request along a chain of handlers. Each handler can either handle the request or pass it to the next handler in the chain. This pattern is ideal for scenarios where multiple potential handlers can process a request, but the specific handler isn't determined until runtime.
//
// Below, I'll provide a **real-world example** that demonstrates the **Chain of Responsibility pattern** in a way that aligns with **product-based standards**, covering its **full power**:
//
// ### Real-World Example: Request Validation and Processing Pipeline
//
// Consider a scenario where an HTTP request needs to go through a series of steps before being processed:
// 1. **Authentication**: Verify the request is from an authorized user.
// 2. **Authorization**: Check if the user has permission to perform the requested action.
// 3. **Validation**: Ensure the request data is valid.
// 4. **Processing**: Perform the requested action.
// 5. **Error Handling**: Return appropriate error responses if any step fails.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = exports.ProcessingHandler = exports.ValidationHandler = exports.AuthorizationHandler = exports.AuthenticationHandler = void 0;
// Base Handler Class
class AbstractHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler; // Allows chaining
    }
    handle(request) {
        if (this.nextHandler) {
            this.nextHandler.handle(request);
        }
    }
}
// #### Specific Handlers
// Request Object
class HttpRequest {
    constructor(user, body) {
        this.user = user;
        this.body = body;
    }
}
// Authentication Handler
class AuthenticationHandler extends AbstractHandler {
    handle(request) {
        if (!request.user) {
            console.error('Authentication failed: No user found.');
            return; // Stop the chain
        }
        console.log('Authentication successful.');
        super.handle(request); // Pass to the next handler
    }
}
exports.AuthenticationHandler = AuthenticationHandler;
// Authorization Handler
class AuthorizationHandler extends AbstractHandler {
    constructor(requiredRole) {
        super();
        this.requiredRole = requiredRole;
    }
    handle(request) {
        if (request.user?.role !== this.requiredRole) {
            console.error('Authorization failed: Insufficient permissions.');
            return; // Stop the chain
        }
        console.log('Authorization successful.');
        super.handle(request);
    }
}
exports.AuthorizationHandler = AuthorizationHandler;
// Validation Handler
class ValidationHandler extends AbstractHandler {
    handle(request) {
        if (!request.body || Object.keys(request.body).length === 0) {
            console.error('Validation failed: Request body is empty.');
            return; // Stop the chain
        }
        console.log('Validation successful.');
        super.handle(request);
    }
}
exports.ValidationHandler = ValidationHandler;
// Processing Handler
class ProcessingHandler extends AbstractHandler {
    handle(request) {
        console.log('Processing request:', request.body);
        // Perform the main operation
        super.handle(request);
    }
}
exports.ProcessingHandler = ProcessingHandler;
// Error Handler (Optional)
class ErrorHandler extends AbstractHandler {
    handle(_request) {
        console.log('Returning a generic error response.');
    }
}
exports.ErrorHandler = ErrorHandler;
// usage example
const request = new HttpRequest({ id: 'user123', role: 'admin' }, { action: 'delete', resource: 'file' });
const authHandler = new AuthenticationHandler();
const roleHandler = new AuthorizationHandler('admin');
const validationHandler = new ValidationHandler();
const processingHandler = new ProcessingHandler();
// Build the chain
authHandler
    .setNext(roleHandler)
    .setNext(validationHandler)
    .setNext(processingHandler);
// Start the chain
authHandler.handle(request);
// ### Analysis of the Pattern’s Full Power
//
// 1. **Handles Complex Pipelines:**
// - This example models a real-world pipeline involving authentication, authorization, validation, processing, and error handling. It demonstrates how to structure interdependent tasks in a clear, modular way.
// 2. **Dynamic Configuration:**
// - Handlers can be dynamically added or removed from the chain, making it flexible to adapt to changes (e.g., adding a rate-limiting step).
// 3. **Decoupling of Responsibility:**
// - Each handler is focused on a single responsibility (SRP), which improves maintainability and testability.
// 4. **Error Handling:**
// - The chain naturally supports graceful error handling by stopping the chain at the failing handler or adding a final `ErrorHandler`.
// 5. **Fluent Interface:**
// - The `setNext` method allows chaining handlers fluently, improving readability.
// 6. **Reusability:**
// - Handlers like `AuthenticationHandler` and `ValidationHandler` can be reused in other chains or contexts.
// 7. **Extensibility:**
// - New handlers can be added (e.g., logging, monitoring, etc.) without modifying existing ones.
// ### Extensions to Make it Even Better
// - **Asynchronous Handlers**: If certain steps require async operations (e.g., database lookups), convert the handlers to return `Promise<void>` instead of `void`.
// - **Centralized Error Propagation**: Use a try-catch block or result object to propagate errors and handle them centrally.
// - **Dependency Injection**: Inject dependencies (e.g., services, repositories) into handlers for cleaner code and easier testing.
// - **Logging Middleware**: Add a handler to log each step for better debugging in production.
// ### Conclusion
// This example demonstrates the **full power of the Chain of Responsibility pattern** and its application to a real-world product-standard scenario:
//   - **All real-world needs** for request validation and processing are covered.
// - The pattern is implemented in a clean, maintainable, and extensible way.
// - It showcases the decoupling of responsibilities and dynamic configuration of the chain.
//
//   If you need to handle complex pipelines like request processing, workflows, or middleware in a scalable application, this template is sufficient and aligns with **product-based standards**.
//# sourceMappingURL=01.js.map