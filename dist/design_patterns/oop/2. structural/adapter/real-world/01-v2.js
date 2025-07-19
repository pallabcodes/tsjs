"use strict";
// # Handle Errors Gracefully
// We should handle errors and convert them into a uniform format that the rest of the system can understand, regardless of the source of the error. This will ensure that the system behaves consistently even when one of the payment gateways throws an error.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquarePaymentAdapter = exports.PayPalPaymentAdapter = exports.StripePaymentAdapter = void 0;
// 1. Custom Error Class
// Let’s define a custom error class for errors we might encounter.
class PaymentError extends Error {
    constructor(message, gateway) {
        super(message);
        this.gateway = gateway;
        this.name = 'PaymentError';
    }
}
// 2. Updating Adapters with Error Handling
// Now, let's update the adapters to handle errors gracefully by catching them and throwing a PaymentError with a consistent message format.
class StripePaymentAdapter {
    constructor(stripePayment, logger) {
        this.stripePayment = stripePayment;
        this.logger = logger;
    }
    processPayment(amount, currency) {
        try {
            this.logger.log(`Processing payment via Stripe: ${amount} ${currency}`);
            return this.stripePayment.processStripePayment(amount, currency);
        }
        catch (error) {
            throw new PaymentError(`Error processing payment via Stripe: ${error.message}`, 'Stripe');
        }
    }
}
exports.StripePaymentAdapter = StripePaymentAdapter;
class PayPalPaymentAdapter {
    constructor(paypalPayment, logger) {
        this.paypalPayment = paypalPayment;
        this.logger = logger;
    }
    processPayment(amount, currency) {
        try {
            this.logger.log(`Processing payment via PayPal: ${amount} ${currency}`);
            return this.paypalPayment.processPayPalPayment(amount, currency);
        }
        catch (error) {
            throw new PaymentError(`Error processing payment via PayPal: ${error.message}`, 'PayPal');
        }
    }
}
exports.PayPalPaymentAdapter = PayPalPaymentAdapter;
class SquarePaymentAdapter {
    constructor(squarePayment, logger) {
        this.squarePayment = squarePayment;
        this.logger = logger;
    }
    processPayment(amount, currency) {
        try {
            this.logger.log(`Processing payment via Square: ${amount} ${currency}`);
            return this.squarePayment.processSquarePayment(amount, currency);
        }
        catch (error) {
            throw new PaymentError(`Error processing payment via Square: ${error.message}`, 'Square');
        }
    }
}
exports.SquarePaymentAdapter = SquarePaymentAdapter;
// 3. Usage Example with Error Handling : Now, let’s demonstrate error handling
// Add PaymentProcessor class before usage
class PaymentProcessor {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    process(amount, currency) {
        return this.paymentGateway.processPayment(amount, currency);
    }
}
// Create mock implementations
const mockLogger = {
    log: (message) => console.log(`[Log]: ${message}`),
};
const mockStripePayment = { processStripePayment: () => true };
const mockPayPalPayment = { processPayPalPayment: () => true };
// Create adapter instances
const stripeAdapter = new StripePaymentAdapter(mockStripePayment, mockLogger);
const paypalAdapter = new PayPalPaymentAdapter(mockPayPalPayment, mockLogger);
try {
    const paymentProcessor1 = new PaymentProcessor(stripeAdapter);
    paymentProcessor1.process(100, 'USD');
}
catch (error) {
    if (error instanceof PaymentError) {
        console.error(`[Error]: Payment failed on ${error.gateway} - ${error.message}`);
    }
}
try {
    const paymentProcessor2 = new PaymentProcessor(paypalAdapter);
    paymentProcessor2.process(200, 'EUR');
}
catch (error) {
    if (error instanceof PaymentError) {
        console.error(`[Error]: Payment failed on ${error.gateway} - ${error.message}`);
    }
}
// Error Handling Output:
// [Log]: Processing payment via Stripe: 100 USD
// Processing 100 USD via Stripe.
// Payment processed successfully.
// [Log]: Processing payment via PayPal: 200 EUR
// Processing 200 EUR via PayPal.
// Payment processed successfully.
//# sourceMappingURL=01-v2.js.map