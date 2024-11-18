// Add these interface definitions
interface DatabaseConnection {
  connect(): void;
  disconnect(): void;
}

interface APIClient {
  request(endpoint: string, data?: any): Promise<any>;
}

interface Logger {
  log(message: string): void;
}

interface SystemComponentFactory {
  createDatabaseConnection(): DatabaseConnection | Promise<DatabaseConnection>;
  createAPIClient(): APIClient | Promise<APIClient>;
  createLogger(): Logger;
}

class MySQLConnection implements DatabaseConnection {
  connect(): void {
    // Implementation details
  }

  disconnect(): void {
    // Implementation details
  }
}

class PostgreSQLConnection implements DatabaseConnection {
  connect(): void {
    // Implementation details
  }

  disconnect(): void {
    // Implementation details
  }
}

// 1. Object Pooling and Resource Management:
export class DatabaseConnectionPoolFactory implements SystemComponentFactory {
  private static pool: DatabaseConnection[] = [];
  private static maxPoolSize = 10;

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
    return new RESTAPIClient(); // Default client
  }

  createLogger(): Logger {
    return new ConsoleLogger(); // Default logger
  }

  static releaseConnection(connection: DatabaseConnection): void {
    DatabaseConnectionPoolFactory.pool.push(connection);
  }
}

// 2. Asynchronous Component Creation

export class AsyncSystemFactory implements SystemComponentFactory {
  async createDatabaseConnection(): Promise<DatabaseConnection> {
    return this.loadConnectionFromCloud(); // Simply return the connection directly
  }

  async createAPIClient(): Promise<APIClient> {
    return new GraphQLAPIClient(); // Always async in real-world use
  }

  createLogger(): Logger {
    return new FileLogger(); // Synchronous
  }

  private async loadConnectionFromCloud(): Promise<DatabaseConnection> {
    // Simulate async behavior (e.g., fetching credentials from cloud)
    return new Promise(resolve =>
      setTimeout(() => resolve(new MySQLConnection()), 1000)
    );
  }
}

// 3. Feature Flag-Based Factory:
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

// 4. External Configuration Management:
class ConfigurableFactory implements SystemComponentFactory {
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

class RESTAPIClient implements APIClient {
  async request(_endpoint: string, _data?: any): Promise<any> {
    // Implementation details
  }
}

class GraphQLAPIClient implements APIClient {
  async request(_endpoint: string, _data?: any): Promise<any> {
    // Implementation details
  }
}

class FileLogger implements Logger {
  log(_message: string): void {
    // Implementation details for file logging
  }
}

class ConsoleLogger implements Logger {
  log(_message: string): void {
    // Implementation details for console logging
  }
}

// Usage
const config = {
  dbType: 'PostgreSQL' as const,
  useGraphQL: true,
  logToFile: false,
};

const factory = new ConfigurableFactory(config);
const asyncFactory = new AsyncSystemFactory();
console.log(asyncFactory.createDatabaseConnection());
console.log(factory.createDatabaseConnection());
