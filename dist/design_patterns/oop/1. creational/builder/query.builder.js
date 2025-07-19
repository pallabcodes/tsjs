"use strict";
// BUILDER PATTERN
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionPool = exports.ServerConfig = exports.PaymentProcessorFactory = void 0;
// Real-world example: Query Builder in ORMs like Prisma/TypeORM
class QueryBuilder {
    constructor() {
        this.query = {
            select: ['*'],
            from: '',
            where: [],
            orderBy: [],
            limit: null,
        };
    }
    from(table) {
        this.query.from = table;
        return this;
    }
    select(fields) {
        this.query.select = fields;
        return this;
    }
    where(condition) {
        this.query.where.push(condition);
        return this;
    }
    orderBy(field, direction) {
        this.query.orderBy.push({ field, direction });
        return this;
    }
    limit(count) {
        this.query.limit = count;
        return this;
    }
    build() {
        if (!this.query.from) {
            throw new Error('FROM clause is required');
        }
        let query = `SELECT ${this.query.select.join(', ')} FROM ${this.query.from}`;
        if (this.query.where.length) {
            query += ` WHERE ${this.query.where.join(' AND ')}`;
        }
        if (this.query.orderBy.length) {
            const orderClauses = this.query.orderBy
                .map(({ field, direction }) => `${field} ${direction}`)
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
console.log(query);
// Stripe payment processor implementation
class StripeProcessor {
    async processPayment(amount) {
        console.log(`Processing payment of $${amount} with Stripe`);
        return true;
    }
    async refundPayment(transactionId) {
        console.log(`Refunding transaction ${transactionId} with Stripe`);
        return true;
    }
}
// PayPal payment processor implementation
class PayPalProcessor {
    async processPayment(amount) {
        console.log(`Processing payment of $${amount} with PayPal`);
        return true;
    }
    async refundPayment(transactionId) {
        console.log(`Refunding transaction ${transactionId} with PayPal`);
        return true;
    }
}
// Factory class for creating payment processors
class PaymentProcessorFactory {
    static createProcessor(type) {
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
exports.PaymentProcessorFactory = PaymentProcessorFactory;
// Configuration for the server, which can be cloned
class ServerConfig {
    constructor(host, port, database, cache) {
        this.host = host;
        this.port = port;
        this.database = database;
        this.cache = cache;
    }
    clone() {
        return new ServerConfig(this.host, this.port, this.database.clone(), this.cache.clone());
    }
}
exports.ServerConfig = ServerConfig;
// Assuming DatabaseConfig and CacheConfig are also cloneable
class DatabaseConfig {
    constructor(dbName) {
        this.dbName = dbName;
    }
    clone() {
        return new DatabaseConfig(this.dbName);
    }
}
class CacheConfig {
    constructor(cacheSize) {
        this.cacheSize = cacheSize;
    }
    clone() {
        return new CacheConfig(this.cacheSize);
    }
}
// OBJECT POOL PATTERN
// Real-world example: Database Connection Pool
// Represents a database connection
class DatabaseConnection {
    static async create() {
        return new DatabaseConnection();
    }
}
class DatabaseConnectionPool {
    constructor(maxConnections = 10) {
        this.connections = [];
        this.inUse = new Set();
        this.maxConnections = maxConnections;
    }
    // Acquire a connection from the pool
    async acquire(timeoutMs = 5000) {
        const availableConnection = this.connections.find(conn => !this.inUse.has(conn));
        if (availableConnection) {
            this.inUse.add(availableConnection);
            return availableConnection;
        }
        if (this.connections.length < this.maxConnections) {
            const newConnection = await DatabaseConnection.create();
            this.connections.push(newConnection);
            this.inUse.add(newConnection);
            return newConnection;
        }
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                const conn = this.connections.find(c => !this.inUse.has(c));
                if (conn) {
                    clearInterval(checkInterval);
                    this.inUse.add(conn);
                    resolve(conn);
                }
                if (Date.now() - startTime > timeoutMs) {
                    clearInterval(checkInterval);
                    reject(new Error('Connection acquisition timeout'));
                }
            }, 100);
        });
    }
    // Release a connection back to the pool
    release(connection) {
        this.inUse.delete(connection);
    }
}
exports.DatabaseConnectionPool = DatabaseConnectionPool;
//# sourceMappingURL=query.builder.js.map