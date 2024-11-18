// The **State Pattern** is designed to manage the behavior of an object as its state changes, allowing the object to alter its behavior dynamically without relying on cumbersome conditionals or repetitive logic.
//
//   Below, I’ll provide a **real-world example** that demonstrates the full power of the **State Pattern** and how it can be used in **product-based development standards**.
//
// We'll use an example of an **Order Management System** with various states for an order, such as:
//
// - **Pending:** The order has been created but not yet processed.
// - **Processing:** The order is being processed.
// - **Shipped:** The order has been shipped but not delivered.
// - **Delivered:** The order has been delivered to the customer.
// - **Cancelled:** The order has been cancelled.
//
//   Each state has its own set of behaviors, and transitioning between states is governed by certain rules. This example covers:
//
//   - Dynamic behavior changes based on the current state.
// - Encapsulation of state-specific logic within individual classes.
// - Compliance with product-based development standards by separating concerns and ensuring extensibility.

// ### Complete Example: Order Management with State Pattern

// ==========================
// State Interface
// ==========================
interface OrderState {
  proceed(): void;
  cancel(): void;
  getStatus(): string;
}

// ==========================
// Context Class
// ==========================
class Order {
  private state: OrderState;

  constructor(initialState: OrderState) {
    this.state = initialState;
  }

  setState(state: OrderState): void {
    this.state = state;
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
}

// ==========================
// Concrete State Classes
// ==========================
class PendingState implements OrderState {
  private order?: Order;

  setOrder(order: Order) {
    this.order = order;
  }

  proceed(): void {
    if (!this.order) throw new Error('Order not set');
    console.log('Order is now being processed.');
    this.order.setState(new ProcessingState(this.order));
  }

  cancel(): void {
    if (!this.order) throw new Error('Order not set');
    console.log('Order has been cancelled.');
    this.order.setState(new CancelledState(this.order));
  }

  getStatus(): string {
    return 'Pending';
  }
}

class ProcessingState implements OrderState {
  constructor(private order: Order) {}

  proceed(): void {
    console.log('Order has been shipped.');
    this.order.setState(new ShippedState(this.order));
  }

  cancel(): void {
    console.log('Order has been cancelled.');
    this.order.setState(new CancelledState(this.order));
  }

  getStatus(): string {
    return 'Processing';
  }
}

class ShippedState implements OrderState {
  constructor(private order: Order) {}

  proceed(): void {
    console.log('Order has been delivered.');
    this.order.setState(new DeliveredState(this.order));
  }

  cancel(): void {
    console.log('Order cannot be cancelled after it has been shipped.');
  }

  getStatus(): string {
    return 'Shipped';
  }
}

class DeliveredState implements OrderState {
  constructor(private order: Order) {}

  proceed(): void {
    console.log('Order is already delivered. No further actions can be taken.');
  }

  cancel(): void {
    console.log('Order cannot be cancelled after delivery.');
  }

  getStatus(): string {
    return 'Delivered';
  }
}

class CancelledState implements OrderState {
  constructor(private order: Order) {}

  proceed(): void {
    console.log('Cancelled orders cannot be processed further.');
  }

  cancel(): void {
    console.log('Order is already cancelled.');
  }

  getStatus(): string {
    return 'Cancelled';
  }
}

// ==========================
// Usage Example
// ==========================
const initialState = new PendingState();
const order = new Order(initialState);
initialState.setOrder(order);

console.log(`Initial State: ${order.getStatus()}`);
order.proceed(); // Proceed to Processing
console.log(`Current State: ${order.getStatus()}`);
order.proceed(); // Proceed to Shipped
console.log(`Current State: ${order.getStatus()}`);
order.cancel(); // Attempt to cancel after shipment
console.log(`Current State: ${order.getStatus()}`);
order.proceed(); // Proceed to Delivered
console.log(`Current State: ${order.getStatus()}`);

// ### Breakdown of Concepts in the Example:
//
//   1. **Dynamic Behavior Changes**:
// - The behavior of the `Order` object depends on its current state (`Pending`, `Processing`, `Shipped`, etc.).
// - Each state encapsulates its own behavior, ensuring clean separation of concerns.
//
// 2. **Encapsulation of State-Specific Logic**:
// - State-specific rules (e.g., "An order cannot be cancelled after it has been shipped") are encapsulated in their respective classes (`ShippedState`, `DeliveredState`, etc.).
// - This makes the system easy to maintain and extend.
//
// 3. **Extensibility**:
// - Adding new states (e.g., `ReturnedState`) or modifying behavior is straightforward. You just add a new class and update the transitions where necessary, without disrupting existing code.
//
// 4. **Compliance with Product-Based Standards**:
// - The example is realistic and reflects actual product requirements, such as handling different order statuses dynamically and ensuring rules are enforced consistently.

// 5. **Real-World Context**:
// - Systems like **e-commerce platforms**, **ticket booking systems**, and **workflow management tools** commonly use the State Pattern for managing the life cycle of orders, tickets, or tasks.

// ### Does This Cover the Full Power of the State Pattern?
//
//   This example demonstrates the core principles and the "full power" of the **State Pattern** in real-world scenarios:
//
//   - It avoids long conditional chains (e.g., `if-else` or `switch` statements).
// - It provides a scalable and maintainable approach to manage state-specific behavior.
// - It demonstrates the dynamic behavior of the context object as its state changes.
// - It can handle multiple states and transitions without cluttering the code.
//
// ### Extensions for Product-Based Standards**:
//
//   While this example is solid, here are some ways you could further enhance it:
//
//   1. **Dynamic State Transition Rules**:
// - Allow state transitions to be dynamically configured (e.g., loading state transition rules from a database or configuration file).
//
// 2. **Event Logging**:
// - Add logging for state transitions (e.g., log to a file or monitoring system when an order moves from `Pending` to `Processing`).
//
// 3. **Integration with Other Systems**:
// - Integrate state transitions with external systems, such as sending notifications (e.g., "Your order has been shipped.").
//
// 4. **Error Handling**:
// - Add robust error handling for invalid state transitions (e.g., raise domain-specific exceptions for unsupported transitions).
//
// 5. **Testing**:
// - Ensure thorough testing of state transitions using unit tests and integration tests.
//
// ---
//
// ### Conclusion
//
// This example, with its extensions, provides a comprehensive look at the **State Pattern** and how it can be applied in real-world, product-based scenarios. It’s sufficient to cover the key aspects and demonstrates the pattern's full power. If implemented with the suggested enhancements, it aligns well with industry standards for product-based development.
