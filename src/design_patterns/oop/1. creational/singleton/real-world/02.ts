// 1. Logging System Singleton

// In a logging system, you want to avoid creating multiple instances of the logger, which could result in inconsistencies in logs, performance issues, or redundant operations. By using the Singleton Pattern, you ensure that only one logger instance handles all log operations.

class Logger {
  private static instance: Logger;

  private constructor() {
    // Simulating logger initialization, like opening a file or network stream
    console.log('Logger initialized');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log(message: string): void {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  }

  public error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }
}

// Usage
const logger1 = Logger.getInstance();
logger1.log('Application started');

const logger2 = Logger.getInstance();
logger2.error('An error occurred');

console.log('Are both logger instances the same?', logger1 === logger2); // true

// Explanation:
// Logger Class: A singleton logger is implemented to ensure that only one instance is used to log messages.
// Methods: The log() and error() methods print log messages with timestamps. The getInstance() method ensures the same logger instance is returned every time.
