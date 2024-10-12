// WHEN: The Object Pool Pattern is used when you need to manage a set of reusable objects rather than creating and destroying them repeatedly. A common use case is in managing database connections.

// DatabaseConnection class represents a single connection to a database
class DatabaseConnection {
  public connect(): void {
    console.log('Connected to the database.');
  }

  public disconnect(): void {
    console.log('Disconnected from the database.');
  }
}

// ConnectionPool class manages a pool of reusable DatabaseConnection objects
class ConnectionPool {
  private pool: DatabaseConnection[] = [];
  private readonly maxConnections: number;

  constructor(maxConnections: number) {
    this.maxConnections = maxConnections;
  }

  // Acquire a connection from the pool
  public acquire(): DatabaseConnection {
    if (this.pool.length > 0) {
      // Reuse an existing connection
      return this.pool.pop()!;
    }
    // If no connections are available, create a new one if within the limit
    if (this.pool.length < this.maxConnections) {
      const connection = new DatabaseConnection();
      connection.connect();
      return connection;
    }
    throw new Error('No available connections.');
  }

  // Release a connection back to the pool
  public release(connection: DatabaseConnection): void {
    connection.disconnect();
    this.pool.push(connection);
  }
}

// Usage example
const connectionPool = new ConnectionPool(2);

// Acquire connections
const connection1 = connectionPool.acquire(); // Connects to the database
const connection2 = connectionPool.acquire(); // Connects to the database

// Release one connection back to the pool
connectionPool.release(connection1);

// Acquire a new connection; it reuses the released connection
const connection3 = connectionPool.acquire(); // Reuses connection1

// Cleanup: release remaining connections
connectionPool.release(connection2);
connectionPool.release(connection3);
