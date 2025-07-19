"use strict";
// # Lazy Initialization with Asynchronous Support
class PrinterService {
    static { this.instance = null; }
    static { this.initializationPromise = null; }
    // Private constructor to prevent direct instantiation
    constructor(mode) {
        this.mode = 'Mono'; // default mode
        this.mode = mode;
    }
    // Lazy initialization with sync method
    static getInstance(mode = 'Mono') {
        if (!PrinterService.instance) {
            PrinterService.instance = new PrinterService(mode);
        }
        return PrinterService.instance;
    }
    // Lazy initialization with async method, for async tasks before instantiation
    static async getInstanceAsync(mode = 'Mono') {
        if (PrinterService.instance) {
            return PrinterService.instance;
        }
        // Initialize the instance asynchronously if not already initialized
        if (!PrinterService.initializationPromise) {
            PrinterService.initializationPromise = (async () => {
                // Perform async initialization tasks (e.g., configuration, network calls)
                await PrinterService.asyncInitialization();
                // Create and return the singleton instance after async tasks
                PrinterService.instance = new PrinterService(mode);
                return PrinterService.instance;
            })();
        }
        // Return the initialized instance once the async task completes
        return PrinterService.initializationPromise;
    }
    // Simulate some async initialization task (e.g., fetching configuration)
    static async asyncInitialization() {
        console.log('Starting async initialization...');
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Async initialization completed.');
                resolve();
            }, 1000); // Simulating delay (e.g., fetching config)
        });
    }
    // Getter for mode
    getMode() {
        return this.mode;
    }
    // Setter for mode
    setMode(mode) {
        if (mode !== 'Mono' && mode !== 'Color' && mode !== 'GrayScale') {
            console.error(`Invalid mode: ${mode}`);
            return;
        }
        this.mode = mode;
        console.log(`Mode set to: ${mode}`);
    }
    // Prevent further modifications to the singleton instance
    static lockInstance() {
        if (PrinterService.instance) {
            Object.freeze(PrinterService.instance); // Freeze the instance to prevent modification
            console.log('PrinterService instance is locked.');
        }
    }
    // Check if the instance is frozen (immutable)
    static isImmutable() {
        return Object.isFrozen(PrinterService.instance);
    }
}
// Usage (sync)
const worker1 = PrinterService.getInstance('Color');
const worker2 = PrinterService.getInstance(); // Default mode is "Mono"
console.log(worker1 === worker2); // true, both refer to the same instance
worker1.setMode('GrayScale');
console.log(worker2.getMode()); // "GrayScale"
// Usage (async)
(async () => {
    const asyncWorker1 = await PrinterService.getInstanceAsync();
    const asyncWorker2 = await PrinterService.getInstanceAsync();
    console.log(asyncWorker1 === asyncWorker2); // true, both refer to the same instance
    asyncWorker1.setMode('Color');
    console.log(asyncWorker2.getMode()); // "Color"
})();
//# sourceMappingURL=index.js.map