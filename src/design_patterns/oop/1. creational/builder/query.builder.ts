// BUILDER PATTERN

// Real-world example: Query Builder in ORMs like Prisma/TypeORM
class QueryBuilder {
  private query: {
    select: string[];
    from: string;
    where: string[];
    orderBy: Array<{ field: string; direction: 'ASC' | 'DESC' }>;
    limit: number | null;
  } = {
    select: ['*'],
    from: '',
    where: [],
    orderBy: [],
    limit: null,
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
    if (!this.query.from) {
      throw new Error('FROM clause is required');
    }

    let query = `SELECT ${this.query.select.join(', ')} FROM ${
      this.query.from
    }`;

    if (this.query.where.length) {
      query += ` WHERE ${this.query.where.join(' AND ')}`;
    }

    if (this.query.orderBy.length) {
      const orderClauses = this.query.orderBy
        .map(({ field, direction }: any) => `${field} ${direction}`)
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

// FACTORY PATTERN
// Real-world example: Payment Gateway Integration

// Interface for payment processor classes
interface PaymentProcessor {
  processPayment(amount: number): Promise<boolean>;
  refundPayment(transactionId: string): Promise<boolean>;
}

// Stripe payment processor implementation
class StripeProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing payment of $${amount} with Stripe`);
    return true;
  }

  async refundPayment(transactionId: string): Promise<boolean> {
    console.log(`Refunding transaction ${transactionId} with Stripe`);
    return true;
  }
}

// PayPal payment processor implementation
class PayPalProcessor implements PaymentProcessor {
  async processPayment(amount: number): Promise<boolean> {
    console.log(`Processing payment of $${amount} with PayPal`);
    return true;
  }

  async refundPayment(transactionId: string): Promise<boolean> {
    console.log(`Refunding transaction ${transactionId} with PayPal`);
    return true;
  }
}

// Factory class for creating payment processors
export class PaymentProcessorFactory {
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

// Cloneable interface to ensure the clone method is implemented
interface Cloneable {
  clone(): this;
}

// Configuration for the server, which can be cloned
export class ServerConfig implements Cloneable {
  constructor(
    public host: string,
    public port: number,
    public database: DatabaseConfig,
    public cache: CacheConfig
  ) {}

  clone(): this {
    return new ServerConfig(
      this.host,
      this.port,
      this.database.clone(),
      this.cache.clone()
    ) as this;
  }
}

// Assuming DatabaseConfig and CacheConfig are also cloneable
class DatabaseConfig implements Cloneable {
  constructor(public dbName: string) {}

  clone(): this {
    return new DatabaseConfig(this.dbName) as this;
  }
}

class CacheConfig implements Cloneable {
  constructor(public cacheSize: number) {}

  clone(): this {
    return new CacheConfig(this.cacheSize) as this;
  }
}

// OBJECT POOL PATTERN
// Real-world example: Database Connection Pool

// Represents a database connection
class DatabaseConnection {
  static async create(): Promise<DatabaseConnection> {
    return new DatabaseConnection();
  }
}

export class DatabaseConnectionPool {
  private connections: DatabaseConnection[] = [];
  private inUse: Set<DatabaseConnection> = new Set();
  private readonly maxConnections: number;

  constructor(maxConnections = 10) {
    this.maxConnections = maxConnections;
  }

  // Acquire a connection from the pool
  async acquire(timeoutMs = 5000): Promise<DatabaseConnection> {
    const availableConnection = this.connections.find(
      conn => !this.inUse.has(conn)
    );

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
  release(connection: DatabaseConnection): void {
    this.inUse.delete(connection);
  }
}
