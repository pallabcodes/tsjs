// # Real-World Example: Config Builder for a Web Service


// Imagine you're building a web service, and you need a builder to help configure different components of the service (e.g., database, API, logging, etc.).

class DatabaseConfig {
    constructor(
        public readonly host: string,
        public readonly port: number,
        public readonly username: string,
        public readonly password: string
    ) {}
}

class ApiConfig {
    constructor(
        public readonly endpoint: string,
        public readonly apiKey: string
    ) {}
}

class LoggingConfig {
    constructor(
        public readonly level: string, // e.g., 'info', 'warn', 'error'
        public readonly logToFile: boolean
    ) {}
}

class FeatureFlags {
    constructor(
        public readonly enableFeatureA: boolean,
        public readonly enableFeatureB: boolean
    ) {}
}

class WebServiceConfig {
    readonly database: DatabaseConfig;
    readonly api: ApiConfig;
    readonly logging: LoggingConfig;
    readonly featureFlags: FeatureFlags;

    constructor(
        database: DatabaseConfig,
        api: ApiConfig,
        logging: LoggingConfig,
        featureFlags: FeatureFlags
    ) {
        this.database = database;
        this.api = api;
        this.logging = logging;
        this.featureFlags = featureFlags;
    }
}

interface ConfigBuilder {
    setDatabaseConfig(host: string, port: number, username: string, password: string): this;
    setApiConfig(endpoint: string, apiKey: string): this;
    setLoggingConfig(level: string, logToFile: boolean): this;
    setFeatureFlags(enableFeatureA: boolean, enableFeatureB: boolean): this;
    build(): WebServiceConfig;
}

class WebServiceConfigBuilder implements ConfigBuilder {
    private databaseConfig?: DatabaseConfig;
    private apiConfig?: ApiConfig;
    private loggingConfig?: LoggingConfig;
    private featureFlags?: FeatureFlags;

    setDatabaseConfig(host: string, port: number, username: string, password: string): this {
        this.databaseConfig = new DatabaseConfig(host, port, username, password);
        return this;
    }

    setApiConfig(endpoint: string, apiKey: string): this {
        this.apiConfig = new ApiConfig(endpoint, apiKey);
        return this;
    }

    setLoggingConfig(level: string, logToFile: boolean): this {
        this.loggingConfig = new LoggingConfig(level, logToFile);
        return this;
    }

    setFeatureFlags(enableFeatureA: boolean, enableFeatureB: boolean): this {
        this.featureFlags = new FeatureFlags(enableFeatureA, enableFeatureB);
        return this;
    }

    build(): WebServiceConfig {
        if (!this.databaseConfig) {
            throw new Error("Database configuration is required.");
        }
        if (!this.apiConfig) {
            throw new Error("API configuration is required.");
        }
        if (!this.loggingConfig) {
            throw new Error("Logging configuration is required.");
        }
        if (!this.featureFlags) {
            throw new Error("Feature flags are required.");
        }

        return new WebServiceConfig(
            this.databaseConfig,
            this.apiConfig,
            this.loggingConfig,
            this.featureFlags
        );
    }
}

// Usage example
const builder = new WebServiceConfigBuilder();
const webServiceConfig = builder
    .setDatabaseConfig("localhost", 5432, "admin", "password")
    .setApiConfig("https://api.example.com", "API_KEY")
    .setLoggingConfig("info", true)
    .setFeatureFlags(true, false)
    .build();

console.log(JSON.stringify(webServiceConfig, null, 2));


// Key Benefits of this Example:

// 1. Complex Object Construction: The object being built (WebServiceConfig) has multiple related components (database, API, logging, feature flags), which would be cumbersome to set up directly without a builder.

// 2. Fluent Interface: The builder uses method chaining, making it easy to read and use, especially when there are many configuration options.

// 3. Validation: The builder validates that all necessary components are set before the object is constructed, ensuring no critical configuration is missed.

// 4. Extensibility: The pattern is easy to extend. For example, if you later add a new configuration option like caching or authentication, it’s easy to add a new method to the builder and a new class to the config.

// # Real-World Applicability:

// In the real world, you often face situations where the configuration of a system involves multiple components with many optional and required parameters. Builders offer an elegant and extensible way to handle this complexity. For example:

// Database connections might involve various parameters, such as host, port, username, password, and connection options.
// API configuration could include endpoints, authentication tokens, and query parameters.
// Logging configuration may involve log levels, file paths, or loggers.
// By using the builder pattern, you can keep the construction process clear, modular, and maintainable.