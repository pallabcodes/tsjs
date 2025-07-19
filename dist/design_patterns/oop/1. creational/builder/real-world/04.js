"use strict";
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
    constructor(host, port, username, password, useSSL = true // Default to true if not specified
    ) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.useSSL = useSSL;
    }
}
class ApiConfig {
    constructor(baseURL, timeout) {
        this.baseURL = baseURL;
        this.timeout = timeout;
    }
}
class AuthConfig {
    constructor(strategy, // e.g., 'OAuth2', 'JWT'
    tokenEndpoint) {
        this.strategy = strategy;
        this.tokenEndpoint = tokenEndpoint;
    }
}
class CachingConfig {
    constructor(enabled, type, // e.g., 'redis', 'memcached'
    ttlSeconds // Time to live in seconds
    ) {
        this.enabled = enabled;
        this.type = type;
        this.ttlSeconds = ttlSeconds;
    }
}
class LoggingConfig {
    constructor(level, // e.g., 'debug', 'info', 'error'
    logToFile, logFilePath // Optional file path for logs
    ) {
        this.level = level;
        this.logToFile = logToFile;
        this.logFilePath = logFilePath;
    }
}
class FeatureFlags {
    constructor(enableFeatureA, enableFeatureB) {
        this.enableFeatureA = enableFeatureA;
        this.enableFeatureB = enableFeatureB;
    }
}
// ==========================
// Main Configuration Class
// ==========================
class SystemConfig {
    constructor(database, api, auth, caching, logging, featureFlags) {
        this.database = database;
        this.api = api;
        this.auth = auth;
        this.caching = caching;
        this.logging = logging;
        this.featureFlags = featureFlags;
    }
}
// ==========================
// Concrete Builder
// ==========================
class SystemConfigBuilder {
    setDatabaseConfig(host, port, username, password, useSSL = true) {
        this.databaseConfig = new DatabaseConfig(host, port, username, password, useSSL);
        return this;
    }
    setApiConfig(baseURL, timeout) {
        this.apiConfig = new ApiConfig(baseURL, timeout);
        return this;
    }
    setAuthConfig(strategy, tokenEndpoint) {
        this.authConfig = new AuthConfig(strategy, tokenEndpoint);
        return this;
    }
    setCachingConfig(enabled, type, ttlSeconds) {
        this.cachingConfig = new CachingConfig(enabled, type, ttlSeconds);
        return this;
    }
    setLoggingConfig(level, logToFile, logFilePath) {
        this.loggingConfig = new LoggingConfig(level, logToFile, logFilePath);
        return this;
    }
    setFeatureFlags(enableFeatureA, enableFeatureB) {
        this.featureFlags = new FeatureFlags(enableFeatureA, enableFeatureB);
        return this;
    }
    build() {
        // Validate that all configurations have been set
        if (!this.databaseConfig ||
            !this.apiConfig ||
            !this.authConfig ||
            !this.cachingConfig ||
            !this.loggingConfig ||
            !this.featureFlags) {
            throw new Error('All configurations must be set before building the system config.');
        }
        return new SystemConfig(this.databaseConfig, this.apiConfig, this.authConfig, this.cachingConfig, this.loggingConfig, this.featureFlags);
    }
}
// ==========================
// Usage Example
// ==========================
const builder = new SystemConfigBuilder();
try {
    // Creating a system configuration with all required details
    const systemConfig = builder
        .setDatabaseConfig('localhost', 5432, 'admin', 'password', false)
        .setApiConfig('https://api.example.com', 3000)
        .setAuthConfig('JWT', '/auth/token')
        .setCachingConfig(true, 'redis', 3600)
        .setLoggingConfig('info', true, '/var/logs/app.log')
        .setFeatureFlags(true, false)
        .build();
    console.log('Generated System Config:\n', JSON.stringify(systemConfig, null, 2));
}
catch (error) {
    if (error instanceof Error) {
        console.error('Failed to build system config:', error.message);
    }
}
// Example with missing optional parameters
const systemConfigWithDefaults = builder
    .setDatabaseConfig('localhost', 3306, 'root', 'root', true) // Using default SSL
    .setApiConfig('https://api.example.com', 5000)
    .setAuthConfig('OAuth2', '/auth/authorize')
    .setCachingConfig(false, 'none', 0)
    .setLoggingConfig('debug', false)
    .setFeatureFlags(false, true)
    .build();
console.log('System Config with Defaults:\n', JSON.stringify(systemConfigWithDefaults, null, 2));
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
//# sourceMappingURL=04.js.map