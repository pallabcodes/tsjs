// The Strategy Pattern is powerful for scenarios where you need to define a family of algorithms or behaviors, encapsulate each one, and make them interchangeable dynamically at runtime. It promotes the Open/Closed Principle by allowing new strategies to be added without modifying existing code.

// Real-World Example: Payment Processing System
// Imagine an e-commerce platform where customers can choose from different payment methods such as Credit Card, PayPal, and Cryptocurrency. Each payment method has a unique implementation, but the platform should handle them seamlessly without hardcoding logic for each.
//
//                                                                                                                                                                                                                                                                          Key Features Covered:
//   Dynamic Behavior Selection:
//   Switch between different payment methods at runtime.
//   Encapsulation of Algorithms:
//   Each payment strategy is self-contained and follows a common interface.
// Extensibility:
//   Add new payment methods without modifying the existing code.
//   Interchangeability:
// Swap payment strategies easily depending on user choice or configuration.

// # Code Implementation
// ==============================
// Strategy Interface
// ==============================
interface PaymentStrategy {
  processPayment(amount: number): string;
}

// ==============================
// Concrete Strategies
// ==============================
class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  processPayment(amount: number): string {
    // Logic for processing credit card payment
    return `Processed payment of $${amount} using Credit Card: ${this.cardNumber}`;
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  processPayment(amount: number): string {
    // Logic for processing PayPal payment
    return `Processed payment of $${amount} using PayPal account: ${this.email}`;
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  processPayment(amount: number): string {
    // Logic for processing cryptocurrency payment
    return `Processed payment of $${amount} using Cryptocurrency wallet: ${this.walletAddress}`;
  }
}

// ==============================
// Context Class
// ==============================
class PaymentProcessor {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  process(amount: number): string {
    return this.strategy.processPayment(amount);
  }
}

// ==============================
// Usage Example
// ==============================
const creditCardPayment = new CreditCardPayment("1234-5678-9012-3456");
const payPalPayment = new PayPalPayment("user@example.com");
const cryptoPayment = new CryptoPayment("0xabc123...");

// Context initialization with default strategy
const paymentProcessor = new PaymentProcessor(creditCardPayment);

console.log(paymentProcessor.process(100)); // Output: Processed payment of $100 using Credit Card

// Dynamically switch to another payment strategy
paymentProcessor.setStrategy(payPalPayment);
console.log(paymentProcessor.process(200)); // Output: Processed payment of $200 using PayPal

paymentProcessor.setStrategy(cryptoPayment);
console.log(paymentProcessor.process(300)); // Output: Processed payment of $300 using Cryptocurrency
// Is This Enough to Cover the Strategy Pattern?
//   Concepts Demonstrated:
// Dynamic Behavior Selection:
//   The setStrategy method allows switching strategies at runtime.
//   Encapsulation:
// Each payment method encapsulates its logic in a separate class (CreditCardPayment, PayPalPayment, etc.).
//   Extensibility:
// Adding a new payment method (e.g., ApplePayPayment) only requires creating a new class that implements the PaymentStrategy interface—no changes to existing code.
//   Interchangeability:
// The PaymentProcessor class works with any PaymentStrategy implementation.
//   Other Real-World Scenarios for Strategy Pattern
// If you feel the example doesn't fully cover real-world standards, here are additional scenarios where the Strategy Pattern shines:
//
// Sorting Algorithms:
//   A library allowing users to switch between QuickSort, MergeSort, or BubbleSort dynamically.
//   Compression Algorithms:
//   Support for multiple file compression techniques like ZIP, RAR, or GZIP.
//   Authentication Mechanisms:
//   Switch between JWT, OAuth2, or Session-Based Authentication dynamically.
//   Routing Algorithms:
//   Choosing different navigation strategies (e.g., shortest path, fastest route, scenic route) in a mapping application.
//   File Export:
//   Generate reports in PDF, Excel, or CSV formats.


// Does This Example Fully Show the Power of Strategy Pattern?
//   Yes, this example is sufficient for most real-world cases in product-based standards because:
//   It demonstrates dynamic behavior selection, extensibility, and encapsulation of algorithms.
//   It uses a modular design to adapt to business requirements like adding new payment methods.
//   However, for comprehensive understanding, consider additional scenarios:
//   Use the pattern in domains like sorting, compression, or authentication for a broader perspective.
//   Consider integrations with frameworks or libraries in actual projects to see how the Strategy Pattern interacts with larger systems.
//   By combining this example with the outlined scenarios, you'll have a solid understanding of the Strategy Pattern and how to apply it in real-world product-based applications.


// ### Strategy Pattern in Additional Domains

// To expand the perspective on the **Strategy Pattern**, let's implement it in different domains, focusing on sorting, compression, and authentication. This demonstrates its applicability and flexibility in various real-world contexts. We'll also consider framework integrations to showcase how the pattern works in larger systems.


// ### 1. **Sorting Algorithms**

// A common use case is dynamically selecting a sorting algorithm based on input size or other parameters.

// Strategy Interface
interface SortStrategy {
    sort(data: number[]): number[];
}

// Concrete Strategies
class QuickSort implements SortStrategy {
    sort(data: number[]): number[] {
        // Simplified quicksort logic
        return data.sort((a, b) => a - b);
    }
}

class BubbleSort implements SortStrategy {
    sort(data: number[]): number[] {
        // Simplified bubble sort logic
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data.length - i - 1; j++) {
                if (data[j] > data[j + 1]) {
                    [data[j], data[j + 1]] = [data[j + 1], data[j]];
                }
            }
        }
        return data;
    }
}

