// Common Interfaces for All Components
interface DatabaseConnection {
  connect(): void;
  disconnect(): void;
}

interface APIClient {
  request<TRequest, TResponse>(
    endpoint: string,
    data?: TRequest
  ): Promise<TResponse>;
}

interface Logger {
  log(message: string): void;
}

interface SystemComponentFactory {
  createDatabaseConnection(): DatabaseConnection | Promise<DatabaseConnection>;
  createAPIClient(): APIClient | Promise<APIClient>;
  createLogger(): Logger;
}

// Database Implementations
class MySQLConnection implements DatabaseConnection {
  connect(): void {
    console.log('Connected to MySQL');
  }
  disconnect(): void {
    console.log('Disconnected from MySQL');
  }
}

class PostgreSQLConnection implements DatabaseConnection {
  connect(): void {
    console.log('Connected to PostgreSQL');
  }
  disconnect(): void {
    console.log('Disconnected from PostgreSQL');
  }
}

// API Client Implementations
class RESTAPIClient implements APIClient {
  async request<TRequest, TResponse>(
    endpoint: string,
    data?: TRequest
  ): Promise<TResponse> {
    console.log(`REST API request to ${endpoint}`, data);
    return {} as TResponse;
  }
}

class GraphQLAPIClient implements APIClient {
  async request<TRequest, TResponse>(
    endpoint: string,
    data?: TRequest
  ): Promise<TResponse> {
    console.log(`GraphQL API request to ${endpoint}`, data);
    return {} as TResponse;
  }
}

// Logger Implementations
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`Console log: ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`Logged to file: ${message}`);
  }
}

// Simple Factory to Create Components
class SimpleSystemFactory implements SystemComponentFactory {
  private config: {
    dbType: 'PostgreSQL' | 'MySQL';
    useGraphQL: boolean;
    logToFile: boolean;
  };

  constructor(config: {
    dbType: 'PostgreSQL' | 'MySQL';
    useGraphQL: boolean;
    logToFile: boolean;
  }) {
    this.config = config;
  }

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

  createAPIClient(): APIClient {
    return this.config.useGraphQL
      ? new GraphQLAPIClient()
      : new RESTAPIClient();
  }

  createLogger(): Logger {
    return this.config.logToFile ? new FileLogger() : new ConsoleLogger();
  }
}

// Object Pooling (for Reusing Connections)
class DatabaseConnectionPool {
  private pool: DatabaseConnection[] = [];
  private maxPoolSize = 10;

  getConnection(): DatabaseConnection {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    if (this.pool.length < this.maxPoolSize) {
      return new MySQLConnection();
    }
    throw new Error('Max pool size reached');
  }

  releaseConnection(connection: DatabaseConnection): void {
    this.pool.push(connection);
  }
}

// Abstract Factory for System Component Families
abstract class AbstractSystemFactory implements SystemComponentFactory {
  abstract createDatabaseConnection():
    | DatabaseConnection
    | Promise<DatabaseConnection>;
  abstract createAPIClient(): APIClient | Promise<APIClient>;
  abstract createLogger(): Logger;
}

// Concrete Factory with Async Initialization
class AsyncSystemFactory extends AbstractSystemFactory {
  async createDatabaseConnection(): Promise<DatabaseConnection> {
    // Simulate async cloud database setup
    return new Promise(resolve => {
      setTimeout(() => resolve(new PostgreSQLConnection()), 1000);
    });
  }

  async createAPIClient(): Promise<APIClient> {
    // Simulate async API client creation
    return new Promise(resolve => {
      setTimeout(() => resolve(new GraphQLAPIClient()), 1000);
    });
  }

  createLogger(): Logger {
    return new ConsoleLogger();
  }
}

// Lazy Initialization with Singleton
export class SingletonDatabaseConnection implements DatabaseConnection {
  private static instance: DatabaseConnection | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!SingletonDatabaseConnection.instance) {
      SingletonDatabaseConnection.instance = new MySQLConnection();
    }
    return SingletonDatabaseConnection.instance;
  }

  connect(): void {
    console.log('Singleton DB connected');
  }

  disconnect(): void {
    console.log('Singleton DB disconnected');
  }
}

// Usage: Instantiate Factories and Create Components
const config = {
  dbType: 'PostgreSQL' as const,
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
  const result = await apiClient.request<{ query: string }, { data: unknown }>(
    '/data',
    {
      query: 'SELECT * FROM users',
    }
  );
  console.log(result);

  const logger = asyncFactory.createLogger();
  logger.log('System initialized');

  // Testing Object Pooling
  const pool = new DatabaseConnectionPool();
  const pooledConnection = pool.getConnection();
  pooledConnection.connect();
  pool.releaseConnection(pooledConnection);
})();
