// # Handle Errors Gracefully
// We should handle errors and convert them into a uniform format that the rest of the system can understand, regardless of the source of the error. This will ensure that the system behaves consistently even when one of the payment gateways throws an error.

// 1. Custom Error Class
// Let’s define a custom error class for errors we might encounter.
class PaymentError extends Error {
  constructor(message: string, public gateway: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

// Add missing interfaces
export interface PaymentGateway {
  processPayment(amount: number, currency: string): boolean;
}

interface Logger {
  log(message: string): void;
}

interface StripePayment {
  processStripePayment(amount: number, currency: string): boolean;
}

interface PayPalPayment {
  processPayPalPayment(amount: number, currency: string): boolean;
}

interface SquarePayment {
  processSquarePayment(amount: number, currency: string): boolean;
}

// 2. Updating Adapters with Error Handling
// Now, let's update the adapters to handle errors gracefully by catching them and throwing a PaymentError with a consistent message format.

export class StripePaymentAdapter implements PaymentGateway {
  private stripePayment: StripePayment;
  private logger: Logger;

  constructor(stripePayment: StripePayment, logger: Logger) {
    this.stripePayment = stripePayment;
    this.logger = logger;
  }

  processPayment(amount: number, currency: string): boolean {
    try {
      this.logger.log(`Processing payment via Stripe: ${amount} ${currency}`);
      return this.stripePayment.processStripePayment(amount, currency);
    } catch (error) {
      throw new PaymentError(
        `Error processing payment via Stripe: ${(error as Error).message}`,
        'Stripe'
      );
    }
  }
}

export class PayPalPaymentAdapter implements PaymentGateway {
  private paypalPayment: PayPalPayment;
  private logger: Logger;

  constructor(paypalPayment: PayPalPayment, logger: Logger) {
    this.paypalPayment = paypalPayment;
    this.logger = logger;
  }

  processPayment(amount: number, currency: string): boolean {
    try {
      this.logger.log(`Processing payment via PayPal: ${amount} ${currency}`);
      return this.paypalPayment.processPayPalPayment(amount, currency);
    } catch (error) {
      throw new PaymentError(
        `Error processing payment via PayPal: ${(error as Error).message}`,
        'PayPal'
      );
    }
  }
}

export class SquarePaymentAdapter implements PaymentGateway {
  private squarePayment: SquarePayment;
  private logger: Logger;

  constructor(squarePayment: SquarePayment, logger: Logger) {
    this.squarePayment = squarePayment;
    this.logger = logger;
  }

  processPayment(amount: number, currency: string): boolean {
    try {
      this.logger.log(`Processing payment via Square: ${amount} ${currency}`);
      return this.squarePayment.processSquarePayment(amount, currency);
    } catch (error) {
      throw new PaymentError(
        `Error processing payment via Square: ${(error as Error).message}`,
        'Square'
      );
    }
  }
}

// 3. Usage Example with Error Handling : Now, let’s demonstrate error handling

// Add PaymentProcessor class before usage
class PaymentProcessor {
  constructor(private paymentGateway: PaymentGateway) {}

  process(amount: number, currency: string): boolean {
    return this.paymentGateway.processPayment(amount, currency);
  }
}

// Create mock implementations
const mockLogger = {
  log: (message: string) => console.log(`[Log]: ${message}`),
};
const mockStripePayment = { processStripePayment: () => true };
const mockPayPalPayment = { processPayPalPayment: () => true };

// Create adapter instances
const stripeAdapter = new StripePaymentAdapter(mockStripePayment, mockLogger);
const paypalAdapter = new PayPalPaymentAdapter(mockPayPalPayment, mockLogger);

try {
  const paymentProcessor1 = new PaymentProcessor(stripeAdapter);
  paymentProcessor1.process(100, 'USD');
} catch (error) {
  if (error instanceof PaymentError) {
    console.error(
      `[Error]: Payment failed on ${error.gateway} - ${error.message}`
    );
  }
}

try {
  const paymentProcessor2 = new PaymentProcessor(paypalAdapter);
  paymentProcessor2.process(200, 'EUR');
} catch (error) {
  if (error instanceof PaymentError) {
    console.error(
      `[Error]: Payment failed on ${error.gateway} - ${error.message}`
    );
  }
}

// Error Handling Output:

// [Log]: Processing payment via Stripe: 100 USD
// Processing 100 USD via Stripe.
// Payment processed successfully.

// [Log]: Processing payment via PayPal: 200 EUR
// Processing 200 EUR via PayPal.
// Payment processed successfully.
