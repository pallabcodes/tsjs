"use strict";
// # Complete Example: Payment Gateway Integration
// Problem: Your system uses an IPaymentProcessor interface for processing payments, but you want to integrate a third-party payment gateway with a different interface. To avoid rewriting existing code, you use the Adapter Pattern.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingPaymentGatewayAdapter = void 0;
// Step 2: Third-Party Payment Gateway
// Third-Party Payment Gateway (Incompatible Interface)
class ThirdPartyPaymentGateway {
    makePayment(paymentDetails) {
        console.log(`Payment of ${paymentDetails.totalAmount} ${paymentDetails.currencyType} processed successfully via Third-Party Gateway.`);
    }
}
// Step 3: The adapter converts the IPaymentProcessor interface into the ThirdPartyPaymentGateway interface.
// Adapter: Bridges IPaymentProcessor with ThirdPartyPaymentGateway
class PaymentGatewayAdapter {
    constructor(thirdPartyGateway) {
        this.thirdPartyGateway = thirdPartyGateway;
    }
    processPayment(amount, currency) {
        // Translate IPaymentProcessor interface to the third-party's interface
        const paymentDetails = {
            totalAmount: amount,
            currencyType: currency,
        };
        this.thirdPartyGateway.makePayment(paymentDetails);
    }
}
// Step 4: Client Code (Using the Adapter)
// Client Code
function processOrder(paymentProcessor, amount, currency) {
    paymentProcessor.processPayment(amount, currency);
}
// Instantiate the third-party payment gateway
const thirdPartyGateway = new ThirdPartyPaymentGateway();
// Use the adapter to integrate it with the existing system
const paymentProcessorAdapter = new PaymentGatewayAdapter(thirdPartyGateway);
// Process a payment using the adapter
processOrder(paymentProcessorAdapter, 100, 'USD');
/**
 * Breakdown of the Example:
 * Legacy and Modern Code Compatibility:
 *
 * The existing system uses the IPaymentProcessor interface, but the third-party library uses makePayment. The adapter bridges the gap.
 * Third-Party Libraries:
 *
 * The third-party gateway is incompatible with the system. The adapter makes it usable without modifying either the system or the library.
 * API Wrapping:
 *
 * The adapter wraps the ThirdPartyPaymentGateway API to provide the expected IPaymentProcessor interface.
 * System Abstractions:
 *
 * The adapter abstracts the details of how the third-party library works, exposing a uniform interface to the rest of the system.
 *
 * */
// ## Extending the Example for Product-Based Standards
// To cover product-based standards comprehensively, let's address additional scenarios:
//
// 1. Adapting Multiple Payment Gateways,
// The system might need to integrate multiple payment gateways, each with its own interface. The Adapter Pattern ensures a unified interface for all.
// Another Payment Gateway (Incompatible Interface)
class AnotherPaymentGateway {
    executePayment(amount, currencyCode) {
        console.log(`Payment of ${amount} ${currencyCode} completed via Another Gateway.`);
    }
}
// Adapter for Another Payment Gateway
class AnotherPaymentGatewayAdapter {
    constructor(anotherGateway) {
        this.anotherGateway = anotherGateway;
    }
    processPayment(amount, currency) {
        this.anotherGateway.executePayment(amount, currency);
    }
}
// Usage Example
const anotherGateway = new AnotherPaymentGateway();
const anotherGatewayAdapter = new AnotherPaymentGatewayAdapter(anotherGateway);
processOrder(anotherGatewayAdapter, 50, 'EUR');
// 2. Handling Dynamic Gateway Selection
// Add logic for dynamically selecting the adapter based on configuration.
// Factory for Payment Processor Adapters
class PaymentProcessorFactory {
    static getPaymentProcessor(type) {
        if (type === 'thirdParty') {
            return new PaymentGatewayAdapter(new ThirdPartyPaymentGateway());
        }
        else if (type === 'another') {
            return new AnotherPaymentGatewayAdapter(new AnotherPaymentGateway());
        }
        throw new Error('Invalid payment processor type');
    }
}
// Example Usage
const selectedProcessor = PaymentProcessorFactory.getPaymentProcessor('thirdParty');
processOrder(selectedProcessor, 200, 'GBP');
// 3. Logging and Error Handling
// Add logging and error handling in the adapter to meet production standards.
class LoggingPaymentGatewayAdapter {
    constructor(thirdPartyGateway) {
        this.thirdPartyGateway = thirdPartyGateway;
    }
    processPayment(amount, currency) {
        try {
            console.log(`[LOG] Processing payment of ${amount} ${currency}...`);
            const paymentDetails = {
                totalAmount: amount,
                currencyType: currency,
            };
            this.thirdPartyGateway.makePayment(paymentDetails);
            console.log(`[LOG] Payment processed successfully.`);
        }
        catch (error) {
            console.error(`[ERROR] Failed to process payment: ${error.message}`);
            throw error;
        }
    }
}
exports.LoggingPaymentGatewayAdapter = LoggingPaymentGatewayAdapter;
/**
 * Does This Example Fully Demonstrate the Power of the Adapter Pattern?
 * Yes, it demonstrates the core power of the Adapter Pattern:
 *
 * Solving Incompatibility: Bridging incompatible interfaces.
 * Extensibility: Supporting multiple adapters (e.g., AnotherPaymentGatewayAdapter).
 * Flexibility: Allowing dynamic runtime selection of adapters.
 * Abstraction: Hiding implementation details from the client.
 * Product Standards: Incorporating logging, error handling, and modularity.
 * However, the Adapter Pattern's applicability depends on the use case. In real-world products:
 *
 * The pattern is often combined with others (e.g., Factory Pattern for dynamic selection).
 * Scalability considerations might add complexities, such as adapter registries or dependency injection frameworks.
 *
 * */
//# sourceMappingURL=payment-gateway.js.map