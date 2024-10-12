class PrinterService {
    // Static property to hold the instance
    private static instance: PrinterService | null = null;
    // Private field with an explicit type
    private mode: string | null = null;

    private constructor() {
        // Ensure the singleton instance
        if (PrinterService.instance) {
            return PrinterService.instance;
        }
        PrinterService.instance = this;
    }

    public static getInstance(): PrinterService {
        // Provide a way to get the singleton instance
        if (!PrinterService.instance) {
            PrinterService.instance = new PrinterService();
        }
        return PrinterService.instance;
    }

    public getPrinterStatus(): string | null {
        return this.mode;
    }

    // Method to set the mode
    public setMode(mode: string): void {
        this.mode = mode;
        console.log(mode);
    }
}

// Usage
const worker1 = PrinterService.getInstance();
const worker2 = PrinterService.getInstance();

console.log(worker1 === worker2); // true

worker1.setMode("GrayScale");
worker2.setMode("Color");

console.log(worker1.getPrinterStatus()); // "Color"
console.log(worker2.getPrinterStatus()); // "Color"
