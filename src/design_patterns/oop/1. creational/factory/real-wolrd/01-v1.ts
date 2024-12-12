// Interface Definitions
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

// MySQL Connection Implementation
class MySQLConnection implements DatabaseConnection {
  connect(): void {
    console.log('MySQL connected');
  }

  disconnect(): void {
    console.log('MySQL disconnected');
  }
}

// PostgreSQL Connection Implementation
class PostgreSQLConnection implements DatabaseConnection {
  connect(): void {
    console.log('PostgreSQL connected');
  }

  disconnect(): void {
    console.log('PostgreSQL disconnected');
  }
}

// API Client Implementations
class RESTAPIClient implements APIClient {
  async request<TRequest, TResponse>(
    endpoint: string,
    data?: TRequest
  ): Promise<TResponse> {
    console.log(`REST API request to ${endpoint} with data:`, data);
    return {} as TResponse; // Mock response
  }
}

class GraphQLAPIClient implements APIClient {
  async request<TRequest, TResponse>(
    endpoint: string,
    data?: TRequest
  ): Promise<TResponse> {
    console.log(`GraphQL API request to ${endpoint} with data:`, data);
    return {} as TResponse; // Mock response
  }
}

// Logger Implementations
class FileLogger implements Logger {
  log(message: string): void {
    console.log(`Logged to file: ${message}`);
  }
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`Console log: ${message}`);
  }
}

// 1. Object Pooling and Resource Management
export class DatabaseConnectionPoolFactory implements SystemComponentFactory {
  private static pool: DatabaseConnection[] = [];
  private static readonly maxPoolSize = 10;

  createDatabaseConnection(): DatabaseConnection {
    if (DatabaseConnectionPoolFactory.pool.length > 0) {
      return DatabaseConnectionPoolFactory.pool.pop()!;
    }
    if (
      DatabaseConnectionPoolFactory.pool.length <
      DatabaseConnectionPoolFactory.maxPoolSize
    ) {
      return new MySQLConnection();
    }
    throw new Error('Max pool size reached');
  }

  createAPIClient(): APIClient {
    return new RESTAPIClient();
  }

  createLogger(): Logger {
    return new ConsoleLogger();
  }

  static releaseConnection(connection: DatabaseConnection): void {
    DatabaseConnectionPoolFactory.pool.push(connection);
  }
}

// 2. Asynchronous Component Creation
export class AsyncSystemFactory implements SystemComponentFactory {
  async createDatabaseConnection(): Promise<DatabaseConnection> {
    return this.loadConnectionFromCloud();
  }

  async createAPIClient(): Promise<APIClient> {
    return new GraphQLAPIClient();
  }

  createLogger(): Logger {
    return new FileLogger();
  }

  private async loadConnectionFromCloud(): Promise<DatabaseConnection> {
    return new Promise(resolve =>
      setTimeout(() => resolve(new MySQLConnection()), 1000)
    );
  }
}

// 3. Feature Flag-Based Factory
export class FeatureFlagFactory implements SystemComponentFactory {
  private featureFlag: boolean;

  constructor(featureFlag: boolean) {
    this.featureFlag = featureFlag;
  }

  createDatabaseConnection(): DatabaseConnection {
    return this.featureFlag
      ? new PostgreSQLConnection()
      : new MySQLConnection();
  }

  createAPIClient(): APIClient {
    return this.featureFlag ? new GraphQLAPIClient() : new RESTAPIClient();
  }

  createLogger(): Logger {
    return new FileLogger();
  }
}

// 4. External Configuration Management
export class ConfigurableFactory implements SystemComponentFactory {
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

// Usage Example
const config = {
  dbType: 'PostgreSQL' as const,
  useGraphQL: true,
  logToFile: false,
};

const factory = new ConfigurableFactory(config);
const asyncFactory = new AsyncSystemFactory();

(async () => {
  const asyncDbConnection = await asyncFactory.createDatabaseConnection();
  asyncDbConnection.connect();

  const dbConnection = factory.createDatabaseConnection();
  dbConnection.connect();

  const apiClient = factory.createAPIClient();
  const result = await apiClient.request<
    { param: string },
    { success: boolean }
  >('/example', { param: 'test' });
  console.log('API Response:', result);
})();
