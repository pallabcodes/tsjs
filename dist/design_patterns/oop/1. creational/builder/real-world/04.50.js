"use strict";
// # 04.ts: it has some additional key features
// Key Features:
// 1. Conditional Logic: For example, caching is automatically disabled if the database is a known "no-cache" system.
// 2.Complex Validation: The system checks for valid ports, supported authentication strategies, and mutual exclusivity between configurations (e.g., error-level logging without a file path).
// 3. Defaults: Default values such as useSSL: true for the database or level: 'debug' for logging, ensuring sensible configurations if certain parameters are not provided.
// 4. This should help illustrate how you can create a builder that takes care of complex configurations with flexibility, validations, and sensible defaults.
// This illustrates how to create a builder that takes care of complex configurations with flexibility, validations, and sensible defaults.
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
        // Perform basic validation: Ensure database port is valid
        if (port <= 0 || port > 65535) {
            throw new Error('Invalid port number for the database.');
        }
        this.databaseConfig = new DatabaseConfig(host, port, username, password, useSSL);
        return this;
    }
    setApiConfig(baseURL, timeout) {
        // Perform validation: Ensure timeout is positive
        if (timeout <= 0) {
            throw new Error('API timeout must be a positive number.');
        }
        this.apiConfig = new ApiConfig(baseURL, timeout);
        return this;
    }
    setAuthConfig(strategy, tokenEndpoint) {
        // Perform validation: Ensure strategy is valid (e.g., 'JWT', 'OAuth2')
        if (!['JWT', 'OAuth2'].includes(strategy)) {
            throw new Error('Unsupported authentication strategy.');
        }
        this.authConfig = new AuthConfig(strategy, tokenEndpoint);
        return this;
    }
    setCachingConfig(enabled, type, ttlSeconds) {
        // Perform validation: Cache type must be specified if caching is enabled
        if (enabled && !type) {
            throw new Error('Cache type must be specified if caching is enabled.');
        }
        // Additional conditional logic: Disable caching if the database is a no-cache database
        if (this.databaseConfig?.host === 'no-cache-db') {
            enabled = false; // Prevent caching if the system is using a no-cache database
        }
        this.cachingConfig = new CachingConfig(enabled, type, ttlSeconds);
        return this;
    }
    setLoggingConfig(level, logToFile, logFilePath) {
        // Perform validation: Ensure logging level is valid
        if (!['debug', 'info', 'warn', 'error'].includes(level)) {
            throw new Error('Invalid logging level.');
        }
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
        // Perform complex validation (e.g., ensure no contradictory settings)
        if (this.loggingConfig?.level === 'error' &&
            this.loggingConfig?.logToFile &&
            !this.loggingConfig.logFilePath) {
            throw new Error('Error level logging requires a log file path.');
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
// Example with missing optional parameters and default values
const systemConfigWithDefaults = builder
    .setDatabaseConfig('localhost', 3306, 'root', 'root', true) // Using default SSL
    .setApiConfig('https://api.example.com', 5000)
    .setAuthConfig('OAuth2', '/auth/authorize')
    .setCachingConfig(false, 'none', 0)
    .setLoggingConfig('debug', false)
    .setFeatureFlags(false, true)
    .build();
console.log('System Config with Defaults:\n', JSON.stringify(systemConfigWithDefaults, null, 2));
//# sourceMappingURL=04.50.js.map