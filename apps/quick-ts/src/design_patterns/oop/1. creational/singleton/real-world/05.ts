// 4. Thread Pool / Database Connection Pool Singleton
// In multithreaded or multi-process applications, managing thread pools or database connections efficiently is critical.
// A singleton ensures only one connection pool or thread pool is created, reducing resource contention and improving efficiency.

class DatabaseConnectionPool {
  // Singleton instance, ensuring only one instance is created
  private static instance: DatabaseConnectionPool | null = null;

  // Promise used for async initialization of the instance
  private static initializationPromise: Promise<DatabaseConnectionPool> | null =
    null;

  // Using readonly for immutability where appropriate
  private readonly connections: string[] = [];
  private readonly availableConnections: string[] = [];
  private isInitializing = false;

  // Private constructor ensures no external instantiation
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  // Singleton getter with thread-safety for async initialization
  public static async getInstance(): Promise<DatabaseConnectionPool> {
    if (DatabaseConnectionPool.instance) {
      return DatabaseConnectionPool.instance;
    }

    // If an instance is not created, initialize it asynchronously with a lock (to avoid race conditions)
    if (!DatabaseConnectionPool.initializationPromise) {
      DatabaseConnectionPool.initializationPromise = (async () => {
        const instance = new DatabaseConnectionPool();
        try {
          await instance.initializeConnections(); // Initialize connections asynchronously
          return instance;
        } catch (error) {
          console.error('Error initializing DatabaseConnectionPool:', error);
          throw new Error('DatabaseConnectionPool initialization failed.');
        }
      })();
    }

    // Wait for the initialization process to complete
    DatabaseConnectionPool.instance =
      await DatabaseConnectionPool.initializationPromise;
    return DatabaseConnectionPool.instance;
  }

  // Private method to simulate async database connection initialization
  private async initializeConnections(): Promise<void> {
    if (this.isInitializing) return; // Prevent concurrent initializations
    this.isInitializing = true;

    try {
      // Simulate a network or DB call that takes time (1 second)
      await new Promise<void>(resolve => {
        setTimeout(() => {
          console.log('Database connections initialized');
          this.connections.push('DB_Connection_1', 'DB_Connection_2');
          this.availableConnections.push(...this.connections);
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.error('Error during connection pool initialization:', error);
      throw new Error('Failed to initialize database connections.');
    } finally {
      this.isInitializing = false;
    }
  }

  // Method to safely retrieve a connection from the pool
  public async getConnection(): Promise<string> {
    if (this.availableConnections.length === 0) {
      console.log('Waiting for available connection...');
      // Initialize connections if not already done
      await this.initializeConnections();
    }

    const connection = this.availableConnections.pop();
    return connection || 'No available connections';
  }

  // Method to release a connection back to the pool
  public releaseConnection(connection: string): void {
    if (connection) {
      this.availableConnections.push(connection);
    }
  }
}

// Usage example
(async () => {
  const pool1 = await DatabaseConnectionPool.getInstance();
  console.log(await pool1.getConnection()); // DB_Connection_2

  const pool2 = await DatabaseConnectionPool.getInstance();
  console.log(await pool2.getConnection()); // DB_Connection_1

  console.log('Are both pool instances the same?', pool1 === pool2); // true

  pool1.releaseConnection('DB_Connection_1');
  console.log(await pool2.getConnection()); // DB_Connection_1
})();

// Explanation:
// DatabaseConnectionPool Class: This singleton simulates a database connection pool with a limited number of connections.
// Methods: getConnection() retrieves an available connection, and releaseConnection() returns a connection to the pool. The singleton ensures only one pool instance manages all connections.
