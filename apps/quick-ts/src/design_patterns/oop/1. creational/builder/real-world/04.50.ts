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
  setDatabaseConfig(
    host: string,
    port: number,
    username: string,
    password: string,
    useSSL?: boolean
  ): this;
  setApiConfig(baseURL: string, timeout: number): this;
  setAuthConfig(strategy: string, tokenEndpoint: string): this;
  setCachingConfig(enabled: boolean, type: string, ttlSeconds: number): this;
  setLoggingConfig(
    level: string,
    logToFile: boolean,
    logFilePath?: string
  ): this;
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
    useSSL = true
  ): this {
    // Perform basic validation: Ensure database port is valid
    if (port <= 0 || port > 65535) {
      throw new Error('Invalid port number for the database.');
    }

    this.databaseConfig = new DatabaseConfig(
      host,
      port,
      username,
      password,
      useSSL
    );
    return this;
  }

  setApiConfig(baseURL: string, timeout: number): this {
    // Perform validation: Ensure timeout is positive
    if (timeout <= 0) {
      throw new Error('API timeout must be a positive number.');
    }

    this.apiConfig = new ApiConfig(baseURL, timeout);
    return this;
  }

  setAuthConfig(strategy: string, tokenEndpoint: string): this {
    // Perform validation: Ensure strategy is valid (e.g., 'JWT', 'OAuth2')
    if (!['JWT', 'OAuth2'].includes(strategy)) {
      throw new Error('Unsupported authentication strategy.');
    }

    this.authConfig = new AuthConfig(strategy, tokenEndpoint);
    return this;
  }

  setCachingConfig(enabled: boolean, type: string, ttlSeconds: number): this {
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

  setLoggingConfig(
    level: string,
    logToFile: boolean,
    logFilePath?: string
  ): this {
    // Perform validation: Ensure logging level is valid
    if (!['debug', 'info', 'warn', 'error'].includes(level)) {
      throw new Error('Invalid logging level.');
    }

    this.loggingConfig = new LoggingConfig(level, logToFile, logFilePath);
    return this;
  }

  setFeatureFlags(enableFeatureA: boolean, enableFeatureB: boolean): this {
    this.featureFlags = new FeatureFlags(enableFeatureA, enableFeatureB);
    return this;
  }

  build(): SystemConfig {
    // Validate that all configurations have been set
    if (
      !this.databaseConfig ||
      !this.apiConfig ||
      !this.authConfig ||
      !this.cachingConfig ||
      !this.loggingConfig ||
      !this.featureFlags
    ) {
      throw new Error(
        'All configurations must be set before building the system config.'
      );
    }

    // Perform complex validation (e.g., ensure no contradictory settings)
    if (
      this.loggingConfig?.level === 'error' &&
      this.loggingConfig?.logToFile &&
      !this.loggingConfig.logFilePath
    ) {
      throw new Error('Error level logging requires a log file path.');
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
    .setDatabaseConfig('localhost', 5432, 'admin', 'password', false)
    .setApiConfig('https://api.example.com', 3000)
    .setAuthConfig('JWT', '/auth/token')
    .setCachingConfig(true, 'redis', 3600)
    .setLoggingConfig('info', true, '/var/logs/app.log')
    .setFeatureFlags(true, false)
    .build();

  console.log(
    'Generated System Config:\n',
    JSON.stringify(systemConfig, null, 2)
  );
} catch (error) {
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

console.log(
  'System Config with Defaults:\n',
  JSON.stringify(systemConfigWithDefaults, null, 2)
);
