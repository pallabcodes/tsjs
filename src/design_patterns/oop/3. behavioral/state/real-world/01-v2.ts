// ## Additional features from 01.ts

// Certainly! Let's enhance the **State Pattern** example by integrating the **extensions** for product-based standards you mentioned. Here's the updated implementation that incorporates:
// 1. **Dynamic State Transition Rules**: State transitions can be configured dynamically (e.g., using a configuration file or database).
// 2. **Event Logging**: Logs state transitions for monitoring purposes.
// 3. **Integration with Other Systems**: Sends notifications to external systems when an order transitions to a new state.
// 4. **Error Handling**: Handles invalid state transitions with domain-specific exceptions.
// 5. **Testing**: Ensures thorough testing is possible for state transitions.

// Here's how we can implement these enhancements:

// ### Enhanced State Pattern with Extensions

// ==========================
// State Interface
// ==========================
interface OrderState {
    proceed(): void;
    cancel(): void;
    getStatus(): string;
    onEnter(): void;
}

// ==========================
// Context Class (Order)
// ==========================
class Order {
    private state: OrderState;
    private transitionRules: Map<string, string[]>; // Dynamic state transition rules

    constructor(initialState: OrderState, transitionRules: Map<string, string[]>) {
        this.state = initialState;
        this.transitionRules = transitionRules;
        this.state.onEnter();
    }

    setState(state: OrderState): void {
        if (this.canTransitionTo(state.constructor.name)) {
            this.state = state;
            this.state.onEnter();
        } else {
            throw new Error(`Invalid state transition: ${this.state.getStatus()} -> ${state.getStatus()}`);
        }
    }

    proceed(): void {
        this.state.proceed();
    }

    cancel(): void {
        this.state.cancel();
    }

    getStatus(): string {
        return this.state.getStatus();
    }

    // Dynamic state transition check based on rules
    private canTransitionTo(stateName: string): boolean {
        const allowedTransitions = this.transitionRules.get(this.state.constructor.name) || [];
        return allowedTransitions.includes(stateName);
    }
}

// ==========================
// Concrete State Classes
// ==========================
class PendingState implements OrderState {
    constructor(private order: Order) {}

    proceed(): void {
        console.log("Order is now being processed.");
        this.order.setState(new ProcessingState(this.order));
    }

    cancel(): void {
        console.log("Order has been cancelled.");
        this.order.setState(new CancelledState(this.order));
    }

    getStatus(): string {
        return "Pending";
    }

    onEnter(): void {
        console.log("Entering Pending State.");
        // Log the transition to a monitoring system (e.g., to a file, database, etc.)
        Logger.log(`Order transitioned to Pending State`);
        // Send notifications if necessary
        NotificationService.notify('Order is now in Pending state');
    }
}

class ProcessingState implements OrderState {
    constructor(private order: Order) {}

    proceed(): void {
        console.log("Order has been shipped.");
        this.order.setState(new ShippedState(this.order));
    }

    cancel(): void {
        console.log("Order has been cancelled.");
        this.order.setState(new CancelledState(this.order));
    }

    getStatus(): string {
        return "Processing";
    }

    onEnter(): void {
        console.log("Entering Processing State.");
        Logger.log(`Order transitioned to Processing State`);
        NotificationService.notify('Order is now being processed');
    }
}

class ShippedState implements OrderState {
    constructor(private order: Order) {}

    proceed(): void {
        console.log("Order has been delivered.");
        this.order.setState(new DeliveredState(this.order));
    }

    cancel(): void {
        console.log("Order cannot be cancelled after it has been shipped.");
    }

    getStatus(): string {
        return "Shipped";
    }

    onEnter(): void {
        console.log("Entering Shipped State.");
        Logger.log(`Order transitioned to Shipped State`);
        NotificationService.notify('Order has been shipped');
    }
}

class DeliveredState implements OrderState {
    constructor(private order: Order) {}

