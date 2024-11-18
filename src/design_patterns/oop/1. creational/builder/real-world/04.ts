/*
You're right! I only provided one example for ConfigBuilder without showing all of the concepts you mentioned. Let's dive deeper into a more complete example where we configure a system with complex settings, involving various components such as:

1. Database connections
2. API endpoints
3. Authentication methods
4. Caching strategies
5. Logging configuration
6. Feature flags

We'll use a Builder Pattern to manage the creation of a SystemConfig object that includes all of these settings, covering the points you mentioned:

1. Complex objects with deeply nested or interdependent properties.
2. Immutability or objects that are built over multiple stages.
3. Fluent interfaces for chaining method calls.
4. Contextual creation depending on various conditions or configuration.

# Complete Example: Configuring a Complex System Object
We'll structure the system configuration into multiple sub-configurations (database, API, authentication, etc.). Then, the builder will allow us to piece them together.

*/


// ==========================
// Sub-configuration classes
// ==========================
class DatabaseConfig {
    constructor(
        public readonly host: string,
        public readonly port: number,
        public readonly username: string,
        public readonly password: string,
        public readonly useSSL: boolean = true // Default to true if not specified
    ) {}
}

class ApiConfig {
    constructor(
        public readonly baseURL: string,
        public readonly timeout: number
    ) {}
}

class AuthConfig {
    constructor(
        public readonly strategy: string, // e.g., 'OAuth2', 'JWT'
        public readonly tokenEndpoint: string
    ) {}
}

class CachingConfig {
    constructor(
        public readonly enabled: boolean,
        public readonly type: string, // e.g., 'redis', 'memcached'
        public readonly ttlSeconds: number // Time to live in seconds
    ) {}
}

class LoggingConfig {
    constructor(
        public readonly level: string, // e.g., 'debug', 'info', 'error'
        public readonly logToFile: boolean,
        public readonly logFilePath?: string // Optional file path for logs
    ) {}
}

class FeatureFlags {
    constructor(
        public readonly enableFeatureA: boolean,
        public readonly enableFeatureB: boolean
    ) {}
}

// ==========================
// Main Configuration Class
// ==========================
class SystemConfig {
    readonly database: DatabaseConfig;
    readonly api: ApiConfig;
    readonly auth: AuthConfig;
    readonly caching: CachingConfig;
    readonly logging: LoggingConfig;
    readonly featureFlags: FeatureFlags;

    constructor(
        database: DatabaseConfig,
        api: ApiConfig,
        auth: AuthConfig,
        caching: CachingConfig,
        logging: LoggingConfig,
        featureFlags: FeatureFlags
    ) {
        this.database = database;
        this.api = api;
        this.auth = auth;
        this.caching = caching;
        this.logging = logging;
        this.featureFlags = featureFlags;
    }
}

// ==========================
// Builder Interface
// ==========================
interface ConfigBuilder {
    setDatabaseConfig(host: string, port: number, username: string, password: string, useSSL?: boolean): this;
    setApiConfig(baseURL: string, timeout: number): this;
    setAuthConfig(strategy: string, tokenEndpoint: string): this;
    setCachingConfig(enabled: boolean, type: string, ttlSeconds: number): this;
    setLoggingConfig(level: string, logToFile: boolean, logFilePath?: string): this;
    setFeatureFlags(enableFeatureA: boolean, enableFeatureB: boolean): this;
    build(): SystemConfig;
}

// ==========================
// Concrete Builder
// ==========================
class SystemConfigBuilder implements ConfigBuilder {
    private databaseConfig?: DatabaseConfig;
    private apiConfig?: ApiConfig;
    private authConfig?: AuthConfig;
    private cachingConfig?: CachingConfig;
    private loggingConfig?: LoggingConfig;
    private featureFlags?: FeatureFlags;

    setDatabaseConfig(
        host: string,
        port: number,
        username: string,
        password: string,
        useSSL: boolean = true
    ): this {
        this.databaseConfig = new DatabaseConfig(host, port, username, password, useSSL);
        return this;
    }

    setApiConfig(baseURL: string, timeout: number): this {
        this.apiConfig = new ApiConfig(baseURL, timeout);
        return this;
    }

    setAuthConfig(strategy: string, tokenEndpoint: string): this {
        this.authConfig = new AuthConfig(strategy, tokenEndpoint);
        return this;
    }

    setCachingConfig(enabled: boolean, type: string, ttlSeconds: number): this {
        this.cachingConfig = new CachingConfig(enabled, type, ttlSeconds);
        return this;
    }

    setLoggingConfig(level: string, logToFile: boolean, logFilePath?: string): this {
        this.loggingConfig = new LoggingConfig(level, logToFile, logFilePath);
        return this;
    }

