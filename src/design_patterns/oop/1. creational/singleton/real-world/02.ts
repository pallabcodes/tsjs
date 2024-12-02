class Logger {
  private static instance: Logger | null = null;
  private static initializationPromise: Promise<Logger> | null = null;

  private constructor() {
    // Simulate the logger setup, like opening a file or network stream
    console.log('Logger initialized');
  }

  public static async getInstance(): Promise<Logger> {
    if (Logger.instance) {
      return Logger.instance;
    }

    // Ensure only one instance is initialized, handle async initialization if needed
    if (!Logger.initializationPromise) {
      Logger.initializationPromise = (async () => {
        const instance = new Logger();
        try {
          await instance.initialize();
          return instance;
        } catch (error) {
          console.error('Error initializing Logger:', error);
          throw new Error('Logger initialization failed.');
        }
      })();
    }

    Logger.instance = await Logger.initializationPromise;
    return Logger.instance;
  }

  private async initialize(): Promise<void> {
    // Simulating asynchronous setup, such as opening a log file or establishing a network connection
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('Logger setup complete.');
        resolve(null);
      }, 1000);
    });
  }

  public log(message: string): void {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`);
  }

  public error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  }
}

// Usage example
(async () => {
  const logger1 = await Logger.getInstance();
  logger1.log('Application started');

  const logger2 = await Logger.getInstance();
  logger2.error('An error occurred');

  console.log('Are both logger instances the same?', logger1 === logger2); // true
})();
