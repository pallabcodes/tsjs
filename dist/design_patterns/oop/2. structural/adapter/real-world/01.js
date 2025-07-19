"use strict";
// Unified PaymentGateway interface that the system uses
// Stripe's API
class StripePayment {
    processStripePayment(amount, currency) {
        console.log(`Processing ${amount} ${currency} via Stripe.`);
        return true; // Success
    }
}
// PayPal's API
class PayPalPayment {
    processPayPalPayment(amount, currency) {
        console.log(`Processing ${amount} ${currency} via PayPal.`);
        return true; // Success
    }
}
// Square's API
class SquarePayment {
    processSquarePayment(amount, currency) {
        console.log(`Processing ${amount} ${currency} via Square.`);
        return true; // Success
    }
}
// Adapter for Stripe
class StripePaymentAdapter {
    constructor(stripePayment) {
        this.stripePayment = stripePayment;
    }
    processPayment(amount, currency) {
        return this.stripePayment.processStripePayment(amount, currency);
    }
}
// Adapter for PayPal
class PayPalPaymentAdapter {
    constructor(paypalPayment) {
        this.paypalPayment = paypalPayment;
    }
    processPayment(amount, currency) {
        return this.paypalPayment.processPayPalPayment(amount, currency);
    }
}
// Adapter for Square
class SquarePaymentAdapter {
    constructor(squarePayment) {
        this.squarePayment = squarePayment;
    }
    processPayment(amount, currency) {
        return this.squarePayment.processSquarePayment(amount, currency);
    }
}
// Update payment processing to include error handling
class PaymentProcessor {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    process(amount, currency) {
        try {
            if (amount <= 0) {
                throw new Error('Invalid payment amount');
            }
            const success = this.paymentGateway.processPayment(amount, currency);
            if (success) {
                console.log('Payment processed successfully.');
            }
            else {
                console.log('Payment failed.');
            }
        }
        catch (error) {
            console.error(`Payment processing error: ${error.message}`);
        }
    }
}
// Usage
const stripePayment = new StripePayment();
const stripeAdapter = new StripePaymentAdapter(stripePayment);
const paypalPayment = new PayPalPayment();
const paypalAdapter = new PayPalPaymentAdapter(paypalPayment);
const squarePayment = new SquarePayment();
const squareAdapter = new SquarePaymentAdapter(squarePayment);
const paymentProcessor1 = new PaymentProcessor(stripeAdapter);
paymentProcessor1.process(100, 'USD');
const paymentProcessor2 = new PaymentProcessor(paypalAdapter);
paymentProcessor2.process(200, 'EUR');
const paymentProcessor3 = new PaymentProcessor(squareAdapter);
paymentProcessor3.process(150, 'GBP');
//# sourceMappingURL=01.js.map