    setFeatureFlags(enableFeatureA: boolean, enableFeatureB: boolean): this {
        this.featureFlags = new FeatureFlags(enableFeatureA, enableFeatureB);
        return this;
    }

    build(): SystemConfig {
        // Validate that all configurations have been set
        if (!this.databaseConfig || !this.apiConfig || !this.authConfig || !this.cachingConfig || !this.loggingConfig || !this.featureFlags) {
            throw new Error("All configurations must be set before building the system config.");
        }

        return new SystemConfig(
            this.databaseConfig,
            this.apiConfig,
            this.authConfig,
            this.cachingConfig,
            this.loggingConfig,
            this.featureFlags
        );
    }
}

// ==========================
// Usage Example
// ==========================
const builder = new SystemConfigBuilder();

try {
    // Creating a system configuration with all required details
    const systemConfig = builder
        .setDatabaseConfig("localhost", 5432, "admin", "password", false)
        .setApiConfig("https://api.example.com", 3000)
        .setAuthConfig("JWT", "/auth/token")
        .setCachingConfig(true, "redis", 3600)
        .setLoggingConfig("info", true, "/var/logs/app.log")
        .setFeatureFlags(true, false)
        .build();

    console.log("Generated System Config:\n", JSON.stringify(systemConfig, null, 2));
} catch (error) {
    if (error instanceof Error) {
        console.error("Failed to build system config:", error.message);
    }
}

// Example with missing optional parameters
const systemConfigWithDefaults = builder
    .setDatabaseConfig("localhost", 3306, "root", "root", true) // Using default SSL
    .setApiConfig("https://api.example.com", 5000)
    .setAuthConfig("OAuth2", "/auth/authorize")
    .setCachingConfig(false, "none", 0)
    .setLoggingConfig("debug", false)
    .setFeatureFlags(false, true)
    .build();

console.log("System Config with Defaults:\n", JSON.stringify(systemConfigWithDefaults, null, 2));



/*
// # output example: 

// Generated System Config:
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "username": "admin",
    "password": "password",
    "useSSL": false
  },
  "api": {
    "baseURL": "https://api.example.com",
    "timeout": 3000
  },
  "auth": {
    "strategy": "JWT",
    "tokenEndpoint": "/auth/token"
  },
  "caching": {
    "enabled": true,
    "type": "redis",
    "ttlSeconds": 3600
  },
  "logging": {
    "level": "info",
    "logToFile": true,
    "logFilePath": "/var/logs/app.log"
  },
  "featureFlags": {
    "enableFeatureA": true,
    "enableFeatureB": false
  }
}

System Config with Defaults:
{
  "database": {
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "root",
    "useSSL": true
  },
  "api": {
    "baseURL": "https://api.example.com",
    "timeout": 5000
  },
  "auth": {
    "strategy": "OAuth2",
    "tokenEndpoint": "/auth/authorize"
  },
  "caching": {
    "enabled": false,
    "type": "none",
    "ttlSeconds": 0
  },
  "logging": {
    "level": "debug",
    "logToFile": false
  },
  "featureFlags": {
    "enableFeatureA": false,
    "enableFeatureB": true
  }
}
*/


/*

Breakdown of the Concepts:
Complex Objects with Nested or Interdependent Properties:

The SystemConfig class aggregates multiple related configurations, like DatabaseConfig, ApiConfig, AuthConfig, CachingConfig, LoggingConfig, and FeatureFlags. These configurations are interdependent and must all be set before creating the final SystemConfig object.
Immutability / Multiple Stages of Construction:

Each of the sub-configuration objects is immutable once created. We use the builder to incrementally set each configuration stage by stage. Once the SystemConfig is built, it cannot be modified.
Fluent Interface:

The builder allows method chaining, so you can call multiple setter methods in a single line, making the code more readable and concise.
Contextual Creation Depending on Configuration:

The builder handles contextual configuration. For example, the setDatabaseConfig method allows setting the useSSL flag, and the setLoggingConfig method includes an optional logFilePath argument.
Further Extensions for Real-World Scenarios:
Conditional Logic: You could add logic inside the builder to handle different configurations based on certain flags (e.g., enabling/disabling caching).
Complex Validation: Instead of just checking if each configuration is present, you could add more complex validation, such as ensuring the database configuration matches certain patterns or that certain configurations are mutually exclusive.
Defaults: You can set sensible defaults for some configuration options, like enabling SSL by default for database connections, or default logging levels.
Conclusion:
This example covers all the aspects you mentioned:

It shows how to build a complex, deeply nested configuration object.
It demonstrates immutability and step-by-step construction.
It provides a fluent interface for chaining method calls.
It handles contextual configuration for different parts of the system.
This should give you a solid template for understanding how to use the Builder Pattern in more complex, real-world situations.

*/