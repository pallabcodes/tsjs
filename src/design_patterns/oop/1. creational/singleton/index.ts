// # Lazy initialization
class PrinterService {
  // Static property to hold the instance
  private static instance: PrinterService;
  // Private field with an explicit type
  private mode = 'Mono'; // default mode

  // Constructor only initializes properties as done below

  private constructor(mode: string) {
    this.mode = mode;
  }

  // getInstance() handles lazy initialization and ensures a single instance.
  public static getInstance(mode = 'Mono'): PrinterService {
    // Provide a way to get the singleton instance
    if (!PrinterService.instance) {
      PrinterService.instance = new PrinterService(mode);
    }
    return PrinterService.instance;
  }

  // Async initialization with lazy instantiation
  public static async getInstanceAsync(mode = 'Mono'): Promise<PrinterService> {
    if (!PrinterService.instance) {
      // Perform an async task (e.g., fetch configuration, etc.) before instance creation
      await PrinterService.asyncInitialization();

      // Initialize the instance after async task completes
      PrinterService.instance = new PrinterService(mode);
    }
    return PrinterService.instance;
  }

  // Async method to simulate some initialization task (e.g., fetching configuration)
  private static async asyncInitialization() {
    console.log('Starting async initialization...');
    return new Promise<void>(resolve => {
      setTimeout(() => {
        console.log('Async initialization completed.');
        resolve();
      }, 1000); // Simulating async delay (e.g., fetching config)
    });
  }

  // Getter for mode
  public getMode(): string {
    return this.mode;
  }

  // Setter for mode
  public setMode(mode: string): void {
    if (mode !== 'Mono' && mode !== 'Color' && mode !== 'GrayScale') {
      console.error(`Invalid mode: ${mode}`);
      return;
    }
    this.mode = mode;
    console.log(`Mode set to: ${mode}`);
  }

  private static isImmutable(): boolean {
    return Object.isFrozen(PrinterService.instance);
  }

  public static lockInstance() {
    Object.freeze(PrinterService.instance); // Freeze the instance
  }
}

// Usage (sync)
const worker1 = PrinterService.getInstance('Color');
const worker2 = PrinterService.getInstance(); // Default mode is "Mono"

console.log(worker1 === worker2); // true

worker1.setMode('GrayScale');
console.log(worker2.getMode()); // "GreyScale"

// usage (async)
(async () => {
  const asyncWorker1 = await PrinterService.getInstanceAsync();
  const asyncWorker2 = await PrinterService.getInstanceAsync();

  console.log(asyncWorker1 === asyncWorker2); // true

  worker1.setMode('GrayScale');
  console.log(worker2.getMode()); // "GrayScale"
})();
