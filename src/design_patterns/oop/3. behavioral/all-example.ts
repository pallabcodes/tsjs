// STATE PATTERN
// Real-world example: Order Processing System
interface OrderState {
    proceedToNext(order: Order): void;
    cancel(order: Order): void;
    getStatus(): string;
}

class Order {
    private state: OrderState;
    public orderData: any;

    constructor(orderData: any) {
        this.state = new PendingState();
        this.orderData = orderData;
    }

    setState(state: OrderState): void {
        this.state = state;
    }

    proceedToNext(): void {
        this.state.proceedToNext(this);
    }

    cancel(): void {
        this.state.cancel(this);
    }

    getStatus(): string {
        return this.state.getStatus();
    }
}

// STRATEGY PATTERN
// Real-world example: Payment Processing
interface PaymentStrategy {
    pay(amount: number): Promise<boolean>;
    refund(transactionId: string): Promise<boolean>;
}

class StripeStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        // Stripe-specific implementation
        return true;
    }

    async refund(transactionId: string): Promise<boolean> {
        // Stripe-specific refund logic
        return true;
    }
}

class PayPalStrategy implements PaymentStrategy {
    async pay(amount: number): Promise<boolean> {
        // PayPal-specific implementation
        return true;
    }

    async refund(transactionId: string): Promise<boolean> {
        // PayPal-specific refund logic
        return true;
    }
}

// OBSERVER PATTERN
// Real-world example: Real-time Analytics Dashboard
interface AnalyticsObserver {
    update(data: any): void;
}

class AnalyticsSubject {
    private observers: AnalyticsObserver[] = [];
    
    attach(observer: AnalyticsObserver): void {
        this.observers.push(observer);
    }

    detach(observer: AnalyticsObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notify(data: any): void {
        for (const observer of this.observers) {
            observer.update(data);
        }
    }
}

// COMMAND PATTERN
// Real-world example: Undo/Redo in Text Editor
interface Command {
    execute(): void;
    undo(): void;
}

class TextEditor {
    private content: string = '';
    private commandHistory: Command[] = [];
    private undoneCommands: Command[] = [];

    executeCommand(command: Command): void {
        command.execute();
        this.commandHistory.push(command);
        this.undoneCommands = []; // Clear redo stack
    }

    undo(): void {
        const command = this.commandHistory.pop();
        if (command) {
            command.undo();
            this.undoneCommands.push(command);
        }
    }

    redo(): void {
        const command = this.undoneCommands.pop();
        if (command) {
            command.execute();
            this.commandHistory.push(command);
        }
    }
}

// CHAIN OF RESPONSIBILITY
// Real-world example: Request Authentication & Authorization
abstract class RequestHandler {
    private nextHandler: RequestHandler | null = null;

    setNext(handler: RequestHandler): RequestHandler {
        this.nextHandler = handler;
        return handler;
    }

    async handle(request: Request): Promise<Response> {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return new Response('Request processed');
    }
}

// MEDIATOR PATTERN
// Real-world example: Chat Room
class ChatMediator {
    private users: Map<string, ChatUser> = new Map();

    addUser(user: ChatUser): void {
        this.users.set(user.getName(), user);
    }

    sendMessage(message: string, from: string, to?: string): void {
        if (to) {
            // Private message
            const recipient = this.users.get(to);
            if (recipient) {
                recipient.receive(message, from);
            }
        } else {
            // Broadcast
            this.users.forEach((user) => {
                if (user.getName() !== from) {
                    user.receive(message, from);
                }
            });
        }
    }
}

// TEMPLATE PATTERN
// Real-world example: Data Export Process
abstract class DataExporter {
    // Template method
    async export(): Promise<void> {
        const data = await this.fetchData();
        const transformed = this.transformData(data);
        await this.validateData(transformed);
        await this.saveData(transformed);
        this.notifyCompletion();
    }

    protected abstract fetchData(): Promise<any>;
    protected abstract transformData(data: any): any;
    protected abstract validateData(data: any): Promise<void>;
    protected abstract saveData(data: any): Promise<void>;

    protected notifyCompletion(): void {
        console.log('Export completed');
    }
}

// VISITOR PATTERN
// Real-world example: AST (Abstract Syntax Tree) Processing
interface ASTVisitor {
    visitBinaryExpression(node: BinaryExpression): void;
    visitNumericLiteral(node: NumericLiteral): void;
    visitIdentifier(node: Identifier): void;
}

abstract class ASTNode {
    abstract accept(visitor: ASTVisitor): void;
}

class BinaryExpression extends ASTNode {
    constructor(
        public left: ASTNode,
        public operator: string,
        public right: ASTNode
    ) {
        super();
    }

    accept(visitor: ASTVisitor): void {
        visitor.visitBinaryExpression(this);
    }
}