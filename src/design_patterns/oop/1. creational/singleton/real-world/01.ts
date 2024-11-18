/*
Real-World Scenario: Database Connection Manager
In a real-world application, there might be a need for a Database Connection Manager to handle interactions with a database. You wouldn't want to create multiple instances of this manager because managing connections across multiple instances could lead to inefficiencies, resource leaks, or conflicts.

We’ll create a DatabaseConnectionManager class using the Singleton Pattern to ensure only one instance of the connection manager is created, no matter how many times we attempt to access it.

Full Example: Database Connection Manager Using Singleton Pattern
Step-by-step approach:
Ensure only one instance: We ensure that the class can be instantiated only once and that subsequent requests return the same instance.
Global point of access: We provide a static method to get the instance of the class.
Lazy initialization: The instance is created only when it’s needed, reducing unnecessary resource usage.
*/

// ==========================
// Singleton Class for Database Connection
// ==========================
class DatabaseConnectionManager {
    // Holds the single instance of the class
    private static instance: DatabaseConnectionManager;

    // Simulating a database connection
    private connection: string;

    // Private constructor to prevent direct instantiation
    private constructor() {
        this.connection = "Database Connection Established!";
    }

    // Static method to access the single instance of the class
    public static getInstance(): DatabaseConnectionManager {
        // Lazy initialization of the instance
        if (!DatabaseConnectionManager.instance) {
            DatabaseConnectionManager.instance = new DatabaseConnectionManager();
        }
        return DatabaseConnectionManager.instance;
    }

    // Example method that simulates using the database connection
    public queryDatabase(query: string): string {
        return `Executing query: ${query}`;
    }

    // Optional method to simulate closing the connection
    public closeConnection(): string {
        this.connection = "Connection Closed";
        return this.connection;
    }
}

// ==========================
// Usage Example
// ==========================
const dbConnection1 = DatabaseConnectionManager.getInstance();
console.log(dbConnection1.queryDatabase("SELECT * FROM users"));

const dbConnection2 = DatabaseConnectionManager.getInstance();
console.log(dbConnection2.queryDatabase("SELECT * FROM orders"));

// Verifying that both instances are the same
console.log("Are both connections the same instance? ", dbConnection1 === dbConnection2);  // Should print: true

// Demonstrating closing the connection
console.log(dbConnection1.closeConnection());  // Connection Closed


/*

Breakdown of the Concepts:
Ensure Only One Instance (Lazy Initialization):

The DatabaseConnectionManager class uses a static private field instance to hold the singleton instance. It’s initialized lazily in the getInstance() method — only when needed, which saves resources.
The constructor is private to prevent the direct creation of new instances via new.
Global Point of Access:

The getInstance() method acts as the global point of access to the single instance of the class. It returns the same instance every time it is called.
Simulate Database Operations:

The class simulates database interaction with methods like queryDatabase and closeConnection. This pattern ensures that database connection management remains centralized and consistent.
Enforce Single Instance:

When trying to get a second instance (dbConnection2), the system doesn't create a new instance but returns the same dbConnection1. You can check the equality of instances with dbConnection1 === dbConnection2, which will return true.
Real-World Use Cases for Singleton Pattern:
Logging Systems:

A logging system is often a singleton because you don’t want multiple instances of loggers running simultaneously, which could cause inconsistencies in logs or performance issues.
Configuration Management:

A configuration manager that holds global configuration values (e.g., API URLs, feature flags) could be a singleton. You only need one configuration object, and creating multiple could lead to synchronization problems.
Caching:

Cache management is another area where a singleton pattern is useful. You don’t want to maintain separate caches, as it would lead to stale data across different instances.
Thread Pool / Database Connection Pool:

Managing thread pools or database connection pools in a multi-threaded application is another area where the singleton pattern is useful. Ensuring that the pool is managed centrally prevents resource exhaustion.
Conclusion:
This DatabaseConnectionManager example demonstrates a Singleton Pattern that ensures only one instance of the connection manager exists throughout the application lifecycle. We use lazy initialization and static methods to control instance creation and provide a global point of access.

This pattern can be applied to other real-world scenarios, like logging, caching, configuration management, and thread/database connection pooling, where a single, shared resource is needed.

*/