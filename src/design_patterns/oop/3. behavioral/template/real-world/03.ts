// // ### Real-World Example: Complex Order Processing System
// //
// // In a product-based system, we often encounter scenarios where the process of handling and processing orders needs to be consistent, but certain steps may vary depending on specific conditions such as the type of order (standard vs. premium), delivery method (same-day vs. regular), or payment type (credit card vs. PayPal). These scenarios can be efficiently modeled using the **Template Pattern**.
// //
// // ### Problem Scenario:
// //
// //   Imagine an **E-commerce Order Processing System** that needs to handle complex order flows. Every order goes through the following steps:
// //
// //   1. **Order Validation**: Validate the details of the order.
// // 2. **Payment Processing**: Handle payment based on the selected method.
// // 3. **Shipping**: Ship the order to the customer.
// // 4. **Post-processing**: Some actions that should happen after the order is processed (e.g., sending confirmation emails, logging analytics, etc.).
// //
// // Certain steps will differ based on the order type (e.g., premium orders may need expedited shipping), payment method (e.g., PayPal may have different validation steps), and additional configurations such as retry mechanisms or asynchronous operations.
// //
// // ### Requirements for Our Template Pattern:
// //   - **Pre- and Post-hooks**: Allow certain actions to be executed before and after the main steps, such as logging or pre-validation.
// // - **Configuration Options**: Allow for configurable options like retry mechanisms in payment processing or priority levels for shipping.
// // - **Async/Await Support**: Some steps (like payment processing or shipping) may involve asynchronous operations.
//
//
// // ### Full Implementation of the Template Pattern with Extensions
//
// // ===============================
// // Base Template Class for Order Processing
// // ===============================
// abstract class OrderProcessingTemplate {
//     // Configuration options for the process (e.g., retry attempts)
//     protected options: { retries: number } = { retries: 3 };
//
//     // Template method that defines the algorithm
//     async processOrder(order: Order): Promise<void> {
//         this.preProcess(order);
//
//         if (!this.validateOrder(order)) {
//             console.error('Order validation failed');
//             return;
//         }
//
//         try {
//             await this.processPayment(order);
//             await this.shipOrder(order);
//         } catch (error) {
//             console.error('Error during order processing:', error);
//             return;
//         }
//
//         this.postProcess(order);
//     }
//
//     // Pre-process hook - Can be overridden by subclasses
//     protected preProcess(order: Order): void {
//         console.log('Pre-processing order...', order.id);
//     }
//
//     // Abstract method for validating the order
//     protected abstract validateOrder(order: Order): boolean;
//
//     // Abstract method for processing payment
//     protected abstract processPayment(order: Order): Promise<void>;
//
//     // Abstract method for shipping the order
//     protected abstract shipOrder(order: Order): Promise<void>;
//
//     // Post-process hook - Can be overridden by subclasses
//     protected postProcess(order: Order): void {
//         console.log('Post-processing order...', order.id);
//     }
//
//     // Retry logic for processing payments (if payment fails, retry)
//     protected async retryPayment(order: Order, attempts: number): Promise<void> {
//         for (let attempt = 1; attempt <= attempts; attempt++) {
//             try {
//                 console.log(`Attempt ${attempt} for payment...`);
//                 await this.processPayment(order);  // Call to the abstract method
//                 return;  // If successful, exit
//             } catch (error) {
//                 if (attempt === attempts) {
//                     throw new Error('Payment failed after retries');
//                 }
//                 console.log('Payment failed, retrying...');
//             }
//         }
//     }
// }
//
// // ===============================
// // Concrete Implementations
// // ===============================
//
// // Standard Order Processing
// class StandardOrderProcessing extends OrderProcessingTemplate {
//     protected validateOrder(order: Order): boolean {
//         return order.items.length > 0 && order.totalAmount > 0;
//     }
//
//     protected async processPayment(order: Order): Promise<void> {
//         if (order.paymentMethod === 'creditCard') {
//             console.log(`Processing Credit Card payment for order ${order.id}`);
//             // Simulate payment gateway interaction
//         } else if (order.paymentMethod === 'paypal') {
//             console.log(`Processing PayPal payment for order ${order.id}`);
//             // Simulate PayPal API interaction
//         } else {
//             throw new Error('Unsupported payment method');
//         }
//     }
//
//     protected async shipOrder(order: Order): Promise<void> {
//         if (order.shippingMethod === 'sameDay') {
//             console.log(`Shipping order ${order.id} with same-day delivery`);
//             // Simulate shipping logic
//         } else {
//             console.log(`Shipping order ${order.id} with regular delivery`);
//             // Simulate regular shipping
//         }
//     }
//
//     protected postProcess(order: Order): void {
//         console.log(`Order ${order.id} processed successfully. Sending confirmation email.`);
//         // Send email confirmation or other post-process actions
//     }
// }
//
// // Premium Order Processing with Retry Logic
// class PremiumOrderProcessing extends OrderProcessingTemplate {
//     protected validateOrder(order: Order): boolean {
//         return order.items.length > 0 && order.totalAmount > 0 && order.customer.isPremiumMember;
//     }
//
//     protected async processPayment(order: Order): Promise<void> {
//         if (order.paymentMethod === 'creditCard') {
//             console.log(`Processing Premium Credit Card payment for order ${order.id}`);
//             // Simulate payment gateway interaction
//         } else {
//             throw new Error('Unsupported payment method for premium orders');
//         }
//     }
//
//     protected async shipOrder(order: Order): Promise<void> {
//         console.log(`Shipping Premium order ${order.id} with expedited shipping`);
//         // Simulate expedited shipping
//     }
//
//     // Override post-process hook to handle premium-specific actions
//     protected postProcess(order: Order): void {
//         super.postProcess(order);
//         console.log(`Premium customer ${order.customer.name} receives VIP perks.`);
//         // Additional logic for premium customers
//     }
//
//     // Override pre-process hook to perform pre-validation for premium customers
//     protected preProcess(order: Order): void {
//         if (!order.customer.isPremiumMember) {
//             console.error('Order cannot be processed: Customer is not a premium member');
//         } else {
//             console.log('Pre-processing premium order...', order.id);
//         }
//     }
// }
//
// // ===============================
// // Helper Classes for Order Representation
// // ===============================
// class Customer {
//     constructor(public name: string, public isPremiumMember: boolean) {}
// }
//
// class Order {
//     constructor(
//         public id: string,
//         public customer: Customer,
//         public items: string[],
//         public totalAmount: number,
//         public paymentMethod: string,
//         public shippingMethod: string
//     ) {}
// }
//
// // ===============================
// // Usage Example
// // ===============================
//
// async function run() {
//     // Example of a standard order
//     const standardOrder = new Order('123', new Customer('John Doe', false), ['item1', 'item2'], 200, 'creditCard', 'regular');
//     const standardProcessor = new StandardOrderProcessing();
//     await standardProcessor.processOrder(standardOrder);
//
//     // Example of a premium order with retries
//     const premiumOrder = new Order('456', new Customer('Jane Smith', true), ['item3'], 500, 'creditCard', 'sameDay');
//     const premiumProcessor = new PremiumOrderProcessing();
//     await premiumProcessor.processOrder(premiumOrder);
// }
//
// run().catch(console.error);
//
// // ### Explanation of Features and Extensions:
//
// // 1. **Pre- and Post-hooks**:
// // - The `preProcess` method allows actions to be taken before order processing, such as validating whether a customer is a premium member in the `PremiumOrderProcessing` subclass.
// // - The `postProcess` method executes after the order processing is complete, such as sending an email confirmation or assigning VIP perks for premium customers.
//
// // 2. **Configuration Options**:
// // - The base class `OrderProcessingTemplate` has a `retries` option that defines how many times the payment can be retried before failing. This is configurable for orders that may fail during payment processing.
// // - This configuration option can be extended further to support priority levels or timeouts.
// //
// // 3. **Async/Await**:
// // - The template method `processOrder` and individual steps like `processPayment` and `shipOrder` are asynchronous, allowing the system to handle real-world scenarios where tasks like payment processing and shipping require asynchronous operations.
// //
// // 4. **Extending Logic**:
// // - The example allows easy extension by creating new subclasses for other types of orders, such as `RushOrderProcessing` or `CustomOrderProcessing`. Each subclass would implement the specific logic for payment processing, order validation, and shipping methods while retaining the overall structure of the order processing flow.
//
//
// // ### Why This Example Covers Product-Standards:
//
// // 1. **Real-World Complexity**:
// // - Handling different types of orders (e.g., standard vs. premium) with varying business rules for each type is a common use case in e-commerce and service-based systems.
// // 2. **Configurable and Extensible**:
// // - The template pattern allows for easy addition of new order types or features (e.g., different payment methods, retry mechanisms) without modifying the core workflow.
// // 3. **Maintainability**:
// // - By abstracting common logic (e.g., pre/post-processing), we avoid code duplication, ensuring the system remains maintainable and scalable.
// // 4. **Support for Real-World Systems**:
// // - The use of asynchronous operations and retries makes the template pattern adaptable to modern systems that require external API calls (e.g., payment gateways or third-party shipping services).
//
// // ### Conclusion:
// //   This example demonstrates the **Template Pattern** in a comprehensive, real-world scenario with features that align with product-based standards. It showcases not only the power of the template pattern itself but also how to integrate hooks, configurable options, and asynchronous workflows to handle complex, real-world systems in an extensible and maintainable way.