// 4. Thread Pool / Database Connection Pool Singleton
// In multi-threaded or multi-process applications, managing thread pools or database connections efficiently is critical. A singleton ensures only one connection pool or thread pool is created, reducing resource contention and improving efficiency.

class DatabaseConnectionPool {
  private static instance: DatabaseConnectionPool | null = null;
  private static initializationPromise: Promise<DatabaseConnectionPool> | null = null;

  private connections: string[] = [];
  private availableConnections: string[] = [];
  private isInitializing: boolean = false;

  private constructor() {
    // Simulate async database connection initialization
    this.initializeConnections();
  }

  public static async getInstance(): Promise<DatabaseConnectionPool> {
    if (DatabaseConnectionPool.instance) {
      return DatabaseConnectionPool.instance;
    }

    // Initialize the singleton instance asynchronously
    if (!DatabaseConnectionPool.initializationPromise) {
      DatabaseConnectionPool.initializationPromise = (async () => {
        const instance = new DatabaseConnectionPool();
        try {
          await instance.initializeConnections(); // Simulate async connection setup
          return instance;
        } catch (error) {
          console.error('Error initializing DatabaseConnectionPool:', error);
          throw new Error('DatabaseConnectionPool initialization failed.');
        }
      })();
    }

    // Wait for the initialization process to finish
    DatabaseConnectionPool.instance = await DatabaseConnectionPool.initializationPromise;
    return DatabaseConnectionPool.instance;
  }

  private async initializeConnections(): Promise<void> {
    // Simulate async connection creation
    if (this.isInitializing) return;

    this.isInitializing = true;
    try {
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          console.log('Database connections initialized');
          this.connections.push('DB_Connection_1', 'DB_Connection_2');
          this.availableConnections.push(...this.connections);
          resolve();
        }, 1000); // Simulate 1 second for connection initialization
      });
    } catch (error) {
      console.error('Error during connection pool initialization:', error);
      throw new Error('Failed to initialize database connections.');
    } finally {
      this.isInitializing = false;
    }
  }

  public async getConnection(): Promise<string> {
    if (this.availableConnections.length === 0) {
      // Simulate waiting for a connection to become available
      console.log('Waiting for available connection...');
      await this.initializeConnections(); // Wait for connections to be initialized if not yet available
    }

    // Return the first available connection
    const connection = this.availableConnections.pop();
    return connection || 'No available connections';
  }

  public releaseConnection(connection: string): void {
    this.availableConnections.push(connection);
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
