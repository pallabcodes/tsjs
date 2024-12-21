// 1. Object Pooling and Resource Management
// Object pooling helps manage expensive resources like database connections,
// ensuring they are reused instead of being created repeatedly.

class DatabaseConnection {
  connect(): void {
    console.log('Connected to the database');
  }
}

export class DatabaseConnectionPoolFactory {
  private static readonly pool: DatabaseConnection[] = [];
  private static readonly maxPoolSize = 10;

  static createDatabaseConnection(): DatabaseConnection {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }

    if (this.pool.length < this.maxPoolSize) {
      return new DatabaseConnection();
    }

    throw new Error('Max pool size reached');
  }

  static releaseConnection(connection: DatabaseConnection): void {
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(connection);
    }
  }
}

// 2. Asynchronous Object Creation
// Some objects may require asynchronous operations to initialize, 
// like fetching credentials from a remote server.

class APIClient {
  async initialize(): Promise<void> {
    console.log('Initializing API Client');
  }
}

export class AsyncSystemFactory {
  async createDatabaseConnection(): Promise<DatabaseConnection> {
    return new Promise(resolve => {
      setTimeout(() => resolve(new DatabaseConnection()), 1000);
    });
  }

  async createAPIClient(): Promise<APIClient> {
    const apiClient = new APIClient();
    await apiClient.initialize();
    return apiClient;
  }
}

// 3. Feature Flags
// Feature flags toggle features dynamically, without deploying code changes. 
// The Factory Pattern can leverage feature flags to decide which components to instantiate.

export class FeatureFlagFactory {
  private readonly featureFlag: boolean;

  constructor(featureFlag: boolean) {
    this.featureFlag = featureFlag;
  }

  createDatabaseConnection(): DatabaseConnection {
    return new DatabaseConnection(); // Feature flag logic can be added as needed
  }

  createAPIClient(): APIClient {
    return new APIClient(); // Feature flag logic can be added as needed
  }
}

// 4. External Configuration
// Factories can read configurations from external files or environment variables,
// making them adaptable to different environments or configurations.

interface Config {
  dbType: string;
  useGraphQL: boolean;
  logToFile: boolean;
}

export class ConfigurableFactory {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  createDatabaseConnection(): DatabaseConnection {
    switch (this.config.dbType) {
      case 'PostgreSQL':
        return new DatabaseConnection(); // Example for PostgreSQL
      default:
        return new DatabaseConnection(); // Default connection (e.g., MySQL)
    }
  }

  createAPIClient(): APIClient {
    return this.config.useGraphQL
      ? new APIClient() // GraphQL client
      : new APIClient(); // REST client
  }

  createLogger(): Logger {
    return this.config.logToFile ? new FileLogger() : new ConsoleLogger();
  }
}

// Logger Interface and Implementations

interface Logger {
  log(message: string): void;
}

export class FileLogger implements Logger {
  log(message: string): void {
    console.log('Logging to file: ' + message);
  }
}

export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log('Logging to console: ' + message);
  }
}

// Usage Example
const config = { dbType: 'PostgreSQL', useGraphQL: true, logToFile: false };
const factory = new ConfigurableFactory(config);
console.log(factory.createDatabaseConnection());

// 5. Thread Safety (Concurrency)
// In multi-threaded environments, thread-safe object creation prevents race conditions.

export class SynchronizedFactory {
  private static lock = new Object();

  createDatabaseConnection(): DatabaseConnection {
    let connection!: DatabaseConnection;
    this.acquireLock();
    try {
      connection = new DatabaseConnection();
    } finally {
      this.releaseLock();
    }
    return connection;
  }

  createAPIClient(): APIClient {
    return new APIClient();
  }

  private acquireLock(): void {
    console.log('Lock acquired');
  }

  private releaseLock(): void {
    console.log('Lock released');
  }
}

// 6. Dependency Injection Integration
// Factory Pattern can be integrated with Dependency Injection (DI) to manage object lifecycles effectively.

interface SystemComponentFactory {
  createDatabaseConnection(): DatabaseConnection;
  createAPIClient(): APIClient;
  createLogger(): Logger;
}

class DIContainer {
  private static readonly container: Map<string, any> = new Map();

  static register<T>(key: string, dependency: T): void {
    this.container.set(key, dependency);
  }

  static resolve<T>(key: string): T {
    return this.container.get(key);
  }
}

export class DependencyInjectionFactory implements SystemComponentFactory {
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
This version of the Factory Pattern showcases practical implementations for:

1. **Object Pooling**: Reusing database connections to manage expensive resources.
2. **Asynchronous Initialization**: Handling objects requiring async initialization.
3. **Feature Flags**: Dynamically toggling components or behaviors based on flags.
4. **External Configuration**: Managing configurations externally (e.g., environment variables).
5. **Thread-Safety**: Ensuring safe concurrent access to objects.
6. **Dependency Injection Integration**: Managing object lifecycles using DI.

Each pattern implementation enhances flexibility, scalability, and maintainability, making the system more adaptable to various production environments.

*/
