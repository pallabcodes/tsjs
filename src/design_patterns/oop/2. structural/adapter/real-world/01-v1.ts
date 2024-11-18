// Further extensions: I mentioned and integrate them into the existing Adapter Pattern example for better understanding. These extensions will help demonstrate more advanced uses of the Adapter pattern in a product-based environment.

// Logging Service
// First, let's create a logging service that handles logging.


// 1. Add Logging or Metrics within the Adapter
// We can integrate logging functionality into each adapter to track which payment gateway is being used and how often. This would be useful for debugging or analytics purposes.

// Here’s how we can add logging:

// @ts-ignore
class Logger {
    log(message: string): void {
        console.log(`[Log]: ${message}`);
    }
}

// Updated Adapters with Logging
// Now, we modify each adapter to include logging functionality.

// @ts-ignore
class StripePaymentAdapter implements PaymentGateway {
    // @ts-ignore
    private stripePayment: StripePayment;
    private logger: Logger;

    // @ts-ignore
    constructor(stripePayment: StripePayment, logger: Logger) {
        this.stripePayment = stripePayment;
        this.logger = logger;
    }

    processPayment(amount: number, currency: string): boolean {
        this.logger.log(`Processing payment via Stripe: ${amount} ${currency}`);
        return this.stripePayment.processStripePayment(amount, currency);
    }
}

// @ts-ignore
class PayPalPaymentAdapter implements PaymentGateway {
    // @ts-ignore
    private paypalPayment: PayPalPayment;
    private logger: Logger;

    // @ts-ignore
    constructor(paypalPayment: PayPalPayment, logger: Logger) {
        this.paypalPayment = paypalPayment;
        this.logger = logger;
    }

    processPayment(amount: number, currency: string): boolean {
        this.logger.log(`Processing payment via PayPal: ${amount} ${currency}`);
        return this.paypalPayment.processPayPalPayment(amount, currency);
    }
}

// @ts-ignore
class SquarePaymentAdapter implements PaymentGateway {
    // @ts-ignore
    private squarePayment: SquarePayment;
    private logger: Logger;

    // @ts-ignore
    constructor(squarePayment: SquarePayment, logger: Logger) {
        this.squarePayment = squarePayment;
        this.logger = logger;
    }

    processPayment(amount: number, currency: string): boolean {
        this.logger.log(`Processing payment via Square: ${amount} ${currency}`);
        return this.squarePayment.processSquarePayment(amount, currency);
    }
}


// Usage with Logging
// Now, we use the logging service when creating the adapters.

const logger = new Logger();

// @ts-ignore
const stripePayment = new StripePayment();

const stripeAdapter = new StripePaymentAdapter(stripePayment, logger);

// @ts-ignore
const paypalPayment = new PayPalPayment();
const paypalAdapter = new PayPalPaymentAdapter(paypalPayment, logger);

// @ts-ignore
const squarePayment = new SquarePayment();
const squareAdapter = new SquarePaymentAdapter(squarePayment, logger);

// @ts-ignore
const paymentProcessor1 = new PaymentProcessor(stripeAdapter);
paymentProcessor1.process(100, 'USD');

// @ts-ignore
const paymentProcessor2 = new PaymentProcessor(paypalAdapter);
paymentProcessor2.process(200, 'EUR');

// @ts-ignore
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
