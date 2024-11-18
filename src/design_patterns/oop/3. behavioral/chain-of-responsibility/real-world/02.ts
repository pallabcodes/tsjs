// Here's a **real-world product-based example** of the **Chain of Responsibility (CoR)** pattern that includes the proposed **extensions** for improving its utility:
//
//
// ### Scenario: User Registration Pipeline
//
// A user registration pipeline requires several steps:
// 1. **Validation**: Ensure all required fields are provided and valid.
// 2. **Duplicate Check**: Verify if the user already exists in the database.
// 3. **Hash Password**: Hash the user's password securely.
// 4. **Save to Database**: Persist the user data to the database.
// 5. **Logging**: Log each step for debugging and monitoring.


// ### Implementation
//
// #### Abstract Handler
// Now supporting **asynchronous operations** and **centralized error propagation**.

interface AsyncRequestHandler {
    setNext(handler: AsyncRequestHandler): AsyncRequestHandler;
    handle(request: UserRequest): Promise<void>; // Asynchronous handling
}

abstract class AbstractAsyncHandler implements AsyncRequestHandler {
    private nextHandler?: AsyncRequestHandler;

    setNext(handler: AsyncRequestHandler): AsyncRequestHandler {
        this.nextHandler = handler;
        return handler; // Enables chaining
    }

    async handle(request: UserRequest): Promise<void> {
        if (this.nextHandler) {
            await this.nextHandler.handle(request);
        }
    }
}

// #### User Request Object
class UserRequest {
    constructor(
        public readonly data: { email: string; password: string },
        public readonly context: Record<string, any> = {} // Used for passing shared data (e.g., hashed password)
    ) {}
}

// #### Specific Handlers with Dependency Injection and Logging

class ValidationHandler extends AbstractAsyncHandler {
    async handle(request: UserRequest): Promise<void> {
        const { email, password } = request.data;
        if (!email || !password) {
            throw new Error("Validation failed: Missing email or password.");
        }
        console.log("Validation successful.");
        await super.handle(request); // Pass to the next handler
    }
}

class DuplicateCheckHandler extends AbstractAsyncHandler {
    constructor(private readonly userService: UserService) {
        super();
    }

    async handle(request: UserRequest): Promise<void> {
        const userExists = await this.userService.findUserByEmail(request.data.email);
        if (userExists) {
            throw new Error("Duplicate check failed: User already exists.");
        }
        console.log("Duplicate check successful.");
        await super.handle(request);
    }
}

class HashPasswordHandler extends AbstractAsyncHandler {
    constructor(private readonly hashService: HashService) {
        super();
    }

    async handle(request: UserRequest): Promise<void> {
        request.context.hashedPassword = await this.hashService.hash(request.data.password);
        console.log("Password hashing successful.");
        await super.handle(request);
    }
}

class SaveToDatabaseHandler extends AbstractAsyncHandler {
    constructor(private readonly userService: UserService) {
        super();
    }

    async handle(request: UserRequest): Promise<void> {
        await this.userService.saveUser({
            email: request.data.email,
            password: request.context.hashedPassword,
        });
        console.log("User saved to database.");
        await super.handle(request);
    }
}

class LoggingHandler extends AbstractAsyncHandler {
    async handle(request: UserRequest): Promise<void> {
        console.log("Handling request for:", request.data.email);
        await super.handle(request); // Pass to the next handler
    }
}

// #### Supporting Services
class UserService {
    async findUserByEmail(email: string): Promise<boolean> {
        // Simulate database check
        console.log(`Checking if user exists for email: ${email}`);
        return false; // For simplicity, assume user doesn't exist
    }

    async saveUser(user: { email: string; password: string }): Promise<void> {
        console.log("Saving user to database:", user);
    }
}

class HashService {
    async hash(password: string): Promise<string> {
        // Simulate hashing (e.g., bcrypt.hash)
        console.log(`Hashing password: ${password}`);
        return `hashed_${password}`;
    }
}


// #### Usage

(async () => {
    const userService = new UserService();
    const hashService = new HashService();

    const loggingHandler = new LoggingHandler();
    const validationHandler = new ValidationHandler();
    const duplicateCheckHandler = new DuplicateCheckHandler(userService);
    const hashPasswordHandler = new HashPasswordHandler(hashService);
    const saveToDatabaseHandler = new SaveToDatabaseHandler(userService);

    // Build the chain
    loggingHandler
        .setNext(validationHandler)
        .setNext(duplicateCheckHandler)
        .setNext(hashPasswordHandler)
        .setNext(saveToDatabaseHandler);

    const userRequest = new UserRequest({
        email: "user@example.com",
        password: "password123",
    });

    try {
        // Start the chain
        await loggingHandler.handle(userRequest);
        console.log("User registration completed successfully.");
    } catch (error) {
        console.error("User registration failed:", (error as Error).message);
    }
})();


// ### Key Features in This Example
//
// 1. **Asynchronous Operations:**
// - Handlers like `DuplicateCheckHandler` and `SaveToDatabaseHandler` perform database operations asynchronously.
//
// 2. **Centralized Error Propagation:**
// - Errors (e.g., validation, duplicate check) are thrown as exceptions and caught centrally for consistent handling.
//
// 3. **Dependency Injection:**
// - External dependencies (`UserService`, `HashService`) are injected, improving testability and separation of concerns.
//
// 4. **Logging Middleware:**
// - `LoggingHandler` logs each step, providing visibility into the pipeline's progress.
//
// 5. **Context Sharing:**
// - The `context` object in `UserRequest` allows handlers to pass data (e.g., the hashed password) to subsequent handlers.

// ### Extensions for Product-Based Standards
// - **Dynamic Configuration**: Use a configuration file or DI container to dynamically configure the chain.
// - **Audit Logging**: Extend `LoggingHandler` to log data to an external system (e.g., ELK stack).
// - **Performance Monitoring**: Add timing logs for each handler to measure pipeline performance.
// - **Retry Mechanism**: Add retries for handlers that interact with external systems (e.g., database or network).

// ### Conclusion
// This example showcases the **full power of the Chain of Responsibility pattern** for a **real-world user registration pipeline**, meeting **product-based standards**. It is highly modular, testable, and extensible, and the inclusion of advanced features like **asynchronous handling**, **error propagation**, and **logging** makes it robust for large-scale applications.