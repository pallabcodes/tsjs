/**
 * Complete Real-World Example: Enhancing a Logger with the Decorator Pattern
 * Let's consider a logging system where:
 *
 * A BaseLogger provides basic logging.
 *   Additional responsibilities can be layered:
 *   TimestampLogger adds timestamps to log messages.
 *   FileLogger writes logs to a file.
 *   ErrorLevelLogger filters logs by severity levels.
 *   We’ll build a flexible logging system using the Decorator Pattern.
 * */

// ==========================
// Component Interface
// ==========================
interface Logger {
  log(message: string): void;
}

// ==========================
// Concrete Component
// ==========================
class BaseLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

// ==========================
// Abstract Decorator
// ==========================
abstract class LoggerDecorator implements Logger {
  protected readonly wrapped: Logger;

  constructor(logger: Logger) {
    this.wrapped = logger;
  }

  log(message: string): void {
    this.wrapped.log(message);
  }
}

// ==========================
// Concrete Decorators
// ==========================

// Adds a timestamp to the log message
class TimestampLogger extends LoggerDecorator {
  log(message: string): void {
    const timestamp = new Date().toISOString();
    super.log(`[${timestamp}] ${message}`);
  }
}

// Writes the log message to a file
class FileLogger extends LoggerDecorator {
  private readonly filePath: string;

  constructor(logger: Logger, filePath: string) {
    super(logger);
    this.filePath = filePath;
  }

  log(message: string): void {
    // Simulate writing to a file (for demo purposes, print to console)
    console.log(`(Writing to ${this.filePath}): ${message}`);
    super.log(message);
  }
}

// Filters log messages by error level
class ErrorLevelLogger extends LoggerDecorator {
  private readonly level: string;

  constructor(logger: Logger, level: string) {
    super(logger);
    this.level = level;
  }

  log(message: string): void {
    if (message.includes(`[${this.level}]`)) {
      super.log(message);
    }
  }
}

// ==========================
// Usage Example
// ==========================
const baseLogger = new BaseLogger();

const timestampLogger = new TimestampLogger(baseLogger);
const errorLogger = new ErrorLevelLogger(timestampLogger, "ERROR");
const fileLogger = new FileLogger(errorLogger, "/var/logs/app.log");

// Logs with timestamps, filters by level, and writes to file
fileLogger.log("[INFO] This is an informational message."); // Not logged by ErrorLevelLogger
fileLogger.log("[ERROR] This is an error message.");        // Logs to file with timestamp

// Example: Simpler chain
const simpleLogger = new TimestampLogger(new BaseLogger());
simpleLogger.log("A simple timestamped log.");


/**
 *
 * Breakdown of Concepts
 * Extending Functionality Dynamically:
 *
 * The decorators (TimestampLogger, FileLogger, ErrorLevelLogger) dynamically add or modify behavior without changing the original BaseLogger.
 * Composing Behaviors through Layering:
 *
 * Decorators can be layered in any order or combination, providing immense flexibility.
 * Open/Closed Principle:
 *
 * You can extend logging behavior by creating new decorators, without modifying existing classes.
 * Flexibility in Responsibilities:
 *
 * Responsibilities like timestamping, writing to a file, or filtering logs are applied only as needed.
 * Avoiding Subclass Explosion:
 *
 * Without the Decorator Pattern, you would need multiple subclasses (e.g., FileTimestampLogger, ErrorFileLogger) to handle every combination of behaviors.
 * Additional Real-World Scenarios
 * To ensure the example covers everything, let’s outline other Decorator Pattern use cases:
 *
 * UI Component Styling (e.g., Borders, Shadows, Colors):
 *
 * A TextView can be decorated with BorderDecorator, ShadowDecorator, or ColorDecorator.
 * Example: Add rounded corners, drop shadows, and gradient backgrounds to UI elements.
 * Data Processing Pipelines:
 *
 * Input data can be decorated with various processing steps:
 * EncryptionDecorator
 * CompressionDecorator
 * ValidationDecorator
 * Middleware in Web Frameworks (e.g., Express.js):
 *
 * Middleware functions decorate the request/response lifecycle:
 * AuthenticationMiddleware
 * LoggingMiddleware
 * RateLimitingMiddleware
 * Payment Systems:
 *
 * Decorate payment gateways:
 * TaxCalculatorDecorator
 * DiscountApplierDecorator
 * CurrencyConverterDecorator
 * Is the Logger Example Enough?
 * Strengths of the Logger Example:
 * Demonstrates the core features of the Decorator Pattern:
 * Dynamic layering of functionality.
 * Open/closed principle.
 * Flexibility in combining behaviors.
 * It’s a realistic scenario, relevant for product-based systems (logging is ubiquitous).
 * Covers common concepts like chaining decorators (TimestampLogger → ErrorLevelLogger → FileLogger).
 * Limitations of the Logger Example:
 * It doesn’t demonstrate other industries or domains where the pattern can shine (e.g., UI or data processing pipelines).
 * Logger behavior is relatively simple compared to systems like UI frameworks or middleware pipelines.
 * Conclusion
 * The Logger Example is a solid introduction and realistic enough for learning the Decorator Pattern in real-world scenarios. It demonstrates the flexibility and extensibility of the pattern well. However, if you want to explore its full power across domains, consider additional examples like:
 *
 * Middleware Chains for Web Frameworks (real-world HTTP request handling).
 * Data Processing Pipelines (complex behavior for ETL systems).
 * UI Component Composition (styling and interaction).
 * Final Verdict
 * For product-based standards, the Logger Example does cover the core concepts, but supplementing it with one or two domain-specific examples (e.g., middleware or UI components) will provide a more complete understanding of the Decorator Pattern.
 *
 *
 * */