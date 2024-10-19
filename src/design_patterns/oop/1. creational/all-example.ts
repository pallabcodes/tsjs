// BUILDER PATTERN

// Real-world example: Query Builder in ORMs like Prisma/TypeORM
class QueryBuilder {
    private query: any = {
        select: ['*'],
        from: '',
        where: [],
        orderBy: [],
        limit: null
    };

    from(table: string): QueryBuilder {
        this.query.from = table;
        return this;
    }

    select(fields: string[]): QueryBuilder {
        this.query.select = fields;
        return this;
    }

    where(condition: string): QueryBuilder {
        this.query.where.push(condition);
        return this;
    }

    orderBy(field: string, direction: 'ASC' | 'DESC'): QueryBuilder {
        this.query.orderBy.push({ field, direction });
        return this;
    }

    limit(count: number): QueryBuilder {
        this.query.limit = count;
        return this;
    }

    build(): string {
        // Build actual SQL query string
        let query = `SELECT ${this.query.select.join(', ')} FROM ${this.query.from}`;
        
        if (this.query.where.length) {
            query += ` WHERE ${this.query.where.join(' AND ')}`;
        }
        
        if (this.query.orderBy.length) {
            const orderClauses = this.query.orderBy
                .map(({field, direction}: any) => `${field} ${direction}`)
                .join(', ');
            query += ` ORDER BY ${orderClauses}`;
        }
        
        if (this.query.limit) {
            query += ` LIMIT ${this.query.limit}`;
        }
        
        return query;
    }
}

// Usage in product:
const query = new QueryBuilder()
    .select(['user_id', 'name', 'email'])
    .from('users')
    .where('status = "active"')
    .orderBy('created_at', 'DESC')
    .limit(10)
    .build();

// FACTORY PATTERN
// Real-world example: Payment Gateway Integration
interface PaymentProcessor {
    processPayment(amount: number): Promise<boolean>;
    refundPayment(transactionId: string): Promise<boolean>;
}

class StripeProcessor implements PaymentProcessor {
    async processPayment(amount: number): Promise<boolean> {
        // Stripe-specific implementation
        return true;
    }

    async refundPayment(transactionId: string): Promise<boolean> {
        // Stripe-specific refund logic
        return true;
    }
}

class PayPalProcessor implements PaymentProcessor {
    async processPayment(amount: number): Promise<boolean> {
        // PayPal-specific implementation
        return true;
    }

    async refundPayment(transactionId: string): Promise<boolean> {
        // PayPal-specific refund logic
        return true;
    }
}

// Factory
class PaymentProcessorFactory {
    static createProcessor(type: 'stripe' | 'paypal'): PaymentProcessor {
        switch (type) {
            case 'stripe':
                return new StripeProcessor();
            case 'paypal':
                return new PayPalProcessor();
            default:
                throw new Error('Unsupported payment processor');
        }
    }
}

// PROTOTYPE PATTERN
// Real-world example: Deep cloning complex configuration objects
class ServerConfig implements Cloneable {
    constructor(
        public host: string,
        public port: number,
        public database: DatabaseConfig,
        public cache: CacheConfig
    ) {}

    clone(): ServerConfig {
        return new ServerConfig(
            this.host,
            this.port,
            this.database.clone(),
            this.cache.clone()
        );
    }
}

// OBJECT POOL PATTERN
// Real-world example: Database Connection Pool
class DatabaseConnectionPool {
    private connections: DatabaseConnection[] = [];
    private inUse: Set<DatabaseConnection> = new Set();
    private readonly maxConnections: number;

    constructor(maxConnections: number = 10) {
        this.maxConnections = maxConnections;
    }

    async acquire(): Promise<DatabaseConnection> {
        // First try to find an available connection
        const availableConnection = this.connections.find(
            conn => !this.inUse.has(conn)
        );

        if (availableConnection) {
            this.inUse.add(availableConnection);
            return availableConnection;
        }

        // If no connection available and we can create more
        if (this.connections.length < this.maxConnections) {
            const newConnection = await DatabaseConnection.create();
            this.connections.push(newConnection);
            this.inUse.add(newConnection);
            return newConnection;
        }

        // Wait for a connection to become available
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const conn = this.connections.find(c => !this.inUse.has(c));
                if (conn) {
                    clearInterval(checkInterval);
                    this.inUse.add(conn);
                    resolve(conn);
                }
            }, 100);
        });
    }

    release(connection: DatabaseConnection): void {
        this.inUse.delete(connection);
    }
}