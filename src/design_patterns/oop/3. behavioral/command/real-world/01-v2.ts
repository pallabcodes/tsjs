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

// We will define the `Command` interface that will be used for both synchronous and asynchronous commands. It will have an `execute()` method and can also return a promise for asynchronous operations.

// Command interface
interface Command {
    execute(): Promise<void> | void;
    undo(): void;
}

// #### 2. **Receiver (Systems/Subsystems)**

// Each of the tasks (payment, inventory, shipping, invoice generation) is handled by different subsystems.

// Receiver: Payment System
class PaymentSystem {
    async processPayment(userId: string, amount: number): Promise<boolean> {
        console.log(`Processing payment of $${amount} for user ${userId}`);
        // Simulate async payment processing (e.g., network request)
        return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
    }

    refund(userId: string, amount: number): void {
        console.log(`Refunding $${amount} to user ${userId}`);
    }
}

// Receiver: Inventory System
class InventorySystem {
    updateStock(itemId: string, quantity: number): void {
        console.log(`Updating stock for item ${itemId}: decreasing quantity by ${quantity}`);
    }

    revertStock(itemId: string, quantity: number): void {
        console.log(`Reverting stock for item ${itemId}: increasing quantity by ${quantity}`);
    }
}

// Receiver: Shipping System
class ShippingSystem {
    async shipOrder(orderId: string, address: string): Promise<void> {
        console.log(`Shipping order ${orderId} to address ${address}`);
        // Simulate async shipping process (e.g., network request)
        return new Promise((resolve) => setTimeout(() => resolve(), 2000));
    }

    cancelShipping(orderId: string): void {
        console.log(`Canceling shipping for order ${orderId}`);
    }
}

// Receiver: Invoice System
class InvoiceSystem {
    generateInvoice(orderId: string, amount: number): void {
        console.log(`Generating invoice for order ${orderId} with total amount $${amount}`);
    }

    cancelInvoice(orderId: string): void {
        console.log(`Canceling invoice for order ${orderId}`);
    }
}

// #### 3. **Concrete Command Classes**

// Each task (payment processing, inventory update, etc.) will have a command class. Some of these commands will involve asynchronous operations, such as network requests.

// Command: ProcessPaymentCommand
class ProcessPaymentCommand implements Command {
    private paymentSystem: PaymentSystem;
    private userId: string;
    private amount: number;

    constructor(paymentSystem: PaymentSystem, userId: string, amount: number) {
        this.paymentSystem = paymentSystem;
        this.userId = userId;
        this.amount = amount;
    }

    async execute(): Promise<void> {
        const success = await this.paymentSystem.processPayment(this.userId, this.amount);
        if (!success) {
            throw new Error('Payment failed');
        }
    }

    undo(): void {
        this.paymentSystem.refund(this.userId, this.amount);
    }
}

// Command: UpdateInventoryCommand
class UpdateInventoryCommand implements Command {
    private inventorySystem: InventorySystem;
    private itemId: string;
    private quantity: number;

    constructor(inventorySystem: InventorySystem, itemId: string, quantity: number) {
        this.inventorySystem = inventorySystem;
        this.itemId = itemId;
        this.quantity = quantity;
    }

    execute(): void {
        this.inventorySystem.updateStock(this.itemId, this.quantity);
    }

    undo(): void {
        this.inventorySystem.revertStock(this.itemId, this.quantity);
    }
}

// Command: ShipOrderCommand
class ShipOrderCommand implements Command {
    private shippingSystem: ShippingSystem;
    private orderId: string;
    private address: string;

    constructor(shippingSystem: ShippingSystem, orderId: string, address: string) {
        this.shippingSystem = shippingSystem;
        this.orderId = orderId;
        this.address = address;
    }

    async execute(): Promise<void> {
        await this.shippingSystem.shipOrder(this.orderId, this.address);
    }

    undo(): void {
        this.shippingSystem.cancelShipping(this.orderId);
    }
}

// Command: GenerateInvoiceCommand
class GenerateInvoiceCommand implements Command {
    private invoiceSystem: InvoiceSystem;
    private orderId: string;
    private amount: number;

    constructor(invoiceSystem: InvoiceSystem, orderId: string, amount: number) {
        this.invoiceSystem = invoiceSystem;
        this.orderId = orderId;
        this.amount = amount;
    }

    execute(): void {
        this.invoiceSystem.generateInvoice(this.orderId, this.amount);
    }

    undo(): void {
        this.invoiceSystem.cancelInvoice(this.orderId);
    }
}

// #### 4. **Composite Command (Processing an Order)**

// The **Composite Command** will execute multiple commands at once (e.g., processing payment, updating inventory, shipping, and generating an invoice).

// Composite Command: ProcessOrderCommand
class ProcessOrderCommand implements Command {
    private commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    async execute(): Promise<void> {
        // Execute each command sequentially
        for (const command of this.commands) {
            await command.execute();
        }
    }

    undo(): void {
        // Undo commands in reverse order
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }
}

// #### 5. **Invoker (Command Executor)**

// The invoker will issue commands and also allow for undoing operations.

// Invoker
class OrderManager {
    private commandHistory: Command[] = [];

    async processOrder(command: Command): Promise<void> {
        await command.execute();
        this.commandHistory.push(command);
    }

    undoLastOrder(): void {
        const lastCommand = this.commandHistory.pop();
        if (lastCommand) {
            lastCommand.undo();
        } else {
            console.log("No orders to undo");
        }
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
    generateInvoice
]);

const orderManager = new OrderManager();

// Process the order
orderManager.processOrder(processOrderCommand)
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