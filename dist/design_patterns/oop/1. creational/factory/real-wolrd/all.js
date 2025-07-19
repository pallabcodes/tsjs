"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingletonDatabaseConnection = void 0;
// Database Implementations
class MySQLConnection {
    connect() {
        console.log('Connected to MySQL');
    }
    disconnect() {
        console.log('Disconnected from MySQL');
    }
}
class PostgreSQLConnection {
    connect() {
        console.log('Connected to PostgreSQL');
    }
    disconnect() {
        console.log('Disconnected from PostgreSQL');
    }
}
// API Client Implementations
class RESTAPIClient {
    async request(endpoint, data) {
        console.log(`REST API request to ${endpoint}`, data);
        return {};
    }
}
class GraphQLAPIClient {
    async request(endpoint, data) {
        console.log(`GraphQL API request to ${endpoint}`, data);
        return {};
    }
}
// Logger Implementations
class ConsoleLogger {
    log(message) {
        console.log(`Console log: ${message}`);
    }
}
class FileLogger {
    log(message) {
        console.log(`Logged to file: ${message}`);
    }
}
// Simple Factory to Create Components
class SimpleSystemFactory {
    constructor(config) {
        this.config = config;
    }
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
    createAPIClient() {
        return this.config.useGraphQL
            ? new GraphQLAPIClient()
            : new RESTAPIClient();
    }
    createLogger() {
        return this.config.logToFile ? new FileLogger() : new ConsoleLogger();
    }
}
// Object Pooling (for Reusing Connections)
class DatabaseConnectionPool {
    constructor() {
        this.pool = [];
        this.maxPoolSize = 10;
    }
    getConnection() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        if (this.pool.length < this.maxPoolSize) {
            return new MySQLConnection();
        }
        throw new Error('Max pool size reached');
    }
    releaseConnection(connection) {
        this.pool.push(connection);
    }
}
// Abstract Factory for System Component Families
class AbstractSystemFactory {
}
// Concrete Factory with Async Initialization
class AsyncSystemFactory extends AbstractSystemFactory {
    async createDatabaseConnection() {
        // Simulate async cloud database setup
        return new Promise(resolve => {
            setTimeout(() => resolve(new PostgreSQLConnection()), 1000);
        });
    }
    async createAPIClient() {
        // Simulate async API client creation
        return new Promise(resolve => {
            setTimeout(() => resolve(new GraphQLAPIClient()), 1000);
        });
    }
    createLogger() {
        return new ConsoleLogger();
    }
}
// Lazy Initialization with Singleton
class SingletonDatabaseConnection {
    static { this.instance = null; }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    static getInstance() {
        if (!SingletonDatabaseConnection.instance) {
            SingletonDatabaseConnection.instance = new MySQLConnection();
        }
        return SingletonDatabaseConnection.instance;
    }
    connect() {
        console.log('Singleton DB connected');
    }
    disconnect() {
        console.log('Singleton DB disconnected');
    }
}
exports.SingletonDatabaseConnection = SingletonDatabaseConnection;
// Usage: Instantiate Factories and Create Components
const config = {
    dbType: 'PostgreSQL',
    useGraphQL: true,
    logToFile: false,
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const factory = new SimpleSystemFactory(config);
const asyncFactory = new AsyncSystemFactory();
// Creating components
(async () => {
    const dbConnection = await asyncFactory.createDatabaseConnection();
    dbConnection.connect();
    const apiClient = await asyncFactory.createAPIClient();
    const result = await apiClient.request('/data', {
        query: 'SELECT * FROM users',
    });
    console.log(result);
    const logger = asyncFactory.createLogger();
    logger.log('System initialized');
    // Testing Object Pooling
    const pool = new DatabaseConnectionPool();
    const pooledConnection = pool.getConnection();
    pooledConnection.connect();
    pool.releaseConnection(pooledConnection);
})();
//# sourceMappingURL=all.js.map