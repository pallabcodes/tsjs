"use strict";
class PayPalPayment {
    processPayPalPayment(amount, currency) {
        console.log(`Processing ${amount} ${currency} via PayPal.`);
        return true;
    }
}
class StripePayment {
    processStripePayment(amount, currency) {
        console.log(`Processing ${amount} ${currency} via Stripe.`);
        return true;
    }
}
class SquarePayment {
    processSquarePayment(amount, currency) {
        console.log(`Processing ${amount} ${currency} via Square.`);
        return true;
    }
}
// Logging Service
// First, let's create a logging service that handles logging.
// 1. Add Logging or Metrics within the Adapter
// We can integrate logging functionality into each adapter to track which payment gateway is being used and how often. This would be useful for debugging or analytics purposes.
// Here’s how we can add logging:
class Logger {
    log(message) {
        console.log(`[Log]: ${message}`);
    }
}
// Updated Adapters with Logging
// Now, we modify each adapter to include logging functionality.
class StripePaymentAdapter {
    constructor(stripePayment, logger) {
        this.stripePayment = stripePayment;
        this.logger = logger;
    }
    processPayment(amount, currency) {
        this.logger.log(`Processing payment via Stripe: ${amount} ${currency}`);
        return this.stripePayment.processStripePayment(amount, currency);
    }
}
class PayPalPaymentAdapter {
    constructor(paypalPayment, logger) {
        this.paypalPayment = paypalPayment;
        this.logger = logger;
    }
    processPayment(amount, currency) {
        this.logger.log(`Processing payment via PayPal: ${amount} ${currency}`);
        return this.paypalPayment.processPayPalPayment(amount, currency);
    }
}
class SquarePaymentAdapter {
    constructor(squarePayment, logger) {
        this.squarePayment = squarePayment;
        this.logger = logger;
    }
    processPayment(amount, currency) {
        this.logger.log(`Processing payment via Square: ${amount} ${currency}`);
        return this.squarePayment.processSquarePayment(amount, currency);
    }
}
// Add the missing PaymentProcessor class
class PaymentProcessor {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    process(amount, currency) {
        const success = this.paymentGateway.processPayment(amount, currency);
        if (success) {
            console.log('Payment processed successfully.');
        }
        else {
            console.log('Payment failed.');
        }
    }
}
// Usage with Logging
const logger = new Logger();
const stripePayment = new StripePayment();
const stripeAdapter = new StripePaymentAdapter(stripePayment, logger);
const paypalPayment = new PayPalPayment();
const paypalAdapter = new PayPalPaymentAdapter(paypalPayment, logger);
const squarePayment = new SquarePayment();
const squareAdapter = new SquarePaymentAdapter(squarePayment, logger);
const paymentProcessor1 = new PaymentProcessor(stripeAdapter);
paymentProcessor1.process(100, 'USD');
const paymentProcessor2 = new PaymentProcessor(paypalAdapter);
paymentProcessor2.process(200, 'EUR');
const paymentProcessor3 = new PaymentProcessor(squareAdapter);
paymentProcessor3.process(150, 'GBP');
// Logging Output:
// [Log]: Processing payment via Stripe: 100 USD
// Processing 100 USD via Stripe.
// Payment processed successfully.
// [Log]: Processing payment via PayPal: 200 EUR
// Processing 200 EUR via PayPal.
// Payment processed successfully.
// [Log]: Processing payment via Square: 150 GBP
// Processing 150 GBP via Square.
// Payment processed successfully.
//# sourceMappingURL=01-v1.js.map