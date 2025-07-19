"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.CancelledState = exports.DeliveredState = exports.ShippedState = exports.PendingState = exports.DraftState = exports.BaseOrderState = void 0;
exports.demo = demo;
// Base state class
class BaseOrderState {
    constructor(order) {
        this.allowedTransitions = new Set();
        this.order = order;
    }
    canTransitionTo(event) {
        return this.allowedTransitions.has(event);
    }
    process(event) {
        if (!this.canTransitionTo(event.type)) {
            throw new Error(`Invalid state transition from ${this.getStatus()} to ${event.type}`);
        }
        return this.handleProcess(event);
    }
}
exports.BaseOrderState = BaseOrderState;
// Export concrete state classes
class DraftState extends BaseOrderState {
    constructor(order) {
        super(order);
        this.allowedTransitions = new Set(['CONFIRM_ORDER', 'CANCEL_ORDER']);
    }
    getStatus() {
        return 'DRAFT';
    }
    handleProcess(event) {
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
exports.DraftState = DraftState;
class PendingState extends BaseOrderState {
    constructor(order) {
        super(order);
        this.allowedTransitions = new Set(['SHIP_ORDER', 'CANCEL_ORDER']);
    }
    getStatus() {
        return 'PENDING';
    }
    handleProcess(event) {
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
exports.PendingState = PendingState;
class ShippedState extends BaseOrderState {
    constructor(order) {
        super(order);
        this.allowedTransitions = new Set(['DELIVER_ORDER']);
    }
    getStatus() {
        return 'SHIPPED';
    }
    handleProcess(event) {
        if (event.type === 'DELIVER_ORDER') {
            this.order.setDeliveryDate(event.deliveryDate);
            return new DeliveredState(this.order);
        }
        throw new Error('Unsupported event');
    }
}
exports.ShippedState = ShippedState;
class DeliveredState extends BaseOrderState {
    getStatus() {
        return 'DELIVERED';
    }
    handleProcess(_event) {
        throw new Error('Cannot process order in current state');
    }
}
exports.DeliveredState = DeliveredState;
class CancelledState extends BaseOrderState {
    constructor(order, reason) {
        super(order);
        order.setCancellationReason(reason);
    }
    getStatus() {
        return 'CANCELLED';
    }
    handleProcess(_event) {
        throw new Error('Cannot process cancelled order');
    }
}
exports.CancelledState = CancelledState;
// Export the Order class
class Order {
    constructor(id) {
        this.id = id;
        this.state = new DraftState(this);
    }
    // State management methods
    process(event) {
        try {
            this.state = this.state.process(event);
            this.logStateTransition(event);
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    getStatus() {
        return this.state.getStatus();
    }
    // Setters for order details
    setPaymentDetails(details) {
        this.paymentDetails = details;
    }
    setTrackingNumber(number) {
        this.trackingNumber = number;
    }
    setDeliveryDate(date) {
        this.deliveryDate = date;
    }
    setCancellationReason(reason) {
        this.cancellationReason = reason;
    }
    // Error handling and logging
    handleError(error) {
        // Implementation would depend on your logging/monitoring setup
        console.error(`Order ${this.id} error:`, error);
    }
    logStateTransition(event) {
        // Implementation would depend on your logging/monitoring setup
        console.log(`Order ${this.id} state transition: ${event.type}`);
    }
}
exports.Order = Order;
// Export the demo function
function demo() {
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
    }
    catch (error) {
        console.error('Expected error:', error);
    }
}
//# sourceMappingURL=all-usage.js.map