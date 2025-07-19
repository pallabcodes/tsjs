"use strict";
// 4. Thread Pool / Database Connection Pool Singleton
// In multithreaded or multi-process applications, managing thread pools or database connections efficiently is critical.
// A singleton ensures only one connection pool or thread pool is created, reducing resource contention and improving efficiency.
class DatabaseConnectionPool {
    // Singleton instance, ensuring only one instance is created
    static { this.instance = null; }
    // Promise used for async initialization of the instance
    static { this.initializationPromise = null; }
    // Private constructor ensures no external instantiation
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
        // Using readonly for immutability where appropriate
        this.connections = [];
        this.availableConnections = [];
        this.isInitializing = false;
    }
    // Singleton getter with thread-safety for async initialization
    static async getInstance() {
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
                }
                catch (error) {
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
    async initializeConnections() {
        if (this.isInitializing)
            return; // Prevent concurrent initializations
        this.isInitializing = true;
        try {
            // Simulate a network or DB call that takes time (1 second)
            await new Promise(resolve => {
                setTimeout(() => {
                    console.log('Database connections initialized');
                    this.connections.push('DB_Connection_1', 'DB_Connection_2');
                    this.availableConnections.push(...this.connections);
                    resolve();
                }, 1000);
            });
        }
        catch (error) {
            console.error('Error during connection pool initialization:', error);
            throw new Error('Failed to initialize database connections.');
        }
        finally {
            this.isInitializing = false;
        }
    }
    // Method to safely retrieve a connection from the pool
    async getConnection() {
        if (this.availableConnections.length === 0) {
            console.log('Waiting for available connection...');
            // Initialize connections if not already done
            await this.initializeConnections();
        }
        const connection = this.availableConnections.pop();
        return connection || 'No available connections';
    }
    // Method to release a connection back to the pool
    releaseConnection(connection) {
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
//# sourceMappingURL=05.js.map