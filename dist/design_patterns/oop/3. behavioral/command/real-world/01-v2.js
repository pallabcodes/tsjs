"use strict";
// Certainly! Let's create a new **real-world example** involving an **Order Management System** for an **e-commerce platform**. This system will allow us to cover the following important aspects of the **Command Pattern**:
//
// 1. **Composite Commands**: Commands that execute multiple sub-commands at once, such as processing an order (payment, inventory, shipping).
// 2. **Asynchronous Commands**: Commands that involve asynchronous operations (e.g., network requests to process payments or fetch user details).
// 3. **Contextual Commands**: Commands that need additional context, like user credentials, transaction IDs, etc.
//
// ### Real-World Scenario: **Order Management System** for an E-Commerce Platform
//
// In this system, we need to handle several tasks when a user places an order:
//
//   - **Processing Payment**: This involves verifying payment information and charging the customer.
// - **Updating Inventory**: This involves decreasing the stock for the purchased items.
// - **Shipping**: This involves initiating the shipment of the items to the customer.
// - **Generating an Order Invoice**: This involves creating an invoice document for the order.
//
// ### Step-by-Step Command Pattern Example
//
// #### 1. **Command Interface**
// #### 2. **Receiver (Systems/Subsystems)**
// Each of the tasks (payment, inventory, shipping, invoice generation) is handled by different subsystems.
// Receiver: Payment System
class PaymentSystem {
    async processPayment(userId, amount) {
        console.log(`Processing payment of $${amount} for user ${userId}`);
        // Simulate async payment processing (e.g., network request)
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    }
    refund(userId, amount) {
        console.log(`Refunding $${amount} to user ${userId}`);
    }
}
// Receiver: Inventory System
class InventorySystem {
    updateStock(itemId, quantity) {
        console.log(`Updating stock for item ${itemId}: decreasing quantity by ${quantity}`);
    }
    revertStock(itemId, quantity) {
        console.log(`Reverting stock for item ${itemId}: increasing quantity by ${quantity}`);
    }
}
// Receiver: Shipping System
class ShippingSystem {
    async shipOrder(orderId, address) {
        console.log(`Shipping order ${orderId} to address ${address}`);
        // Simulate async shipping process (e.g., network request)
        return new Promise(resolve => setTimeout(() => resolve(), 2000));
    }
    cancelShipping(orderId) {
        console.log(`Canceling shipping for order ${orderId}`);
    }
}
// Receiver: Invoice System
class InvoiceSystem {
    generateInvoice(orderId, amount) {
        console.log(`Generating invoice for order ${orderId} with total amount $${amount}`);
    }
    cancelInvoice(orderId) {
        console.log(`Canceling invoice for order ${orderId}`);
    }
}
// #### 3. **Concrete Command Classes**
// Each task (payment processing, inventory update, etc.) will have a command class. Some of these commands will involve asynchronous operations, such as network requests.
// Command: ProcessPaymentCommand
class ProcessPaymentCommand {
    constructor(paymentSystem, userId, amount) {
        this.paymentSystem = paymentSystem;
        this.userId = userId;
        this.amount = amount;
    }
    async execute() {
        try {
            const success = await this.paymentSystem.processPayment(this.userId, this.amount);
            if (!success) {
                return { success: false, error: new Error('Payment failed') };
            }
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown payment error'),
            };
        }
    }
    async undo() {
        try {
            this.paymentSystem.refund(this.userId, this.amount);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Refund failed'),
            };
        }
    }
}
// Command: UpdateInventoryCommand
class UpdateInventoryCommand {
    constructor(inventorySystem, itemId, quantity) {
        this.inventorySystem = inventorySystem;
        this.itemId = itemId;
        this.quantity = quantity;
    }
    async execute() {
        try {
            this.inventorySystem.updateStock(this.itemId, this.quantity);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Inventory update failed'),
            };
        }
    }
    async undo() {
        try {
            this.inventorySystem.revertStock(this.itemId, this.quantity);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Inventory revert failed'),
            };
        }
    }
}
// Command: ShipOrderCommand
class ShipOrderCommand {
    constructor(shippingSystem, orderId, address) {
        this.shippingSystem = shippingSystem;
        this.orderId = orderId;
        this.address = address;
    }
    async execute() {
        try {
            await this.shippingSystem.shipOrder(this.orderId, this.address);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Shipping failed'),
            };
        }
    }
    async undo() {
        try {
            this.shippingSystem.cancelShipping(this.orderId);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error
                    : new Error('Shipping cancellation failed'),
            };
        }
    }
}
// Command: GenerateInvoiceCommand
class GenerateInvoiceCommand {
    constructor(invoiceSystem, orderId, amount) {
        this.invoiceSystem = invoiceSystem;
        this.orderId = orderId;
        this.amount = amount;
    }
    async execute() {
        try {
            this.invoiceSystem.generateInvoice(this.orderId, this.amount);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error
                    : new Error('Invoice generation failed'),
            };
        }
    }
    async undo() {
        try {
            this.invoiceSystem.cancelInvoice(this.orderId);
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error
                    ? error
                    : new Error('Invoice cancellation failed'),
            };
        }
    }
}
// #### 4. **Composite Command (Processing an Order)**
// The **Composite Command** will execute multiple commands at once (e.g., processing payment, updating inventory, shipping, and generating an invoice).
// Composite Command: ProcessOrderCommand
class ProcessOrderCommand {
    constructor(commands) {
        this.commands = commands;
    }
    async execute() {
        const executedCommands = [];
        try {
            for (const command of this.commands) {
                const result = await command.execute();
                if (!result.success) {
                    // Rollback previously executed commands
                    for (const executedCommand of executedCommands.reverse()) {
                        await executedCommand.undo();
                    }
                    return result;
                }
                executedCommands.push(command);
            }
            return { success: true };
        }
        catch (error) {
            // Rollback in case of unexpected errors
            for (const executedCommand of executedCommands.reverse()) {
                await executedCommand.undo();
            }
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Order processing failed'),
            };
        }
    }
    async undo() {
        try {
            // Undo commands in reverse order
            for (const command of this.commands.reverse()) {
                const result = await command.undo();
                if (!result.success) {
                    return result;
                }
            }
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Order undo failed'),
            };
        }
    }
}
// #### 5. **Invoker (Command Executor)**
// The invoker will issue commands and also allow for undoing operations.
// Invoker
class OrderManager {
    constructor() {
        this.commandHistory = [];
    }
    async processOrder(command) {
        const result = await command.execute();
        if (result.success) {
            this.commandHistory.push(command);
        }
        return result;
    }
    async undoLastOrder() {
        const lastCommand = this.commandHistory.pop();
        if (lastCommand) {
            return await lastCommand.undo();
        }
        return { success: false, error: new Error('No orders to undo') };
    }
}
// #### 6. **Client Code**
// Now, let's simulate the client code that processes an order.
// Client Code
const paymentSystem = new PaymentSystem();
const inventorySystem = new InventorySystem();
const shippingSystem = new ShippingSystem();
const invoiceSystem = new InvoiceSystem();
const processPayment = new ProcessPaymentCommand(paymentSystem, 'user123', 100);
const updateInventory = new UpdateInventoryCommand(inventorySystem, 'item456', 1);
const shipOrder = new ShipOrderCommand(shippingSystem, 'order789', '123 Main St');
const generateInvoice = new GenerateInvoiceCommand(invoiceSystem, 'order789', 100);
// Create a composite command to process the entire order
const processOrderCommand = new ProcessOrderCommand([
    processPayment,
    updateInventory,
    shipOrder,
    generateInvoice,
]);
const orderManager = new OrderManager();
// Process the order
orderManager
    .processOrder(processOrderCommand)
    .then(() => console.log('Order processed successfully'))
    .catch(err => console.error('Order processing failed:', err.message));
// Undo the last order (if needed)
setTimeout(() => {
    orderManager.undoLastOrder();
}, 5000);
// ### Key Features Covered:
// 1. **Composite Commands**: The `ProcessOrderCommand` is a composite command that groups together multiple sub-commands (payment, inventory, shipping, invoice generation) into a single command.
// 2. **Asynchronous Commands**: Commands like `ProcessPaymentCommand` and `ShipOrderCommand` involve asynchronous operations (network requests), handled using `async/await` and returning promises.
// 3. **Contextual Commands**: Commands like `ProcessPaymentCommand` and `ShipOrderCommand` take in specific parameters such as user credentials, order IDs, and amounts, encapsulating the context with each command.
// ### Conclusion
//
// This example demonstrates how the **Command Pattern** can be used to handle multiple types of operations in a real-world e-commerce scenario:
//
//   - **Composite Commands** for processing an order.
// - **Asynchronous Commands** for tasks like payment processing and shipping.
// - **Contextual Commands** where each command is provided with the necessary context (e.g., user details, order IDs).
//
// This covers the full power of the **Command Pattern** in real-world applications and shows how it can be used effectively in product-based environments.
//# sourceMappingURL=01-v2.js.map