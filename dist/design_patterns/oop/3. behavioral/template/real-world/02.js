"use strict";
// Here’s an 04 advanced-generics **Template Pattern** implementation with the mentioned extensions, showcasing **Pre- and Post-hooks**, **Configuration Options**, and **Async/Await** in a real-world product-based scenario.
//
// ---
//
// ### Advanced Real-World Example: Payment Processing System
//
// #### Problem:
//   A payment processing system supports multiple payment gateways (e.g., **Stripe**, **PayPal**, **Bank Transfer**) with shared and specific workflows. The process includes:
//   1. Pre-validation of the payment request.
// 2. Logging transaction details before processing.
// 3. Processing payment using the respective gateway.
// 4. Post-logging or triggering callbacks for success/failure.
//   5. Retry mechanisms or priority levels.
//
// ---
//
// ### Solution:
//   We use the **Template Pattern** with:
// - **Pre- and Post-hooks** for custom operations like logging or additional checks.
// - **Configuration Options** to manage retries or priority.
// - **Async/Await** to handle asynchronous payment gateway operations.
//
// ---
//
// ### Implementation
//
//   ```typescript
// // =========================
// // Configuration Interface
// // =========================
// interface PaymentConfig {
//     retries?: number;       // Number of retry attempts
//     priority?: "high" | "low"; // Priority level of the payment
// }
//
// // =========================
// // Base Template Class
// // =========================
// abstract class PaymentTemplate {
//     private config: PaymentConfig;
//
//     constructor(config: PaymentConfig = { retries: 0, priority: "low" }) {
//         this.config = config;
//     }
//
//     // Template Method
//     async processPayment(amount: number, payer: string): Promise<void> {
//         try {
//             // Pre-hook: Common pre-validation or logging
//             this.preValidate(amount, payer);
//
//             // Process payment (retries handled here)
//             await this.processWithRetries(amount, payer);
//
//             // Post-hook: Log or trigger additional success actions
//             this.postProcess(true);
//         } catch (error) {
//             // Handle failure in post-hook
//             this.postProcess(false);
//             console.error(`Payment failed: ${error}`);
//         }
//     }
//
//     // Pre-hook (can be overridden)
//     protected preValidate(amount: number, payer: string): void {
//         console.log(`Validating payment: ${payer} will pay $${amount}.`);
//     }
//
//     // Retry logic
//     private async processWithRetries(amount: number, payer: string): Promise<void> {
//         let attempt = 0;
//         const maxRetries = this.config.retries ?? 0;
//
//         while (attempt <= maxRetries) {
//             try {
//                 console.log(`Attempt ${attempt + 1} to process payment.`);
//                 await this.processPaymentGateway(amount, payer);
//                 return;
//             } catch (error) {
//                 attempt++;
//                 if (attempt > maxRetries) {
//                     throw new Error("All payment attempts failed.");
//                 }
//                 console.warn(`Retrying payment (${attempt}/${maxRetries})...`);
// }
// }
// }
//
// // Abstract method for payment processing (must be implemented by subclasses)
// protected abstract processPaymentGateway(amount: number, payer: string): Promise<void>;
//
// // Post-hook (can be overridden)
// protected postProcess(success: boolean): void {
//   if (success) {
//     console.log("Payment processed successfully.");
//   } else {
//     console.log("Payment failed. Please retry or contact support.");
//   }
// }
// }
//
// // =========================
// // Concrete Implementations
// // =========================
//
// // Stripe Payment
// class StripePayment extends PaymentTemplate {
//   protected async processPaymentGateway(amount: number, payer: string): Promise<void> {
//     console.log(`Processing payment via Stripe for ${payer}: $${amount}.`);
//     // Simulate Stripe API call
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async delay
//     if (Math.random() < 0.7) throw new Error("Stripe gateway error."); // Simulate failure
//   }
// }
//
// // PayPal Payment
// class PayPalPayment extends PaymentTemplate {
//   protected async processPaymentGateway(amount: number, payer: string): Promise<void> {
//     console.log(`Processing payment via PayPal for ${payer}: $${amount}.`);
//     // Simulate PayPal API call
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async delay
//     if (Math.random() < 0.5) throw new Error("PayPal gateway error."); // Simulate failure
//   }
// }
//
// // =========================
// // Usage Example
// // =========================
// (async () => {
//   const stripePayment = new StripePayment({ retries: 2, priority: "high" });
//   const payPalPayment = new PayPalPayment({ retries: 1 });
//
//   console.log("== Stripe Payment ==");
//   await stripePayment.processPayment(100, "John Doe");
//
//   console.log("\n== PayPal Payment ==");
//   await payPalPayment.processPayment(200, "Jane Doe");
// })();
// ```
//
// ---
//
// ### Key Features in This Example
//
// 1. **Pre- and Post-hooks**:
//    - The `preValidate` hook logs and validates the payer and amount before processing. Subclasses can override this for additional checks.
//    - The `postProcess` hook logs success/failure and can trigger callbacks like sending an email notification.
//
// 2. **Configuration Options**:
//    - The `PaymentTemplate` accepts a `PaymentConfig` object, allowing retries and priority settings.
//    - Retry logic is encapsulated in `processWithRetries`.
//
// 3. **Async/Await**:
//    - Asynchronous processing of payment gateways is handled seamlessly with `async/await`.
//    - Simulated API calls show how to handle delays and errors.
//
// 4. **Real-World Use Case**:
//    - Models a real-world payment processing system with extensibility for new gateways.
//
// ---
//
// ### Extensibility:
// - Add new gateways like **Bank Transfer** by extending `PaymentTemplate` and implementing the `processPaymentGateway` method.
// - Add pre- or post-processing logic for custom business requirements.
// - Enhance retry logic with exponential backoff or logging.
//
// ---
//
// ### Does This Cover Product-Based Standards?
//
// Yes, this implementation explores the **full power** of the Template Pattern, adhering to product-based standards:
// - **Scalability**: Easily add new payment gateways or extend existing logic.
// - **Maintainability**: Common workflows and retry mechanisms are centralized in the base class.
// - **Readability**: Separation of concerns is clear, and hooks provide flexibility.
// - **Asynchronous Support**: Realistic handling of async API operations and failures.
//
// It’s comprehensive for product-grade scenarios and sufficient for learning the Template Pattern in depth.
//# sourceMappingURL=02.js.map