// Context Class
class SortingContext {
    private strategy: SortStrategy;

    constructor(strategy: SortStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: SortStrategy): void {
        this.strategy = strategy;
    }

    sort(data: number[]): number[] {
        return this.strategy.sort(data);
    }
}

// Usage Example
const data = [5, 2, 9, 1, 5, 6];
const context = new SortingContext(new QuickSort());

console.log('QuickSort:', context.sort(data)); // Output: [1, 2, 5, 5, 6, 9]

// context.setStrategy(new BubbleSort());
// console.log('BubbleSort:', context.sort(data)); // Output: [1, 2, 5, 5, 6, 9]

// ### 2. **Compression Algorithms**

// Dynamically choosing a compression algorithm based on file type or user preference.

// Strategy Interface
interface CompressionStrategy {
    compress(files: string[]): string;
}

// Concrete Strategies
class ZipCompression implements CompressionStrategy {
    compress(files: string[]): string {
        return `Compressed ${files.length} files into a ZIP archive.`;
    }
}

class GzipCompression implements CompressionStrategy {
    compress(files: string[]): string {
        return `Compressed ${files.length} files into a GZIP archive.`;
    }
}

// Context Class
class CompressionContext {
    private strategy: CompressionStrategy;

    constructor(strategy: CompressionStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: CompressionStrategy): void {
        this.strategy = strategy;
    }

    compressFiles(files: string[]): string {
        return this.strategy.compress(files);
    }
}

// Usage Example
const files = ['file1.txt', 'file2.txt', 'file3.txt'];
const compressionContext = new CompressionContext(new ZipCompression());

console.log(compressionContext.compressFiles(files)); // Output: Compressed 3 files into a ZIP archive.

compressionContext.setStrategy(new GzipCompression());
console.log(compressionContext.compressFiles(files)); // Output: Compressed 3 files into a GZIP archive.


// ### 3. **Authentication Mechanisms**

// Switching between different authentication methods like JWT, OAuth2, or Session-Based Authentication.

// Strategy Interface
interface AuthStrategy {
    authenticate(user: string, password: string): string;
}

// Concrete Strategies
class JwtAuth implements AuthStrategy {
    authenticate(user: string, password: string): string {
        return `${user} authenticated using JWT.`;
    }
}

class OAuth2Auth implements AuthStrategy {
    authenticate(user: string, password: string): string {
        return `${user} authenticated using OAuth2.`;
    }
}

class SessionAuth implements AuthStrategy {
    authenticate(user: string, password: string): string {
        return `${user} authenticated using Session-Based Authentication.`;
    }
}

// Context Class
class AuthContext {
    private strategy: AuthStrategy;

    constructor(strategy: AuthStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: AuthStrategy): void {
        this.strategy = strategy;
    }

    authenticateUser(user: string, password: string): string {
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


export class SortComponent {
    data = [5, 2, 9, 1, 5, 6];
    sortedData: number[] = [];

    constructor(private sortService: SortService) {}

    useQuickSort() {
        this.sortService.setStrategy(new QuickSort());
        this.sortedData = this.sortService.sort(this.data);
    }

    useBubbleSort() {
        this.sortService.setStrategy(new BubbleSort());
        this.sortedData = this.sortService.sort(this.data);
    }
}

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