"use strict";
// 1. **Database Connection Manager (Singleton)**
// Ensuring a single database connection is used throughout the app.
class DatabaseConnection {
    constructor() {
        // Initialize the connection here (e.g., MongoDB, MySQL, etc.)
        console.log('Database connection established.');
    }
    // Provides global access to the single instance of DatabaseConnection
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    // Simulate a database connection
    connect() {
        console.log('Connected to the database.');
    }
}
// Usage Example for Database Connection Manager
const dbConnection1 = DatabaseConnection.getInstance();
dbConnection1.connect();
const dbConnection2 = DatabaseConnection.getInstance();
dbConnection2.connect();
console.log(dbConnection1 === dbConnection2); // true, both are the same instance
// 2. **Logging Service (Singleton)**
// A Logger class that ensures a single instance for logging across the application.
class Logger {
    constructor() {
        // Initialize logging mechanism (e.g., Console, File, etc.)
    }
    // Provides global access to the Logger instance
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    // Method for logging general messages
    log(message) {
        console.log(`[Log]: ${message}`);
    }
    // Method for logging error messages
    error(message) {
        console.error(`[Error]: ${message}`);
    }
}
// Usage Example for Logger
const logger1 = Logger.getInstance();
logger1.log('This is a log message');
const logger2 = Logger.getInstance();
logger2.error('This is an error message');
console.log(logger1 === logger2); // true, both are the same instance
// 3. **Configuration Manager (Singleton)**
// A Configuration manager ensuring a global, single point for managing app configurations.
class ConfigManager {
    constructor() {
        // Initialize with default configuration values
        this.config = {
            apiUrl: 'https://api.example.com', // Default API URL
            logLevel: 'info', // Default log level
        };
    }
    // Provides global access to the single instance of ConfigManager
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    // Get the current configuration
    getConfig() {
        return this.config;
    }
    // Update the configuration with new values
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
// Usage Example for Configuration Manager
const configManager1 = ConfigManager.getInstance();
console.log(configManager1.getConfig()); // { apiUrl: 'https://api.example.com', logLevel: 'info' }
configManager1.updateConfig({ logLevel: 'debug' });
console.log(configManager1.getConfig()); // { apiUrl: 'https://api.example.com', logLevel: 'debug' }
const configManager2 = ConfigManager.getInstance();
console.log(configManager1 === configManager2); // true, both are the same instance
// 4. **Cache Service (Singleton)**
// A caching service to ensure there's only one cache used throughout the app.
class CacheService {
    constructor() {
        this.cache = new Map();
    }
    // Provides global access to the single instance of CacheService
    static getInstance() {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }
    // Retrieve data from the cache
    get(key) {
        return this.cache.get(key);
    }
    // Set data into the cache
    set(key, value) {
        this.cache.set(key, value);
    }
    // Clear the cache
    clear() {
        this.cache.clear();
    }
}
// Usage Example for Cache Service
const cache1 = CacheService.getInstance();
cache1.set('user_123', { name: 'John Doe' });
const cache2 = CacheService.getInstance();
console.log(cache2.get('user_123')); // { name: 'John Doe' }
console.log(cache1 === cache2); // true, both are the same instance
// 5. **Session Manager (Singleton)**
// A session manager to handle user sessions globally across the application.
class SessionManager {
    constructor() {
        this.userSessions = new Map();
    }
    // Provides global access to the single instance of SessionManager
    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }
    // Start a session for a user
    startSession(userId, sessionId) {
        this.userSessions.set(userId, sessionId);
        console.log(`Session started for ${userId} with session ID ${sessionId}`);
    }
    // End a session for a user
    endSession(userId) {
        this.userSessions.delete(userId);
        console.log(`Session ended for ${userId}`);
    }
    // Get the session for a user
    getSession(userId) {
        return this.userSessions.get(userId);
    }
}
// Usage Example for Session Manager
const sessionManager1 = SessionManager.getInstance();
sessionManager1.startSession('user_123', 'session_abc');
const sessionManager2 = SessionManager.getInstance();
console.log(sessionManager2.getSession('user_123')); // session_abc
console.log(sessionManager1 === sessionManager2); // true, both are the same instance
//# sourceMappingURL=all-usages.js.map