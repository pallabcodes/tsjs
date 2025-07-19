"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurableFactory = exports.FeatureFlagFactory = exports.AsyncSystemFactory = exports.DatabaseConnectionPoolFactory = void 0;
// MySQLConnection: Concrete implementation of DatabaseConnection for MySQL.
class MySQLConnection {
    connect() {
        console.log('MySQL connected');
    }
    disconnect() {
        console.log('MySQL disconnected');
    }
}
// PostgreSQLConnection: Concrete implementation of DatabaseConnection for PostgreSQL.
class PostgreSQLConnection {
    connect() {
        console.log('PostgreSQL connected');
    }
    disconnect() {
        console.log('PostgreSQL disconnected');
    }
}
// RESTAPIClient: Concrete implementation of APIClient for REST API.
class RESTAPIClient {
    async request(endpoint, data) {
        console.log(`REST API request to ${endpoint} with data:`, data);
        return {}; // Mock response for demonstration
    }
}
// GraphQLAPIClient: Concrete implementation of APIClient for GraphQL.
class GraphQLAPIClient {
    async request(endpoint, data) {
        console.log(`GraphQL API request to ${endpoint} with data:`, data);
        return {}; // Mock response for demonstration
    }
}
// FileLogger: Concrete implementation of Logger to log messages to a file.
class FileLogger {
    log(message) {
        console.log(`Logged to file: ${message}`);
    }
}
// ConsoleLogger: Concrete implementation of Logger to log messages to the console.
class ConsoleLogger {
    log(message) {
        console.log(`Console log: ${message}`);
    }
}
// 1. DatabaseConnectionPoolFactory: Manages a pool of reusable DatabaseConnection objects (e.g., MySQL).
class DatabaseConnectionPoolFactory {
    static { this.pool = []; }
    static { this.maxPoolSize = 10; }
    // Creates a DatabaseConnection, either by reusing one from the pool or creating a new one.
    createDatabaseConnection() {
        if (DatabaseConnectionPoolFactory.pool.length > 0) {
            return DatabaseConnectionPoolFactory.pool.pop();
        }
        if (DatabaseConnectionPoolFactory.pool.length < DatabaseConnectionPoolFactory.maxPoolSize) {
            return new MySQLConnection(); // Creates a new MySQL connection
        }
        throw new Error('Max pool size reached');
    }
    createAPIClient() {
        return new RESTAPIClient(); // Default API client
    }
    createLogger() {
        return new ConsoleLogger(); // Default logger
    }
    // Releases a DatabaseConnection back to the pool.
    static releaseConnection(connection) {
        DatabaseConnectionPoolFactory.pool.push(connection);
    }
}
exports.DatabaseConnectionPoolFactory = DatabaseConnectionPoolFactory;
// 2. AsyncSystemFactory: Demonstrates asynchronous object creation (e.g., loading DatabaseConnection from cloud).
class AsyncSystemFactory {
    // Creates a DatabaseConnection asynchronously by simulating a network call.
    async createDatabaseConnection() {
        return this.loadConnectionFromCloud(); // Simulates loading a connection asynchronously
    }
    createAPIClient() {
        return new GraphQLAPIClient(); // Default GraphQL API client
    }
    createLogger() {
        return new FileLogger(); // Default logger to log to file
    }
    // Simulates loading a MySQL connection from a cloud service asynchronously.
    async loadConnectionFromCloud() {
        return new Promise(resolve => setTimeout(() => resolve(new MySQLConnection()), 1000) // Simulates delay
        );
    }
}
exports.AsyncSystemFactory = AsyncSystemFactory;
// 3. FeatureFlagFactory: Creates components based on feature flags, allowing toggling between different implementations.
class FeatureFlagFactory {
    constructor(featureFlag) {
        this.featureFlag = featureFlag;
    }
    // Creates a DatabaseConnection based on the feature flag (PostgreSQL if true, MySQL if false).
    createDatabaseConnection() {
        return this.featureFlag
            ? new PostgreSQLConnection()
            : new MySQLConnection();
    }
    // Creates an APIClient based on the feature flag (GraphQL if true, REST if false).
    createAPIClient() {
        return this.featureFlag ? new GraphQLAPIClient() : new RESTAPIClient();
    }
    createLogger() {
        return new FileLogger(); // Default logger
    }
}
exports.FeatureFlagFactory = FeatureFlagFactory;
// 4. ConfigurableFactory: Configurable factory that uses configuration to choose between different components.
class ConfigurableFactory {
    constructor(config) {
        this.config = config;
    }
    // Creates a DatabaseConnection based on the config's dbType (either PostgreSQL or MySQL).
    createDatabaseConnection() {
        switch (this.config.dbType) {
            case 'PostgreSQL':
                return new PostgreSQLConnection();
            case 'MySQL':
                return new MySQLConnection();
            default:
                throw new Error('Unsupported database type');
        }
    }
    // Creates an APIClient based on the config's useGraphQL flag (either GraphQL or REST).
    createAPIClient() {
        return this.config.useGraphQL
            ? new GraphQLAPIClient()
            : new RESTAPIClient();
    }
    // Creates a Logger based on the config's logToFile flag (either FileLogger or ConsoleLogger).
    createLogger() {
        return this.config.logToFile ? new FileLogger() : new ConsoleLogger();
    }
}
exports.ConfigurableFactory = ConfigurableFactory;
// Usage Example
const config = {
    dbType: 'PostgreSQL', // Strongly typed database choice
    useGraphQL: true,
    logToFile: false,
};
const factory = new ConfigurableFactory(config); // Create a factory based on the config
const asyncFactory = new AsyncSystemFactory(); // Example of async factory
(async () => {
    // Using async factory to create a DatabaseConnection asynchronously
    const asyncDbConnection = await asyncFactory.createDatabaseConnection();
    asyncDbConnection.connect();
    // Using configurable factory to create a DatabaseConnection based on config
    const dbConnection = factory.createDatabaseConnection();
    dbConnection.connect();
    // Creating an API client and making a request
    const apiClient = factory.createAPIClient();
    const result = await apiClient.request('/example', { param: 'test' });
    console.log('API Response:', result);
})();
//# sourceMappingURL=01-v1.js.map