"use strict";
// In some cases, payment gateways can be slow or involve frequent calls to external services. We can introduce caching to store recent successful payments and reduce the number of redundant requests to payment gateways.
class PaymentCache {
    constructor() {
        this.cache = new Map();
        this.TTL_MS = 1000 * 60 * 60; // 1 hour cache TTL
    }
    getCache(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return undefined;
        // Check if cache entry has expired
        if (Date.now() - entry.timestamp > this.TTL_MS) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.value;
    }
    setCache(key, value) {
        if (!key)
            throw new Error('Cache key cannot be empty');
        this.cache.set(key, { value, timestamp: Date.now() });
    }
    clearCache() {
        this.cache.clear();
    }
}
// Updated Adapters with Caching
// We can update each adapter to check the cache before processing a payment.
class StripePaymentImpl {
    processStripePayment(amount, currency) {
        // Simulate payment processing
        console.log(`Processing ${amount} ${currency} via Stripe.`);
        return true;
    }
}
class StripePaymentAdapter {
    constructor(stripePayment, logger, cache) {
        this.stripePayment = stripePayment;
        this.logger = logger;
        this.cache = cache;
    }
    processPayment(amount, currency) {
        if (amount <= 0) {
            this.logger.log(`Invalid payment amount: ${amount}`);
            return false;
        }
        const cacheKey = `${amount}-${currency}-Stripe`;
        try {
            const cachedPayment = this.cache.getCache(cacheKey);
            if (cachedPayment !== undefined) {
                this.logger.log(`Cache hit for Stripe payment: ${amount} ${currency}`);
                return cachedPayment;
            }
            this.logger.log(`Processing payment via Stripe: ${amount} ${currency}`);
            const success = this.stripePayment.processStripePayment(amount, currency);
            this.cache.setCache(cacheKey, success);
            return success;
        }
        catch (error) {
            this.logger.log(`Payment processing error: ${error.message}`);
            return false;
        }
    }
}
class ConsoleLogger {
    log(message) {
        console.log(`[Log]: ${message}`);
    }
}
class PaymentProcessor {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    process(amount, currency) {
        return this.paymentGateway.processPayment(amount, currency);
    }
}
// Usage with Caching
// Now we have caching in place. When we try to process the same payment multiple times, the cache will prevent redundant calls.
const paymentCache = new PaymentCache();
const logger = new ConsoleLogger();
const stripePayment = new StripePaymentImpl();
const stripeAdapterWithCache = new StripePaymentAdapter(stripePayment, logger, paymentCache);
const paymentProcessorWithCache = new PaymentProcessor(stripeAdapterWithCache);
paymentProcessorWithCache.process(100, 'USD'); // First call - processes payment
paymentProcessorWithCache.process(100, 'USD'); // Cache hit - does not process payment again
// [Log]: Processing payment via Stripe: 100 USD
// Processing 100 USD via Stripe.
// Payment processed successfully.
// [Log]: Cache hit for Stripe payment: 100 USD
// 4. Use Dependency Injection for Adapter Creation
// Instead of manually creating instances of adapters, we can use Dependency Injection (DI) to handle adapter creation. This improves maintainability and testability.
// DI Container
// Let’s use a simple DI container to manage our dependencies.
class DIContainer {
    static { this.services = new Map(); }
    static register(name, service) {
        this.services.set(name, service);
    }
    static resolve(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service not found: ${name}`);
        }
        return service;
    }
}
// Registering and Resolving Services
// Now, let’s register our services and resolve them via DI.
DIContainer.register('logger', new ConsoleLogger());
DIContainer.register('paymentCache', new PaymentCache());
DIContainer.register('stripePaymentAdapter', new StripePaymentAdapter(new StripePaymentImpl(), DIContainer.resolve('logger'), DIContainer.resolve('paymentCache')));
const stripePaymentAdapterFromDI = DIContainer.resolve('stripePaymentAdapter');
const paymentProcessorFromDI = new PaymentProcessor(stripePaymentAdapterFromDI);
paymentProcessorFromDI.process(100, 'USD');
// By using DI, we decouple the creation of the adapter from its usage and make the code more modular.
// Conclusion
// We’ve extended the Adapter Pattern with various techniques, including:
// Logging and Metrics: Adding logging to track adapter usage.
// Error Handling: Introducing error handling to ensure the system remains consistent even with failures.
// Caching: Implementing caching to reduce redundant requests to the payment gateways.
// Dependency Injection: Using DI for creating and resolving service instances.
// These extensions enhance the Adapter Pattern, making it more scalable, maintainable, and robust for complex real-world applications.
// This above code should a solid example to serve as a template to learn full power of builder pattern or do I need a better example from real world
// is this single example  enough to cover mostly everything from real world scnario of a factory pattern as per product based standards
//# sourceMappingURL=01-v3.js.map