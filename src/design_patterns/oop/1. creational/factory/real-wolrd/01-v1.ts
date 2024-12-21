// Interface Definitions: Defines common interfaces for different components like DatabaseConnection, APIClient, and Logger.
interface DatabaseConnection {
  connect(): void;
  disconnect(): void;
}

interface APIClient {
  request<TRequest, TResponse>(endpoint: string, data?: TRequest): Promise<TResponse>;
}

interface Logger {
  log(message: string): void;
}

// SystemComponentFactory: Factory interface to create components like DatabaseConnection, APIClient, and Logger.
interface SystemComponentFactory {
  createDatabaseConnection(): DatabaseConnection | Promise<DatabaseConnection>;
  createAPIClient(): APIClient | Promise<APIClient>;
  createLogger(): Logger;
}

// MySQLConnection: Concrete implementation of DatabaseConnection for MySQL.
class MySQLConnection implements DatabaseConnection {
  connect(): void {
    console.log('MySQL connected');
  }

  disconnect(): void {
    console.log('MySQL disconnected');
  }
}

// PostgreSQLConnection: Concrete implementation of DatabaseConnection for PostgreSQL.
class PostgreSQLConnection implements DatabaseConnection {
  connect(): void {
    console.log('PostgreSQL connected');
  }

  disconnect(): void {
    console.log('PostgreSQL disconnected');
  }
}

// RESTAPIClient: Concrete implementation of APIClient for REST API.
class RESTAPIClient implements APIClient {
  async request<TRequest, TResponse>(endpoint: string, data?: TRequest): Promise<TResponse> {
    console.log(`REST API request to ${endpoint} with data:`, data);
    return {} as TResponse; // Mock response for demonstration
  }
}

// GraphQLAPIClient: Concrete implementation of APIClient for GraphQL.
class GraphQLAPIClient implements APIClient {
  async request<TRequest, TResponse>(endpoint: string, data?: TRequest): Promise<TResponse> {
    console.log(`GraphQL API request to ${endpoint} with data:`, data);
    return {} as TResponse; // Mock response for demonstration
  }
}

// FileLogger: Concrete implementation of Logger to log messages to a file.
class FileLogger implements Logger {
  log(message: string): void {
    console.log(`Logged to file: ${message}`);
  }
}

// ConsoleLogger: Concrete implementation of Logger to log messages to the console.
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`Console log: ${message}`);
  }
}

// 1. DatabaseConnectionPoolFactory: Manages a pool of reusable DatabaseConnection objects (e.g., MySQL).
export class DatabaseConnectionPoolFactory implements SystemComponentFactory {
  private static pool: DatabaseConnection[] = [];
  private static readonly maxPoolSize = 10;

  // Creates a DatabaseConnection, either by reusing one from the pool or creating a new one.
  createDatabaseConnection(): DatabaseConnection {
    if (DatabaseConnectionPoolFactory.pool.length > 0) {
      return DatabaseConnectionPoolFactory.pool.pop()!;
    }
    if (DatabaseConnectionPoolFactory.pool.length < DatabaseConnectionPoolFactory.maxPoolSize) {
      return new MySQLConnection(); // Creates a new MySQL connection
    }
    throw new Error('Max pool size reached');
  }

  createAPIClient(): APIClient {
    return new RESTAPIClient(); // Default API client
  }

  createLogger(): Logger {
    return new ConsoleLogger(); // Default logger
  }

  // Releases a DatabaseConnection back to the pool.
  static releaseConnection(connection: DatabaseConnection): void {
    DatabaseConnectionPoolFactory.pool.push(connection);
  }
}

// 2. AsyncSystemFactory: Demonstrates asynchronous object creation (e.g., loading DatabaseConnection from cloud).
export class AsyncSystemFactory implements SystemComponentFactory {
  // Creates a DatabaseConnection asynchronously by simulating a network call.
  async createDatabaseConnection(): Promise<DatabaseConnection> {
    return this.loadConnectionFromCloud(); // Simulates loading a connection asynchronously
  }

  createAPIClient(): APIClient {
    return new GraphQLAPIClient(); // Default GraphQL API client
  }

  createLogger(): Logger {
    return new FileLogger(); // Default logger to log to file
  }

  // Simulates loading a MySQL connection from a cloud service asynchronously.
  private async loadConnectionFromCloud(): Promise<DatabaseConnection> {
    return new Promise(resolve =>
      setTimeout(() => resolve(new MySQLConnection()), 1000) // Simulates delay
    );
  }
}

// 3. FeatureFlagFactory: Creates components based on feature flags, allowing toggling between different implementations.
export class FeatureFlagFactory implements SystemComponentFactory {
  private featureFlag: boolean;

  constructor(featureFlag: boolean) {
    this.featureFlag = featureFlag;
  }

  // Creates a DatabaseConnection based on the feature flag (PostgreSQL if true, MySQL if false).
  createDatabaseConnection(): DatabaseConnection {
    return this.featureFlag
      ? new PostgreSQLConnection()
      : new MySQLConnection();
  }

  // Creates an APIClient based on the feature flag (GraphQL if true, REST if false).
  createAPIClient(): APIClient {
    return this.featureFlag ? new GraphQLAPIClient() : new RESTAPIClient();
  }

  createLogger(): Logger {
    return new FileLogger(); // Default logger
  }
}

// 4. ConfigurableFactory: Configurable factory that uses configuration to choose between different components.
export class ConfigurableFactory implements SystemComponentFactory {
  private config: {
    dbType: 'PostgreSQL' | 'MySQL';
    useGraphQL: boolean;
    logToFile: boolean;
  };

  constructor(config: { dbType: 'PostgreSQL' | 'MySQL'; useGraphQL: boolean; logToFile: boolean }) {
    this.config = config;
  }

  // Creates a DatabaseConnection based on the config's dbType (either PostgreSQL or MySQL).
  createDatabaseConnection(): DatabaseConnection {
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
  createAPIClient(): APIClient {
    return this.config.useGraphQL
      ? new GraphQLAPIClient()
      : new RESTAPIClient();
  }

  // Creates a Logger based on the config's logToFile flag (either FileLogger or ConsoleLogger).
  createLogger(): Logger {
    return this.config.logToFile ? new FileLogger() : new ConsoleLogger();
  }
}

// Usage Example
const config = {
  dbType: 'PostgreSQL' as const, // Strongly typed database choice
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
  const result = await apiClient.request<{ param: string }, { success: boolean }>('/example', { param: 'test' });
  console.log('API Response:', result);
})();