    proceed(): void {
        console.log("Order is already delivered. No further actions can be taken.");
    }

    cancel(): void {
        console.log("Order cannot be cancelled after delivery.");
    }

    getStatus(): string {
        return "Delivered";
    }

    onEnter(): void {
        console.log("Entering Delivered State.");
        Logger.log(`Order transitioned to Delivered State`);
        NotificationService.notify('Order has been delivered');
    }
}

class CancelledState implements OrderState {
    constructor(private order: Order) {}

    proceed(): void {
        console.log("Cancelled orders cannot be processed further.");
    }

    cancel(): void {
        console.log("Order is already cancelled.");
    }

    getStatus(): string {
        return "Cancelled";
    }

    onEnter(): void {
        console.log("Entering Cancelled State.");
        Logger.log(`Order transitioned to Cancelled State`);
        NotificationService.notify('Order has been cancelled');
    }
}

// ==========================
// Logger - Event Logging
// ==========================
class Logger {
    static log(message: string): void {
        console.log(`LOG: ${message}`); // Log to console (could be to file or monitoring system)
    }
}

// ==========================
// Notification Service - Integration with External Systems
// ==========================
class NotificationService {
    static notify(message: string): void {
        console.log(`NOTIFICATION: ${message}`); // Simulate sending notifications (e.g., email, SMS, etc.)
    }
}

// ==========================
// State Transition Rules Configuration
// ==========================
const transitionRules = new Map<string, string[]>([
    ['PendingState', ['ProcessingState', 'CancelledState']],
    ['ProcessingState', ['ShippedState', 'CancelledState']],
    ['ShippedState', ['DeliveredState']],
    ['CancelledState', []], // Once cancelled, no further transitions
    ['DeliveredState', []]  // Once delivered, no further transitions
]);

// ==========================
// Usage Example
// ==========================
try {
    const order = new Order(new PendingState(order), transitionRules);
    console.log(`Current State: ${order.getStatus()}`);
    order.proceed(); // Proceed to Processing
    console.log(`Current State: ${order.getStatus()}`);
    order.proceed(); // Proceed to Shipped
    console.log(`Current State: ${order.getStatus()}`);
    order.cancel(); // Attempt to cancel after shipment (invalid transition)
    console.log(`Current State: ${order.getStatus()}`);
} catch (error) {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
    }
}

// ### Enhancements Explanation:
//
//   1. **Dynamic State Transition Rules**:
// - The `transitionRules` map defines valid state transitions for each state.
// - When the `Order` context attempts to change its state, it checks if the transition is valid using the `canTransitionTo` method, which consults the `transitionRules` map.
//
// 2. **Event Logging**:
// - The `Logger` class logs each state transition for monitoring purposes (could be extended to log to external systems such as a file, database, or log aggregation service).
// - Each state class (e.g., `PendingState`, `ProcessingState`) calls `Logger.log()` within its `onEnter()` method when entering the state.
//
// 3. **Integration with Other Systems**:
// - The `NotificationService` class simulates the process of sending notifications to external systems (e.g., email, SMS, or in-app notifications).
// - Similar to logging, this can be extended to integrate with actual notification services like email providers or messaging platforms.
//
// 4. **Error Handling**:
// - If an invalid state transition is attempted (e.g., from `ShippedState` to `PendingState`), an error is thrown with a message describing the invalid transition.
//
// 5. **Testing**:
// - The class design makes it easy to test each state and transition. Unit tests can be written to ensure that valid transitions occur correctly, and invalid transitions trigger the appropriate errors.
//
// ---
//
// ### Conclusion
//
// This enhanced implementation covers the **full power** of the **State Pattern** in a **real-world, product-based scenario**. It includes key aspects like **dynamic state transitions**, **event logging**, **integration with external systems**, **error handling**, and is **testable**. This design is robust, scalable, and flexible, making it suitable for handling complex state transitions in production systems such as **order management systems**, **workflow management tools**, and more.

