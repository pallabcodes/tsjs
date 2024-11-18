// @ts-nocheck

// 1. Object Pooling and Resource Management:
class DatabaseConnectionPoolFactory implements SystemComponentFactory {
    private static pool: DatabaseConnection[] = [];
    private static maxPoolSize = 10;

    createDatabaseConnection(): DatabaseConnection {
        if (DatabaseConnectionPoolFactory.pool.length > 0) {
            return DatabaseConnectionPoolFactory.pool.pop()!;
        }
        if (DatabaseConnectionPoolFactory.pool.length < DatabaseConnectionPoolFactory.maxPoolSize) {
            return new MySQLConnection();
        }
        throw new Error("Max pool size reached");
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

class AsyncSystemFactory implements SystemComponentFactory {
    async createDatabaseConnection(): Promise<DatabaseConnection> {
        const connection = await this.loadConnectionFromCloud(); // Simulated async load
        return new MySQLConnection();
    }

    async createAPIClient(): Promise<APIClient> {
        return new GraphQLAPIClient(); // Always async in real-world use
    }

    createLogger(): Logger {
        return new FileLogger(); // Synchronous
    }

    private async loadConnectionFromCloud(): Promise<DatabaseConnection> {
        // Simulate async behavior (e.g., fetching credentials from cloud)
        return new Promise(resolve => setTimeout(() => resolve(new MySQLConnection()), 1000));
    }
}

// 3. Feature Flag-Based Factory:
class FeatureFlagFactory implements SystemComponentFactory {
    private featureFlag: boolean;

    constructor(featureFlag: boolean) {
        this.featureFlag = featureFlag;
    }

    createDatabaseConnection(): DatabaseConnection {
        return this.featureFlag ? new PostgreSQLConnection() : new MySQLConnection();
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
    private config: any;

    constructor(config: any) {
        this.config = config;
    }

    createDatabaseConnection(): DatabaseConnection {
        switch (this.config.dbType) {
            case 'PostgreSQL':
                return new PostgreSQLConnection();
            case 'MySQL':
            default:
                return new MySQLConnection();
        }
    }

    createAPIClient(): APIClient {
        return this.config.useGraphQL ? new GraphQLAPIClient() : new RESTAPIClient();
    }

    createLogger(): Logger {
        return this.config.logToFile ? new FileLogger() : new ConsoleLogger();
    }
}

// Usage
const config = { dbType: 'PostgreSQL', useGraphQL: true, logToFile: false };
const factory = new ConfigurableFactory(config);