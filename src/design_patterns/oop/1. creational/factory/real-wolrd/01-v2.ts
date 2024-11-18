// 1. Object Pooling and Resource Management:
// Object pooling can help manage expensive resources like database connections or API clients, ensuring that connections are reused instead of being created repeatedly.

class DatabaseConnection {
    connect(): void {
        console.log("Connected to the database");
    }
}

// @ts-ignore
class DatabaseConnectionPoolFactory {
    private static pool: DatabaseConnection[] = [];
    private static maxPoolSize = 10;

    static createDatabaseConnection(): DatabaseConnection {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }

        if (this.pool.length < this.maxPoolSize) {
            const connection = new DatabaseConnection();
            return connection;
        }

        throw new Error("Max pool size reached");
    }

    static releaseConnection(connection: DatabaseConnection): void {
        if (this.pool.length < this.maxPoolSize) {
            this.pool.push(connection);
        }
    }
}

// 2. Asynchronous Object Creation:
// Some objects, especially those that depend on external resources, may require asynchronous operations to initialize, like fetching credentials from a remote server.

class APIClient {
    async initialize(): Promise<void> {
        console.log("Initializing API Client");
    }
}

// @ts-ignore
class AsyncSystemFactory {
    async createDatabaseConnection(): Promise<DatabaseConnection> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(new DatabaseConnection());
            }, 1000);
        });
    }

    async createAPIClient(): Promise<APIClient> {
        const apiClient = new APIClient();
        await apiClient.initialize();
        return apiClient;
    }
}

// 3. Feature Flags:
// Feature flags allow you to toggle features on or off based on conditions, often dynamically, without deploying code changes. The Factory Pattern can use feature flags to decide which component or behavior to instantiate.

// @ts-ignore
class FeatureFlagFactory {
    private featureFlag: boolean;

    constructor(featureFlag: boolean) {
        this.featureFlag = featureFlag;
    }

    createDatabaseConnection(): DatabaseConnection {
        return this.featureFlag
            ? new DatabaseConnection()  // Use a new type or feature flag-based logic
            : new DatabaseConnection(); // Default connection
    }

    createAPIClient(): APIClient {
        return this.featureFlag ? new APIClient() : new APIClient();
    }
}

// 4. External Configuration:
// In large systems, configuration is often managed outside the application. Factories can read configurations from external files, environment variables, or a configuration service.

interface Config {
    dbType: string;
    useGraphQL: boolean;
    logToFile: boolean;
}



// @ts-ignore
class ConfigurableFactory {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    createDatabaseConnection(): DatabaseConnection {
        if (this.config.dbType === 'PostgreSQL') {
            return new DatabaseConnection(); // Example of PostgreSQL
        }
        return new DatabaseConnection(); // Default (MySQL)
    }

    createAPIClient(): APIClient {
        return this.config.useGraphQL
            ? new APIClient() // GraphQL client
            : new APIClient(); // REST client
    }

    createLogger(): Logger {
        return this.config.logToFile
            ? new FileLogger()
            : new ConsoleLogger();
    }
}

// Logger Interface and Implementations
interface Logger {
    log(message: string): void;
}

// @ts-ignore
class FileLogger implements Logger {
    log(message: string): void {
        console.log("Logging to file: " + message);
    }
}

// @ts-ignore
class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log("Logging to console: " + message);
    }
}

// Usage

// @ts-ignore
const config = { dbType: 'PostgreSQL', useGraphQL: true, logToFile: false };
// @ts-ignore
const factory = new ConfigurableFactory(config);


// 5. Thread Safety (Concurrency):
// If multiple threads or processes might be using the factory at the same time, thread-safe object creation is crucial to avoid race conditions.

class SynchronizedFactory {
    private static lock = new Object();

    createDatabaseConnection(): DatabaseConnection {
        let connection: DatabaseConnection;

        // Ensure thread safety when creating the connection
        synchronized(SynchronizedFactory.lock, () => {
            connection = new DatabaseConnection();
        });

        return connection!;
    }

    createAPIClient(): APIClient {
        return new APIClient();
    }
}

// Synchronized function to handle concurrency (simulated)
function synchronized(lock: object, func: Function) {
    // Logic to acquire lock before executing the function
    func();
}

// 6. Dependency Injection Integration:
// In enterprise systems, dependency injection (DI) is often used to manage object lifecycle(s). The Factory Pattern can be combined with DI containers to instantiate objects with their dependencies.

interface SystemComponentFactory {
    createDatabaseConnection(): DatabaseConnection;
    createAPIClient(): APIClient;
    createLogger(): Logger;
}

class DIContainer {
    private static container: Map<string, any> = new Map();

    static register<T>(key: string, dependency: T): void {
        this.container.set(key, dependency);
    }

    static resolve<T>(key: string): T {
        return this.container.get(key);
    }
}

class DependencyInjectionFactory implements SystemComponentFactory {
    private dbConnection: DatabaseConnection;
    private apiClient: APIClient;
    private logger: Logger;

    constructor() {
        this.dbConnection = DIContainer.resolve<DatabaseConnection>('dbConnection');
        this.apiClient = DIContainer.resolve<APIClient>('apiClient');
        this.logger = DIContainer.resolve<Logger>('logger');
    }

    createDatabaseConnection(): DatabaseConnection {
        return this.dbConnection;
    }

    createAPIClient(): APIClient {
        return this.apiClient;
    }

    createLogger(): Logger {
        return this.logger;
    }
}

// Registering dependencies
DIContainer.register('dbConnection', new DatabaseConnection());
DIContainer.register('apiClient', new APIClient());
DIContainer.register('logger', new ConsoleLogger());



/*

Summary:
This enhanced version of the Factory Pattern showcases how it can be applied in enterprise-level product development with considerations for:

1. Object Pooling for managing reusable resources like database connections.
2. Asynchronous Initialization for components that require async operations.
3. Feature Flags to toggle different behaviors in the system.
4. External Configuration to handle complex configuration management.
5.Thread-Safety for concurrent access in multi-threaded environments.
6. Dependency Injection integration for better management of object lifecycle(s).

Each of these considerations enhances the flexibility, scalability, and maintainability of the factory pattern in a large-scale production system, making it more suited for real-world product-based applications.

This should now give you a complete picture of how the Factory Pattern can be leveraged in enterprise-grade systems.

*/