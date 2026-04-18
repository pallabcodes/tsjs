// Unified PaymentGateway interface that the system uses

interface PaymentGateway {
  processPayment(amount: number, currency: string): boolean;
}

// Stripe's API
class StripePayment {
  processStripePayment(amount: number, currency: string): boolean {
    console.log(`Processing ${amount} ${currency} via Stripe.`);
    return true; // Success
  }
}

// PayPal's API
class PayPalPayment {
  processPayPalPayment(amount: number, currency: string): boolean {
    console.log(`Processing ${amount} ${currency} via PayPal.`);
    return true; // Success
  }
}

// Square's API
class SquarePayment {
  processSquarePayment(amount: number, currency: string): boolean {
    console.log(`Processing ${amount} ${currency} via Square.`);
    return true; // Success
  }
}

// Adapter for Stripe
class StripePaymentAdapter implements PaymentGateway {
  private stripePayment: StripePayment;

  constructor(stripePayment: StripePayment) {
    this.stripePayment = stripePayment;
  }

  processPayment(amount: number, currency: string): boolean {
    return this.stripePayment.processStripePayment(amount, currency);
  }
}

// Adapter for PayPal
class PayPalPaymentAdapter implements PaymentGateway {
  private paypalPayment: PayPalPayment;

  constructor(paypalPayment: PayPalPayment) {
    this.paypalPayment = paypalPayment;
  }

  processPayment(amount: number, currency: string): boolean {
    return this.paypalPayment.processPayPalPayment(amount, currency);
  }
}

// Adapter for Square
class SquarePaymentAdapter implements PaymentGateway {
  private squarePayment: SquarePayment;

  constructor(squarePayment: SquarePayment) {
    this.squarePayment = squarePayment;
  }

  processPayment(amount: number, currency: string): boolean {
    return this.squarePayment.processSquarePayment(amount, currency);
  }
}

// Update payment processing to include error handling
class PaymentProcessor {
  private paymentGateway: PaymentGateway;

  constructor(paymentGateway: PaymentGateway) {
    this.paymentGateway = paymentGateway;
  }

  process(amount: number, currency: string): void {
    try {
      if (amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      const success = this.paymentGateway.processPayment(amount, currency);
      if (success) {
        console.log('Payment processed successfully.');
      } else {
        console.log('Payment failed.');
      }
    } catch (error) {
      console.error(`Payment processing error: ${(error as Error).message}`);
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
