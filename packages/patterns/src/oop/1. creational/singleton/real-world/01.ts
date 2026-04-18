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
  private static instance: DatabaseConnectionManager | null = null;
  private static initializationPromise: Promise<DatabaseConnectionManager> | null =
    null;
  private connection: string;
  private connectionState: 'initializing' | 'connected' | 'failed' | 'closed';

  private constructor() {
    this.connection = 'Database connection is being established';
    this.connectionState = 'initializing';
  }

  public static async getInstance(): Promise<DatabaseConnectionManager> {
    /**
     * What if two users are connection or invoking getInstance at the same time when this class has no instance previously ?
     * What happens in code:
     * First Call to getInstance():
     * DatabaseConnectionManager.instance is null.
     * DatabaseConnectionManager.initializationPromise is also null.
     * The code enters the if (!DatabaseConnectionManager.instance) block, and checks if (!DatabaseConnectionManager.initializationPromise).
     * Since initializationPromise is null, it creates a new initialization promise and immediately starts initializing the connection (using the initializeConnection() method).
     * The promise is set in DatabaseConnectionManager.initializationPromise, which is shared by all future calls.
     * Second Call to getInstance() (while the first user is initializing):

     * DatabaseConnectionManager.instance is still null, so it enters the same block again.
     However, this time, initializationPromise is not null because the first call already created it.
     The second user will wait for initializationPromise to resolve.
     No new connection is initialized because the second user is simply waiting for the promise from the first call to resolve.
     Once the First Call Completes:

     The first user's promise resolves, and the singleton instance (DatabaseConnectionManager.instance) is set.
     Now, when the second user’s call to getInstance() finishes waiting, it can return the same singleton instance (DatabaseConnectionManager.instance).
     Final Outcome:
     Only one database connection initialization happens, regardless of how many users call getInstance() at the same time.
     All calls after the first successful initialization will return the same singleton instance, which is already initialized.

     * # How does it achieve concurrency or more like how does redundant async connection is avoided below ?

     Assume, there are 2 users who requested for getInstance() at the same while no prior instance of the singleton class exist, so what happens ?

     #### First User:
     The first user's getInstance() starts and initializes the initializationPromise.
     This promise is pending while the connection setup happens asynchronously.
     Second User:


     When the second user calls getInstance(), the initializationPromise is no longer null (it's now a pending promise, like Promise<{Pending<DatabaseConnectionManager>}>).
     Since the promise is already pending, the second user skips the inner if block and does not create a new promise.

     #### Second User Waits:

     The second user waits for the existing pending promise (via await), instead of starting a new one.
     Once the first user's promise resolves (i.e., when the database connection is established), both users receive the same singleton instance.
     */
    if (DatabaseConnectionManager.instance) {
      return DatabaseConnectionManager.instance;
    }

    // Guard against race conditions during initialization
    if (!DatabaseConnectionManager.initializationPromise) {
      DatabaseConnectionManager.initializationPromise = (async () => {
        const instance = new DatabaseConnectionManager();
        try {
          await instance.initializeConnection();
          return instance;
        } catch (error) {
          throw new Error(
            'Database connection failed: ' + (error as Error).message
          );
        }
      })();
    }

    // Wait for the initialization to complete and assign the instance
    DatabaseConnectionManager.instance =
      await DatabaseConnectionManager.initializationPromise;
    return DatabaseConnectionManager.instance;
  }

  private async initializeConnection(): Promise<void> {
    try {
      // Simulate async database connection
      await new Promise((resolve, _reject) => {
        setTimeout(() => {
          this.connection = 'Database has successfully connected';
          this.connectionState = 'connected';
          resolve(null);
        }, 1000);
      });
    } catch (error) {
      this.connectionState = 'failed';
      throw new Error('Failed to establish database connection.');
    }
  }

  // Example method that simulates using the database connection
  public queryDatabase(query: string): string {
    return `Executing query: ${query}`;
  }

  public closeConnection(): string {
    if (this.connectionState === 'connected') {
      this.connection = 'Connection Closed';
      this.connectionState = 'closed';
    }
    return this.connection;
  }
}

// ==========================
// Helper Functions
// ==========================

/**
 * Query the database with a specific query string.
 * @param query - The SQL query string to execute.
 */
