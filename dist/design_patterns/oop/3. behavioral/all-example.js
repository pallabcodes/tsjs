"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataExporter = exports.ChatMediator = exports.RequestHandler = exports.TextEditor = exports.AnalyticsSubject = exports.PayPalStrategy = void 0;
class Order {
    constructor(orderData) {
        this.state = new PendingState();
        this.orderData = orderData;
    }
    setState(state) {
        this.state = state;
    }
    proceedToNext() {
        this.state.proceedToNext(this);
    }
    cancel() {
        this.state.cancel(this);
    }
    getStatus() {
        return this.state.getStatus();
    }
}
class PendingState {
    proceedToNext(order) {
        order.setState(new ProcessingState());
    }
    cancel(order) {
        order.setState(new CancelledState());
    }
    getStatus() {
        return 'PENDING';
    }
}
class ProcessingState {
    proceedToNext(order) {
        order.setState(new CompletedState());
    }
    cancel(order) {
        order.setState(new CancelledState());
    }
    getStatus() {
        return 'PROCESSING';
    }
}
class CompletedState {
    proceedToNext(_order) {
        // Cannot proceed from completed state
    }
    cancel(_order) {
        // Cannot cancel completed order
    }
    getStatus() {
        return 'COMPLETED';
    }
}
class CancelledState {
    proceedToNext(_order) {
        // Cannot proceed from cancelled state
    }
    cancel(_order) {
        // Already cancelled
    }
    getStatus() {
        return 'CANCELLED';
    }
}
class PayPalStrategy {
    async pay(_amount) {
        // PayPal-specific implementation
        return true;
    }
    async refund(_transactionId) {
        // PayPal-specific refund logic
        return true;
    }
}
exports.PayPalStrategy = PayPalStrategy;
class AnalyticsSubject {
    constructor() {
        this.observers = [];
    }
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }
    notify(data) {
        for (const observer of this.observers) {
            observer.update(data);
        }
    }
}
exports.AnalyticsSubject = AnalyticsSubject;
class TextEditor {
    constructor() {
        this.content = '';
        this.commandHistory = [];
        this.undoneCommands = [];
    }
    executeCommand(command) {
        command.execute();
        this.commandHistory.push(command);
        this.undoneCommands = []; // Clear redo stack
    }
    undo() {
        const command = this.commandHistory.pop();
        if (command) {
            command.undo();
            this.undoneCommands.push(command);
        }
    }
    redo() {
        const command = this.undoneCommands.pop();
        if (command) {
            command.execute();
            this.commandHistory.push(command);
        }
    }
}
exports.TextEditor = TextEditor;
// CHAIN OF RESPONSIBILITY
// Real-world example: Request Authentication & Authorization
class RequestHandler {
    constructor() {
        this.nextHandler = null;
    }
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    async handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return new Response('Request processed');
    }
}
exports.RequestHandler = RequestHandler;
// MEDIATOR PATTERN
// Real-world example: Chat Room
class ChatMediator {
    constructor() {
        this.users = new Map();
    }
    addUser(user) {
        this.users.set(user.getName(), user);
    }
    sendMessage(message, from, to) {
        if (to) {
            // Private message
            const recipient = this.users.get(to);
            if (recipient) {
                recipient.receive(message, from);
            }
        }
        else {
            // Broadcast
            this.users.forEach(user => {
                if (user.getName() !== from) {
                    user.receive(message, from);
                }
            });
        }
    }
}
exports.ChatMediator = ChatMediator;
// TEMPLATE PATTERN
// Real-world example: Data Export Process
class DataExporter {
    // Template method
    async export() {
        const data = await this.fetchData();
        const transformed = this.transformData(data);
        await this.validateData(transformed);
        await this.saveData(transformed);
        this.notifyCompletion();
    }
    notifyCompletion() {
        console.log('Export completed');
    }
}
exports.DataExporter = DataExporter;
class ASTNode {
}
class BinaryExpression extends ASTNode {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        visitor.visitBinaryExpression(this);
    }
}
class NumericLiteral extends ASTNode {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        visitor.visitNumericLiteral(this);
    }
}
class Identifier extends ASTNode {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        visitor.visitIdentifier(this);
    }
}
//# sourceMappingURL=all-example.js.map