// 4. Thread Pool / Database Connection Pool Singleton
// In multi-threaded or multi-process applications, managing thread pools or database connections efficiently is critical. A singleton ensures only one connection pool or thread pool is created, reducing resource contention and improving efficiency.


class DatabaseConnectionPool {
    private static instance: DatabaseConnectionPool;
    private connections: string[] = [];

    private constructor() {
        // Simulate the creation of database connections
        this.connections.push("DB_Connection_1");
        this.connections.push("DB_Connection_2");
    }

    public static getInstance(): DatabaseConnectionPool {
        if (!DatabaseConnectionPool.instance) {
            DatabaseConnectionPool.instance = new DatabaseConnectionPool();
        }
        return DatabaseConnectionPool.instance;
    }

    public getConnection(): string {
        // Return the first available connection
        return this.connections.pop() || "No available connections";
    }

    public releaseConnection(connection: string): void {
        this.connections.push(connection);
    }
}

// Usage
const pool1 = DatabaseConnectionPool.getInstance();
console.log(pool1.getConnection()); // DB_Connection_2

const pool2 = DatabaseConnectionPool.getInstance();
console.log(pool2.getConnection()); // DB_Connection_1

console.log("Are both connection pool instances the same?", pool1 === pool2); // true

pool1.releaseConnection("DB_Connection_1");
console.log(pool2.getConnection()); // DB_Connection_1

// Explanation:
// DatabaseConnectionPool Class: This singleton simulates a database connection pool with a limited number of connections.
// Methods: getConnection() retrieves an available connection, and releaseConnection() returns a connection to the pool. The singleton ensures only one pool instance manages all connections.