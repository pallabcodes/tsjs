// 1. Order Processing System Example
namespace OrderProcessing {
    // Events that can trigger state changes
    type OrderEvent = 
        | { type: 'CONFIRM_ORDER'; paymentDetails: PaymentDetails }
        | { type: 'SHIP_ORDER'; trackingNumber: string }
        | { type: 'DELIVER_ORDER'; deliveryDate: Date }
        | { type: 'CANCEL_ORDER'; reason: string };

    interface PaymentDetails {
        amount: number;
        paymentMethod: string;
        transactionId: string;
    }

    // Order states interface
    interface OrderState {
        process(event: OrderEvent): OrderState;
        getStatus(): string;
        canTransitionTo(event: OrderEvent['type']): boolean;
    }

    // Base state class with common functionality
    abstract class BaseOrderState implements OrderState {
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
                    `Invalid state transition: ${this.getStatus()} -> ${event.type}`
                );
            }
            return this.handleProcess(event);
        }

        protected abstract handleProcess(event: OrderEvent): OrderState;
    }

    // Concrete states
    class DraftState extends BaseOrderState {
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

    class PendingState extends BaseOrderState {
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

    class ShippedState extends BaseOrderState {
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

    class DeliveredState extends BaseOrderState {
        getStatus(): string {
            return 'DELIVERED';
        }

        protected handleProcess(): OrderState {
            throw new Error('Order is already delivered');
        }
    }

    class CancelledState extends BaseOrderState {
        constructor(order: Order, reason: string) {
            super(order);
            order.setCancellationReason(reason);
        }

        getStatus(): string {
            return 'CANCELLED';
        }

        protected handleProcess(): OrderState {
            throw new Error('Cannot process cancelled order');
        }
    }

    // Context class
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

    // Usage example
    export function demo(): void {
        const order = new Order('ORD-123');
        console.log(order.getStatus()); // DRAFT

        // Confirm order
        order.process({
            type: 'CONFIRM_ORDER',
            paymentDetails: {
                amount: 99.99,
                paymentMethod: 'CREDIT_CARD',
                transactionId: 'TXN-456'
            }
        });
        console.log(order.getStatus()); // PENDING

        // Ship order
        order.process({
            type: 'SHIP_ORDER',
            trackingNumber: 'TRACK-789'
        });
        console.log(order.getStatus()); // SHIPPED

        // Deliver order
        order.process({
            type: 'DELIVER_ORDER',
            deliveryDate: new Date()
        });
        console.log(order.getStatus()); // DELIVERED

        // Trying to process a delivered order will throw an error
        try {
            order.process({
                type: 'SHIP_ORDER',
                trackingNumber: 'TRACK-000'
            });
        } catch (error) {
            console.error('Expected error:', error);
        }
    }
}

// 2. Document Management System Example
namespace DocumentManagement {
    interface User {
        id: string;
        role: 'AUTHOR' | 'REVIEWER' | 'PUBLISHER';
    }

    interface ReviewComment {
        id: string;
        userId: string;
        content: string;
        timestamp: Date;
    }

    type DocumentEvent = 
        | { type: 'SUBMIT_FOR_REVIEW'; reviewerId: string }
        | { type: 'APPROVE'; reviewerId: string }
        | { type: 'REQUEST_CHANGES'; comments: ReviewComment[] }
        | { type: 'PUBLISH' }
        | { type: 'ARCHIVE'; reason: string };

    interface DocumentState {
        process(event: DocumentEvent): DocumentState;
        getStatus(): string;
        canUserEdit(user: User): boolean;
        canUserReview(user: User): boolean;
    }

    abstract class BaseDocumentState implements DocumentState {
        protected document: Document;
        protected allowedTransitions: Set<string> = new Set();

        constructor(document: Document) {
            this.document = document;
        }

        abstract getStatus(): string;
        abstract canUserEdit(user: User): boolean;
        abstract canUserReview(user: User): boolean;

        process(event: DocumentEvent): DocumentState {
            if (!this.allowedTransitions.has(event.type)) {
                throw new Error(
                    `Invalid state transition: ${this.getStatus()} -> ${event.type}`
                );
            }
            return this.handleProcess(event);
        }

        protected abstract handleProcess(event: DocumentEvent): DocumentState;
    }

    class DraftState extends BaseDocumentState {
        constructor(document: Document) {
            super(document);
            this.allowedTransitions = new Set(['SUBMIT_FOR_REVIEW']);
        }

        getStatus(): string {
            return 'DRAFT';
        }

        canUserEdit(user: User): boolean {
            return user.role === 'AUTHOR';
        }

        canUserReview(): boolean {
            return false;
        }

        protected handleProcess(event: DocumentEvent): DocumentState {
            if (event.type === 'SUBMIT_FOR_REVIEW') {
                this.document.setReviewerId(event.reviewerId);
                return new UnderReviewState(this.document);
            }
            throw new Error('Unsupported event');
        }
    }

    class UnderReviewState extends BaseDocumentState {
        constructor(document: Document) {
            super(document);
            this.allowedTransitions = new Set(['APPROVE', 'REQUEST_CHANGES']);
        }

        getStatus(): string {
            return 'UNDER_REVIEW';
        }

        canUserEdit(user: User): boolean {
            return false;
        }

        canUserReview(user: User): boolean {
            return user.role === 'REVIEWER' && user.id === this.document.getReviewerId();
        }

        protected handleProcess(event: DocumentEvent): DocumentState {
            switch (event.type) {
                case 'APPROVE':
                    return new ApprovedState(this.document);
                case 'REQUEST_CHANGES':
                    this.document.addReviewComments(event.comments);
                    return new DraftState(this.document);
                default:
                    throw new Error('Unsupported event');
            }
        }
    }

    class ApprovedState extends BaseDocumentState {
        constructor(document: Document) {
            super(document);
            this.allowedTransitions = new Set(['PUBLISH']);
        }

        getStatus(): string {
            return 'APPROVED';
        }

        canUserEdit(user: User): boolean {
            return false;
        }

        canUserReview(): boolean {
            return false;
        }

        protected handleProcess(event: DocumentEvent): DocumentState {
            if (event.type === 'PUBLISH') {
                return new PublishedState(this.document);
            }
            throw new Error('Unsupported event');
        }
    }

    class PublishedState extends BaseDocumentState {
        constructor(document: Document) {
            super(document);
            this.allowedTransitions = new Set(['ARCHIVE']);
        }

        getStatus(): string {
            return 'PUBLISHED';
        }

        canUserEdit(user: User): boolean {
            return false;
        }

        canUserReview(): boolean {
            return false;
        }

        protected handleProcess(event: DocumentEvent): DocumentState {
            if (event.type === 'ARCHIVE') {
                return new ArchivedState(this.document, event.reason);
            }
            throw new Error('Unsupported event');
        }
    }

    class ArchivedState extends BaseDocumentState {
        constructor(document: Document, reason: string) {
            super(document);
            // Store archive reason if needed
        }

        getStatus(): string {
            return 'ARCHIVED';
        }

        canUserEdit(): boolean {
            return false;
        }

        canUserReview(): boolean {
            return false;
        }

        protected handleProcess(): DocumentState {
            throw new Error('Cannot process archived document');
        }
    }

    export class Document {
        private state: DocumentState;
        private id: string;
        private content: string;
        private authorId: string;
        private reviewerId?: string;
        private version: number;
        private history: Array<{
            state: string;
            timestamp: Date;
            userId: string;
        }>;

        constructor(id: string, authorId: string, content: string) {
            this.id = id;
            this.authorId = authorId;
            this.content = content;
            this.version = 1;
            this.history = [];
            this.state = new DraftState(this);
            this.logStateChange(authorId);
        }

        // State management
        process(event: DocumentEvent, userId: string): void {
            try {
                this.state = this.state.process(event);
                this.logStateChange(userId);
            } catch (error) {
                this.handleError(error);
                throw error;
            }
        }

        // Getters and setters
        getStatus(): string {
            return this.state.getStatus();
        }

        setReviewerId(reviewerId: string): void {
            this.reviewerId = reviewerId;
        }

        canUserEdit(user: User): boolean {
            return this.state.canUserEdit(user);
        }

        canUserReview(user: User): boolean {
            return this.state.canUserReview(user);
        }

        getReviewerId(): string | undefined {
            return this.reviewerId;
        }

        addReviewComments(comments: ReviewComment[]): void {
            // Implementation to store review comments
            console.log(`Adding ${comments.length} review comments`);
        }

        // Private helper methods
        private logStateChange(userId: string): void {
            this.history.push({
                state: this.getStatus(),
                timestamp: new Date(),
                userId
            });
        }

        private handleError(error: unknown): void {
            console.error(`Document ${this.id} error:`, error);
        }
    }
}

// 3. Payment Processing System Example
namespace PaymentProcessing {
    interface PaymentDetails {
        amount: number;
        currency: string;
        paymentMethod: string;
        customerId: string;
    }

    type PaymentEvent =
        | { type: 'AUTHORIZE'; authorizationCode: string }
        | { type: 'CAPTURE' }
        | { type: 'FAIL'; reason: string }
        | { type: 'REFUND'; reason: string };

    interface PaymentState {
        process(event: PaymentEvent): PaymentState;
        getStatus(): string;
        canRefund(): boolean;
        canCapture(): boolean;
    }

    abstract class BasePaymentState implements PaymentState {
        protected payment: Payment;
        protected allowedTransitions: Set<string> = new Set();

        constructor(payment: Payment) {
            this.payment = payment;
        }

        abstract getStatus(): string;
        abstract canRefund(): boolean;
        abstract canCapture(): boolean;

        process(event: PaymentEvent): PaymentState {
            if (!this.allowedTransitions.has(event.type)) {
                throw new Error(
                    `Invalid payment transition: ${this.getStatus()} -> ${event.type}`
                );
            }
            return this.handleProcess(event);
        }

        protected abstract handleProcess(event: PaymentEvent): PaymentState;
    }

    class InitiatedState extends BasePaymentState {
        constructor(payment: Payment) {
            super(payment);
            this.allowedTransitions = new Set(['AUTHORIZE', 'FAIL']);
        }

        getStatus(): string {
            return 'INITIATED';
        }

        canRefund(): boolean {
            return false;
        }

        canCapture(): boolean {
            return false;
        }

        protected handleProcess(event: PaymentEvent): PaymentState {
            switch (event.type) {
                case 'AUTHORIZE':
                    this.payment.setAuthorizationCode(event.authorizationCode);
                    return new AuthorizedState(this.payment);
                case 'FAIL':
                    return new FailedState(this.payment, event.reason);
                default:
                    throw new Error('Unsupported event');
            }
        }
    }

    class AuthorizedState extends BasePaymentState {
        constructor(payment: Payment) {
            super(payment);
            this.allowedTransitions = new Set(['CAPTURE', 'FAIL']);
        }

        getStatus(): string {
            return 'AUTHORIZED';
        }

        canRefund(): boolean {
            return false;
        }

        canCapture(): boolean {
            return true;
        }

        protected handleProcess(event: PaymentEvent): PaymentState {
            switch (event.type) {
                case 'CAPTURE':
                    return new CapturedState(this.payment);
                case 'FAIL':
                    return new FailedState(this.payment, event.reason);
                default:
                    throw new Error('Unsupported event');
            }
        }
    }

    class CapturedState extends BasePaymentState {
        constructor(payment: Payment) {
            super(payment);
            this.allowedTransitions = new Set(['REFUND']);
        }

        getStatus(): string {
            return 'CAPTURED';
        }

        canRefund(): boolean {
            return true;
        }

        canCapture(): boolean {
            return false;
        }

        protected handleProcess(event: PaymentEvent): PaymentState {
            if (event.type === 'REFUND') {
                return new RefundedState(this.payment, event.reason);
            }
            throw new Error('Unsupported event');
        }
    }

    class FailedState extends BasePaymentState {
        constructor(payment: Payment, reason: string) {
            super(payment);
            payment.setFailureReason(reason);
        }

        getStatus(): string {
            return 'FAILED';
        }

        canRefund(): boolean {
            return false;
        }

        canCapture(): boolean {
            return false;
        }

        protected handleProcess(): PaymentState {
            throw new Error('Cannot process failed payment');
        }
    }

    class RefundedState extends BasePaymentState {
        constructor(payment: Payment, reason: string) {
            super(payment);
            payment.setRefundReason(reason);
        }

        getStatus(): string {
            return 'REFUNDED';
        }

        canRefund(): boolean {
            return false;
        }

        canCapture(): boolean {
            return false;
        }

        protected handleProcess(): PaymentState {
            throw new Error('Cannot process refunded payment');
        }
    }

    export class Payment {
        private state: PaymentState;
        private id: string;
        private details: PaymentDetails;
        private authorizationCode?: string;
        private captureId?: string;
        private refundId?: string;
        private failureReason?: string;
        private refundReason?: string;

        constructor(id: string, details: PaymentDetails) {
            this.id = id;
            this.details = details;
            this.state = new InitiatedState(this);
        }

        // State management
        process(event: PaymentEvent): void {
            try {
                this.state = this.state.process(event);
                this.logStateTransition(event);
            } catch (error) {
                this.handleError(error);
                throw error;
            }
        }

        // Getters and setters
        getStatus(): string {
            return this.state.getStatus();
        }

        setAuthorizationCode(code: string): void {
            this.authorizationCode = code;
        }

        setFailureReason(reason: string): void {
            this.failureReason = reason;
        }

        setRefundReason(reason: string): void {
            this.refundReason = reason;
            this.refundId = crypto.randomUUID();
        }

        private logStateTransition(event: PaymentEvent): void {
            // Implementation would depend on your logging/monitoring setup
            console.log(`Payment ${this.id} state transition: ${event.type}`);
        }

        private handleError(error: unknown): void {
            console.error(`Payment ${this.id} error:`, error);
        }
    }
}