async function queryDatabase(query: string): Promise<void> {
  try {
    const dbConnection = await DatabaseConnectionManager.getInstance();
    console.log(dbConnection.queryDatabase(query));
  } catch (error) {
    console.error('Error querying the database:', error);
  }
}

// Now, here are different ways to consume/use this singleton

/**
 * Close the database connection gracefully.
 */
async function closeDatabaseConnection(): Promise<void> {
  try {
    const dbConnection = await DatabaseConnectionManager.getInstance();
    console.log(dbConnection.closeConnection());
  } catch (error) {
    console.error('Error closing the database connection:', error);
  }
}

// ==========================
// Main Entry Point
// ==========================
(async () => {
  console.log('Starting the application...');

  // Querying the database
  await queryDatabase('SELECT * FROM users');
  await queryDatabase('SELECT * FROM orders');

  // Closing the database connection
  await closeDatabaseConnection();

  console.log('Application execution complete.');
})();

// 1. Service Layer Abstraction:

// ==========================
// Abstracted Consumer Module
// ==========================

/**
 * DatabaseService - Abstracts the logic for querying and closing connections.
 */
// export const DatabaseService = {
//   /**
//    * Executes a query on the database.
//    * @param query - The SQL query string to execute.
//    * @returns The result of the query execution.
//    */
//   async executeQuery(query: string): Promise<string> {
//     const dbConnection = await DatabaseConnectionManager.getInstance();
//     return dbConnection.queryDatabase(query);
//   },

//   /**
//    * Closes the database connection gracefully.
//    * @returns Confirmation message.
//    */
//   async closeConnection(): Promise<string> {
//     const dbConnection = await DatabaseConnectionManager.getInstance();
//     return dbConnection.closeConnection();
//   },
// };

// ==========================
// Consumer Logic
// ==========================

// import { DatabaseService } from './DatabaseService';

// async function runDatabaseOperations() {
//   try {
//     console.log(await DatabaseService.executeQuery('SELECT * FROM users'));
//     console.log(await DatabaseService.executeQuery('SELECT * FROM orders'));
//   } catch (error) {
//     console.error('Error while performing database operations:', error);
//   } finally {
//     const message = await DatabaseService.closeConnection();
//     console.log(message); // Ensure resources are freed
//   }
// }

// // Example Execution
// runDatabaseOperations();

// 2. service wrapper with dependency injection

// ==========================
// Dependency Injection Wrapper
// ==========================
type QueryFunction = (query: string) => Promise<string>;
type CloseFunction = () => Promise<string>;

class DatabaseService {
  private query: QueryFunction;
  private close: CloseFunction;

  constructor(query: QueryFunction, close: CloseFunction) {
    this.query = query;
    this.close = close;
  }

  async executeQuery(query: string): Promise<string> {
    return this.query(query);
  }

  async closeConnection(): Promise<string> {
    return this.close();
  }
}

// ==========================
// Factory Function for Singleton Consumption
// ==========================
async function createDatabaseService(): Promise<DatabaseService> {
  const dbConnection = await DatabaseConnectionManager.getInstance();

  // Inject dependency methods from the singleton instance
  return new DatabaseService(
    async (query: string) => dbConnection.queryDatabase(query),
    async () => dbConnection.closeConnection()
  );
}

// ==========================
// Consumer Code
// ==========================
async function runDatabaseOperations() {
  const dbService = await createDatabaseService();

  try {
    console.log(await dbService.executeQuery('SELECT * FROM users'));
    console.log(await dbService.executeQuery('SELECT * FROM orders'));
  } catch (error) {
    console.error('Error while performing database operations:', error);
  } finally {
    const message = await dbService.closeConnection();
    console.log(message); // Ensure resources are freed
  }
}

// Example mocks for testing
const mockDatabaseService = new DatabaseService(
  async (query: string) => `Mocked query execution for: ${query}`,
  async () => 'Mocked connection closed'
);

// Test code:
(async () => {
  console.log(await mockDatabaseService.executeQuery('SELECT * FROM test'));
  console.log(await mockDatabaseService.closeConnection());
})();

// Example Execution
runDatabaseOperations().then(r => console.log(r));

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
