// Interface for the configuration, ensuring both 'apiUrl' and 'logLevel' are present.
interface Config {
  apiUrl: string; // The base URL for the API
  logLevel: string; // The log level for logging (e.g., 'info', 'debug')
}

// 1. **Database Connection Manager (Singleton)**
// Ensuring a single database connection is used throughout the app.
class DatabaseConnection {
  private static instance: DatabaseConnection;

  private constructor() {
    // Initialize the connection here (e.g., MongoDB, MySQL, etc.)
    console.log('Database connection established.');
  }

  // Provides global access to the single instance of DatabaseConnection
  static getInstance(): DatabaseConnection {
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
  private static instance: Logger;

  private constructor() {
    // Initialize logging mechanism (e.g., Console, File, etc.)
  }

  // Provides global access to the Logger instance
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Method for logging general messages
  log(message: string) {
    console.log(`[Log]: ${message}`);
  }

  // Method for logging error messages
  error(message: string) {
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
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    // Initialize with default configuration values
    this.config = {
      apiUrl: 'https://api.example.com', // Default API URL
      logLevel: 'info', // Default log level
    };
  }

  // Provides global access to the single instance of ConfigManager
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // Get the current configuration
  getConfig(): Config {
    return this.config;
  }

  // Update the configuration with new values
  updateConfig(config: Partial<Config>): void {
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
  private static instance: CacheService;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
  }

  // Provides global access to the single instance of CacheService
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Retrieve data from the cache
  get(key: string): any {
    return this.cache.get(key);
  }

  // Set data into the cache
  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  // Clear the cache
  clear(): void {
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
  private static instance: SessionManager;
  private userSessions: Map<string, string>;

  private constructor() {
    this.userSessions = new Map();
  }

  // Provides global access to the single instance of SessionManager
  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  // Start a session for a user
  startSession(userId: string, sessionId: string): void {
    this.userSessions.set(userId, sessionId);
    console.log(`Session started for ${userId} with session ID ${sessionId}`);
  }

  // End a session for a user
  endSession(userId: string): void {
    this.userSessions.delete(userId);
    console.log(`Session ended for ${userId}`);
  }

  // Get the session for a user
  getSession(userId: string): string | undefined {
    return this.userSessions.get(userId);
  }
}

// Usage Example for Session Manager
const sessionManager1 = SessionManager.getInstance();
sessionManager1.startSession('user_123', 'session_abc');

const sessionManager2 = SessionManager.getInstance();
console.log(sessionManager2.getSession('user_123')); // session_abc

console.log(sessionManager1 === sessionManager2); // true, both are the same instance
