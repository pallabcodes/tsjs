"use strict";
// The Strategy Pattern is powerful for scenarios where you need to define a family of algorithms or behaviors, encapsulate each one, and make them interchangeable dynamically at runtime. It promotes the Open/Closed Principle by allowing new strategies to be added without modifying existing code.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortComponent = void 0;
// ==============================
// Concrete Strategies
// ==============================
class CreditCardPayment {
    constructor(cardNumber) {
        this.cardNumber = cardNumber;
    }
    processPayment(amount) {
        // Logic for processing credit card payment
        return `Processed payment of $${amount} using Credit Card: ${this.cardNumber}`;
    }
}
class PayPalPayment {
    constructor(email) {
        this.email = email;
    }
    processPayment(amount) {
        // Logic for processing PayPal payment
        return `Processed payment of $${amount} using PayPal account: ${this.email}`;
    }
}
class CryptoPayment {
    constructor(walletAddress) {
        this.walletAddress = walletAddress;
    }
    processPayment(amount) {
        // Logic for processing cryptocurrency payment
        return `Processed payment of $${amount} using Cryptocurrency wallet: ${this.walletAddress}`;
    }
}
// ==============================
// Context Class
// ==============================
class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    process(amount) {
        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        return this.strategy.processPayment(amount);
    }
}
// ==============================
// Usage Example
// ==============================
const creditCardPayment = new CreditCardPayment('1234-5678-9012-3456');
const payPalPayment = new PayPalPayment('user@example.com');
const cryptoPayment = new CryptoPayment('0xabc123...');
// Context initialization with default strategy
const paymentProcessor = new PaymentProcessor(creditCardPayment);
console.log(paymentProcessor.process(100)); // Output: Processed payment of $100 using Credit Card
// Dynamically switch to another payment strategy
paymentProcessor.setStrategy(payPalPayment);
console.log(paymentProcessor.process(200)); // Output: Processed payment of $200 using PayPal
paymentProcessor.setStrategy(cryptoPayment);
console.log(paymentProcessor.process(300)); // Output: Processed payment of $300 using Cryptocurrency
// Concrete Strategies
class QuickSort {
    sort(data) {
        // Simplified quicksort logic
        return data.sort((a, b) => a - b);
    }
}
class BubbleSort {
    sort(data) {
        const sortedData = [...data];
        for (let i = 0; i < sortedData.length; i++) {
            for (let j = 0; j < sortedData.length - i - 1; j++) {
                if (sortedData[j] > sortedData[j + 1]) {
                    const temp = sortedData[j];
                    sortedData[j] = sortedData[j + 1];
                    sortedData[j + 1] = temp;
                }
            }
        }
        return sortedData;
    }
}
// Context Class
class SortingContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    sort(data) {
        return this.strategy.sort(data);
    }
}
// Usage Example
const data = [5, 2, 9, 1, 5, 6];
const context = new SortingContext(new QuickSort());
console.log('QuickSort:', context.sort(data)); // Output: [1, 2, 5, 5, 6, 9]
// Concrete Strategies
class ZipCompression {
    compress(files) {
        return `Compressed ${files.length} files into a ZIP archive.`;
    }
}
class GzipCompression {
    compress(files) {
        return `Compressed ${files.length} files into a GZIP archive.`;
    }
}
// Context Class
class CompressionContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    compressFiles(files) {
        return this.strategy.compress(files);
    }
}
// Usage Example
const files = ['file1.txt', 'file2.txt', 'file3.txt'];
const compressionContext = new CompressionContext(new ZipCompression());
console.log(compressionContext.compressFiles(files)); // Output: Compressed 3 files into a ZIP archive.
compressionContext.setStrategy(new GzipCompression());
console.log(compressionContext.compressFiles(files)); // Output: Compressed 3 files into a GZIP archive.
// Concrete Strategies
class JwtAuth {
    authenticate(user, _password) {
        return `${user} authenticated using JWT.`;
    }
}
class OAuth2Auth {
    authenticate(user, _password) {
        return `${user} authenticated using OAuth2.`;
    }
}
class SessionAuth {
    authenticate(user, _password) {
        return `${user} authenticated using Session-Based Authentication.`;
    }
}
// Context Class
class AuthContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    authenticateUser(user, password) {
        return this.strategy.authenticate(user, password);
    }
}
// Usage Example
const authContext = new AuthContext(new JwtAuth());
console.log(authContext.authenticateUser('Alice', 'password123')); // Output: Alice authenticated using JWT.
authContext.setStrategy(new OAuth2Auth());
console.log(authContext.authenticateUser('Bob', 'password456')); // Output: Bob authenticated using OAuth2.
authContext.setStrategy(new SessionAuth());
console.log(authContext.authenticateUser('Charlie', 'password789')); // Output: Charlie authenticated using Session-Based Authentication.
// ### Framework Integration: Strategy Pattern in Larger Systems
// #### Example: Sorting with Angular Services
// In a real Angular project, you might use the **Strategy Pattern** in services to switch behaviors dynamically. For example:
// @Injectable({ providedIn: 'root' })
// export class SortService {
//   private strategy: SortStrategy;
//
//   constructor() {
//     this.strategy = new QuickSort(); // Default strategy
//   }
//
//   setStrategy(strategy: SortStrategy): void {
//     this.strategy = strategy;
//   }
//
//   sort(data: number[]): number[] {
//     return this.strategy.sort(data);
//   }
// }
//
// // Usage in a Component
// @Component({
//   selector: 'app-sort',
//   template: `
//         <button (click)="useQuickSort()">Quick Sort</button>
//         <button (click)="useBubbleSort()">Bubble Sort</button>
//         <div>{{ sortedData }}</div>
//     `
// })
// export class SortComponent {
//   data = [5, 2, 9, 1, 5, 6];
//   sortedData: number[] = [];
//
//   constructor(private sortService: SortService) {}
//
//   useQuickSort() {
//     this.sortService.setStrategy(new QuickSort());
//     this.sortedData = this.sortService.sort(this.data);
//   }
//
//   useBubbleSort() {
//     this.sortService.setStrategy(new BubbleSort());
//     this.sortedData = this.sortService.sort(this.data);
//   }
// }
// Add this service class before the SortComponent
class SortService {
    constructor() {
        this.strategy = new QuickSort(); // Default strategy
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    sort(data) {
        return this.strategy.sort(data);
    }
}
class SortComponent {
    constructor(sortService) {
        this.sortService = sortService;
        this.data = [5, 2, 9, 1, 5, 6];
        this.sortedData = [];
    }
    useQuickSort() {
        this.sortService.setStrategy(new QuickSort());
        this.sortedData = this.sortService.sort([...this.data]);
    }
    useBubbleSort() {
        this.sortService.setStrategy(new BubbleSort());
        this.sortedData = this.sortService.sort([...this.data]);
    }
}
exports.SortComponent = SortComponent;
//
// ### Does This Example Cover the Full Power of the Strategy Pattern?
//
// #### **Yes, these examples collectively demonstrate:**
// 1. **Sorting**: Interchangeable algorithms depending on input.
// 2. **Compression**: Contextual behavior based on file type.
// 3. **Authentication**: Dynamic selection of authentication strategies.
// 4. **Framework Integration**: Integration with Angular services for real-world applicability.
//
// #### **What else can be explored?**
// - Use in **logging strategies** for different logging backends (file, console, remote server).
// - **Pricing engines** for dynamic discount strategies in e-commerce.
//
//   By incorporating these examples, this collection serves as a comprehensive template for mastering the Strategy Pattern in various real-world scenarios.
//# sourceMappingURL=01.js.map