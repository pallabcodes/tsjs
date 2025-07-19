"use strict";
// Here is an enhanced Facade Pattern example that integrates Dependency Injection, Error Handling and Monitoring, and Dynamic Configuration to showcase the full power of the Facade Pattern as per product-based standards.
// Real-World Example: E-Commerce Order Processing Facade
// Subsystems
// These represent independent components of the e-commerce platform.
// Subsystem 1: Payment Gateway
class PaymentGateway {
    processPayment(amount) {
        console.log(`Processing payment of $${amount}...`);
        return true; // Simulating success
    }
}
// Subsystem 2: Inventory System
class InventorySystem {
    checkStock(itemId) {
        console.log(`Checking stock for item ${itemId}...`);
        return true; // Simulating item availability
    }
    reserveItem(itemId) {
        console.log(`Reserving item ${itemId}...`);
    }
}
// Subsystem 3: Shipping Service
class ShippingService {
    arrangeShipping(address) {
        console.log(`Arranging shipping to ${address}...`);
    }
}
// Subsystem 4: Notification Service
class NotificationService {
    sendEmail(email, message) {
        console.log(`Sending email to ${email}: ${message}`);
    }
}
// Configurable Facade
// The facade integrates subsystems, adds error handling, logging, dynamic configuration, and dependency injection.
// Error Logging
class ErrorLogger {
    static log(error) {
        console.error(`Error: ${error}`);
    }
}
class OrderProcessingFacade {
    constructor(paymentGateway, inventorySystem, shippingService, notificationService, config = {}) {
        this.paymentGateway = paymentGateway;
        this.inventorySystem = inventorySystem;
        this.shippingService = shippingService;
        this.notificationService = notificationService;
        this.config = config;
    }
    processOrder(itemId, amount, userEmail, shippingAddress) {
        console.log('Order processing started...');
        try {
            // Check stock
            if (!this.inventorySystem.checkStock(itemId)) {
                throw new Error(`Item ${itemId} is out of stock.`);
            }
            this.inventorySystem.reserveItem(itemId);
            // Process payment
            if (!this.paymentGateway.processPayment(amount)) {
                throw new Error('Payment failed.');
            }
            // Arrange shipping
            const address = shippingAddress || this.config.defaultShippingAddress;
            if (!address) {
                throw new Error('No shipping address provided.');
            }
            this.shippingService.arrangeShipping(address);
            // Send notification
            const email = this.config.notificationEmail || userEmail;
            this.notificationService.sendEmail(email, 'Your order has been processed successfully!');
            console.log('Order processed successfully.');
            return true;
        }
        catch (error) {
            ErrorLogger.log(error.message);
            return false;
        }
    }
}
// Usage Example
// Instantiate subsystems
const paymentGateway = new PaymentGateway();
const inventorySystem = new InventorySystem();
const shippingService = new ShippingService();
const notificationService = new NotificationService();
// Configure facade with dynamic options
const orderConfig = {
    notificationEmail: 'support@example.com', // Default email
    defaultShippingAddress: '123 Default Lane', // Default address
};
// Create the facade
const orderFacade = new OrderProcessingFacade(paymentGateway, inventorySystem, shippingService, notificationService, orderConfig);
// Process order
const success = orderFacade.processOrder('item123', // Item ID
49.99, // Amount
'user@example.com', // User email
'456 Custom Ave' // Custom shipping address
);
if (!success) {
    console.log('Order processing failed.');
}
// Key Features
// Dependency Injection
//
// Subsystems (PaymentGateway, InventorySystem, ShippingService, NotificationService) are injected into the facade, making it easy to replace or mock them for testing.
//                                                                                                                                                               Error Handling and Monitoring
//
// Centralized error handling using ErrorLogger.
// Logs meaningful error messages for better debugging and monitoring.
//   Dynamic Configuration
//
// Accepts runtime configurations (e.g., notificationEmail, defaultShippingAddress) via a config object.
//   Extensibility
//
// New subsystems or features (e.g., discount handling, order tracking) can be added without modifying existing facade methods.
//   Does This Cover the Full Power of the Facade Pattern?
// Demonstrates a real-world scenario for an e-commerce system.
// Applies best practices: dependency injection, centralized error handling, and configurability.
// Balances simplicity and extensibility, showing how to encapsulate complex subsystems and provide a unified interface.
// Matches product-based standards, focusing on maintainability and scalability.
// If your goal is to understand and apply the full potential of the Facade Pattern, this example is comprehensive and serves as a strong template. However, the true power of the pattern depends on adapting its principles to the specific requirements and complexities of your application.
//# sourceMappingURL=01-v1.js.map