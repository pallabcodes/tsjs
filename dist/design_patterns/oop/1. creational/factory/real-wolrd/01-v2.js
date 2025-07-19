"use strict";
// 1. Object Pooling and Resource Management
// Object pooling helps manage expensive resources like database connections,
// ensuring they are reused instead of being created repeatedly.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInjectionFactory = exports.SynchronizedFactory = exports.ConsoleLogger = exports.FileLogger = exports.ConfigurableFactory = exports.FeatureFlagFactory = exports.AsyncSystemFactory = exports.DatabaseConnectionPoolFactory = void 0;
class DatabaseConnection {
    connect() {
        console.log('Connected to the database');
    }
}
class DatabaseConnectionPoolFactory {
    static { this.pool = []; }
    static { this.maxPoolSize = 10; }
    static createDatabaseConnection() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        if (this.pool.length < this.maxPoolSize) {
            return new DatabaseConnection();
        }
        throw new Error('Max pool size reached');
    }
    static releaseConnection(connection) {
        if (this.pool.length < this.maxPoolSize) {
            this.pool.push(connection);
        }
    }
}
exports.DatabaseConnectionPoolFactory = DatabaseConnectionPoolFactory;
// 2. Asynchronous Object Creation
// Some objects may require asynchronous operations to initialize, 
// like fetching credentials from a remote server.
class APIClient {
    async initialize() {
        console.log('Initializing API Client');
    }
}
class AsyncSystemFactory {
    async createDatabaseConnection() {
        return new Promise(resolve => {
            setTimeout(() => resolve(new DatabaseConnection()), 1000);
        });
    }
    async createAPIClient() {
        const apiClient = new APIClient();
        await apiClient.initialize();
        return apiClient;
    }
}
exports.AsyncSystemFactory = AsyncSystemFactory;
// 3. Feature Flags
// Feature flags toggle features dynamically, without deploying code changes. 
// The Factory Pattern can leverage feature flags to decide which components to instantiate.
class FeatureFlagFactory {
    constructor(featureFlag) {
        this.featureFlag = featureFlag;
    }
    createDatabaseConnection() {
        return new DatabaseConnection(); // Feature flag logic can be added as needed
    }
    createAPIClient() {
        return new APIClient(); // Feature flag logic can be added as needed
    }
}
exports.FeatureFlagFactory = FeatureFlagFactory;
class ConfigurableFactory {
    constructor(config) {
        this.config = config;
    }
    createDatabaseConnection() {
        switch (this.config.dbType) {
            case 'PostgreSQL':
                return new DatabaseConnection(); // Example for PostgreSQL
            default:
                return new DatabaseConnection(); // Default connection (e.g., MySQL)
        }
    }
    createAPIClient() {
        return this.config.useGraphQL
            ? new APIClient() // GraphQL client
            : new APIClient(); // REST client
    }
    createLogger() {
        return this.config.logToFile ? new FileLogger() : new ConsoleLogger();
    }
}
exports.ConfigurableFactory = ConfigurableFactory;
class FileLogger {
    log(message) {
        console.log('Logging to file: ' + message);
    }
}
exports.FileLogger = FileLogger;
class ConsoleLogger {
    log(message) {
        console.log('Logging to console: ' + message);
    }
}
exports.ConsoleLogger = ConsoleLogger;
// Usage Example
const config = { dbType: 'PostgreSQL', useGraphQL: true, logToFile: false };
const factory = new ConfigurableFactory(config);
console.log(factory.createDatabaseConnection());
// 5. Thread Safety (Concurrency)
// In multi-threaded environments, thread-safe object creation prevents race conditions.
class SynchronizedFactory {
    static { this.lock = new Object(); }
    createDatabaseConnection() {
        let connection;
        this.acquireLock();
        try {
            connection = new DatabaseConnection();
        }
        finally {
            this.releaseLock();
        }
        return connection;
    }
    createAPIClient() {
        return new APIClient();
    }
    acquireLock() {
        console.log('Lock acquired');
    }
    releaseLock() {
        console.log('Lock released');
    }
}
exports.SynchronizedFactory = SynchronizedFactory;
class DIContainer {
    static { this.container = new Map(); }
    static register(key, dependency) {
        this.container.set(key, dependency);
    }
    static resolve(key) {
        return this.container.get(key);
    }
}
class DependencyInjectionFactory {
    constructor() {
        this.dbConnection = DIContainer.resolve('dbConnection');
        this.apiClient = DIContainer.resolve('apiClient');
        this.logger = DIContainer.resolve('logger');
    }
    createDatabaseConnection() {
        return this.dbConnection;
    }
    createAPIClient() {
        return this.apiClient;
    }
    createLogger() {
        return this.logger;
    }
}
exports.DependencyInjectionFactory = DependencyInjectionFactory;
// Registering dependencies
DIContainer.register('dbConnection', new DatabaseConnection());
DIContainer.register('apiClient', new APIClient());
DIContainer.register('logger', new ConsoleLogger());
/*

Summary:
This version of the Factory Pattern showcases practical implementations for:

1. **Object Pooling**: Reusing database connections to manage expensive resources.
2. **Asynchronous Initialization**: Handling objects requiring async initialization.
3. **Feature Flags**: Dynamically toggling components or behaviors based on flags.
4. **External Configuration**: Managing configurations externally (e.g., environment variables).
5. **Thread-Safety**: Ensuring safe concurrent access to objects.
6. **Dependency Injection Integration**: Managing object lifecycles using DI.

Each pattern implementation enhances flexibility, scalability, and maintainability, making the system more adaptable to various production environments.

*/
//# sourceMappingURL=01-v2.js.map