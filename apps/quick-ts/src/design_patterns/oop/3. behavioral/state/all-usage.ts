// Export interfaces and types
export interface PaymentDetails {
  amount: number;
  paymentMethod: string;
  transactionId: string;
}

export type OrderEvent =
  | { type: 'CONFIRM_ORDER'; paymentDetails: PaymentDetails }
  | { type: 'SHIP_ORDER'; trackingNumber: string }
  | { type: 'DELIVER_ORDER'; deliveryDate: Date }
  | { type: 'CANCEL_ORDER'; reason: string };

export interface OrderState {
  process(event: OrderEvent): OrderState;
  getStatus(): string;
  canTransitionTo(event: OrderEvent['type']): boolean;
}

// Base state class
export abstract class BaseOrderState implements OrderState {
  protected order: Order;
  protected allowedTransitions: Set<string> = new Set();

  constructor(order: Order) {
    this.order = order;
  }

  abstract getStatus(): string;

  canTransitionTo(event: OrderEvent['type']): boolean {
    return this.allowedTransitions.has(event);
  }

  process(event: OrderEvent): OrderState {
    if (!this.canTransitionTo(event.type)) {
      throw new Error(
        `Invalid state transition from ${this.getStatus()} to ${event.type}`
      );
    }
    return this.handleProcess(event);
  }

  protected abstract handleProcess(event: OrderEvent): OrderState;
}

// Export concrete state classes
export class DraftState extends BaseOrderState {
  constructor(order: Order) {
    super(order);
    this.allowedTransitions = new Set(['CONFIRM_ORDER', 'CANCEL_ORDER']);
  }

  getStatus(): string {
    return 'DRAFT';
  }

  protected handleProcess(event: OrderEvent): OrderState {
    switch (event.type) {
      case 'CONFIRM_ORDER':
        this.order.setPaymentDetails(event.paymentDetails);
        return new PendingState(this.order);
      case 'CANCEL_ORDER':
        return new CancelledState(this.order, event.reason);
      default:
        throw new Error('Unsupported event');
    }
  }
}

export class PendingState extends BaseOrderState {
  constructor(order: Order) {
    super(order);
    this.allowedTransitions = new Set(['SHIP_ORDER', 'CANCEL_ORDER']);
  }

  getStatus(): string {
    return 'PENDING';
  }

  protected handleProcess(event: OrderEvent): OrderState {
    switch (event.type) {
      case 'SHIP_ORDER':
        this.order.setTrackingNumber(event.trackingNumber);
        return new ShippedState(this.order);
      case 'CANCEL_ORDER':
        return new CancelledState(this.order, event.reason);
      default:
        throw new Error('Unsupported event');
    }
  }
}

export class ShippedState extends BaseOrderState {
  constructor(order: Order) {
    super(order);
    this.allowedTransitions = new Set(['DELIVER_ORDER']);
  }

  getStatus(): string {
    return 'SHIPPED';
  }

  protected handleProcess(event: OrderEvent): OrderState {
    if (event.type === 'DELIVER_ORDER') {
      this.order.setDeliveryDate(event.deliveryDate);
      return new DeliveredState(this.order);
    }
    throw new Error('Unsupported event');
  }
}

export class DeliveredState extends BaseOrderState {
  getStatus(): string {
    return 'DELIVERED';
  }

  protected handleProcess(_event: OrderEvent): OrderState {
    throw new Error('Cannot process order in current state');
  }
}

export class CancelledState extends BaseOrderState {
  constructor(order: Order, reason: string) {
    super(order);
    order.setCancellationReason(reason);
  }

  getStatus(): string {
    return 'CANCELLED';
  }

  protected handleProcess(_event: OrderEvent): OrderState {
    throw new Error('Cannot process cancelled order');
  }
}

// Export the Order class
export class Order {
  private state: OrderState;
  private id: string;
  private paymentDetails?: PaymentDetails;
  private trackingNumber?: string;
  private deliveryDate?: Date;
  private cancellationReason?: string;

  constructor(id: string) {
    this.id = id;
    this.state = new DraftState(this);
  }

  // State management methods
  process(event: OrderEvent): void {
    try {
      this.state = this.state.process(event);
      this.logStateTransition(event);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  getStatus(): string {
    return this.state.getStatus();
  }

  // Setters for order details
  setPaymentDetails(details: PaymentDetails): void {
    this.paymentDetails = details;
  }

  setTrackingNumber(number: string): void {
    this.trackingNumber = number;
  }

  setDeliveryDate(date: Date): void {
    this.deliveryDate = date;
  }

  setCancellationReason(reason: string): void {
    this.cancellationReason = reason;
  }

  // Error handling and logging
  private handleError(error: unknown): void {
    // Implementation would depend on your logging/monitoring setup
    console.error(`Order ${this.id} error:`, error);
  }

  private logStateTransition(event: OrderEvent): void {
    // Implementation would depend on your logging/monitoring setup
    console.log(`Order ${this.id} state transition: ${event.type}`);
  }
}

// Export the demo function
export function demo(): void {
  const order = new Order('ORD-123');
  console.log(order.getStatus()); // DRAFT

  // Confirm order
  order.process({
    type: 'CONFIRM_ORDER',
    paymentDetails: {
      amount: 99.99,
      paymentMethod: 'CREDIT_CARD',
      transactionId: 'TXN-456',
    },
  });
  console.log(order.getStatus()); // PENDING

  // Ship order
  order.process({
    type: 'SHIP_ORDER',
    trackingNumber: 'TRACK-789',
  });
  console.log(order.getStatus()); // SHIPPED

  // Deliver order
  order.process({
    type: 'DELIVER_ORDER',
    deliveryDate: new Date(),
  });
  console.log(order.getStatus()); // DELIVERED

  // Trying to process a delivered order will throw an error
  try {
    order.process({
      type: 'SHIP_ORDER',
      trackingNumber: 'TRACK-000',
    });
  } catch (error) {
    console.error('Expected error:', error);
  }
}
