class DatabaseConnectionManager {
    // Static property to hold our singleton instance
    static instance = null;

    constructor() {
        // Initialize connection as null when instance is created
        // Not returning null - just setting up an instance property!
        this._connection = null;
    }

    static async getInstance() {
        // 'this' in static method refers to the class itself
        // First call: this.instance is null, so we create instance
        // Later calls: this.instance exists, so we return same instance
        if (!this.instance) {
            // Create the only instance we'll ever have
            this.instance = new DatabaseConnectionManager();
            // Initialize its connection (must use this.instance because init() is instance method)
            await this.instance.init();
        }
        
        // Always return the same instance
        return this.instance;
    }

    async init() {
        console.log("Connecting to database...");
        try {
            // 'this' refers to instance here, updating its _connection property
            this._connection = await this.simulateDbConnection();
            console.log('Connected:', this._connection);
        } catch (error) {
            console.error("Connection failed:", error.message);
            this._connection = null;
        }
    }

    // Simulated database connection
    simulateDbConnection() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 'connected', timestamp: new Date() });
            }, 1000);
        });
    }

    // Instance method to get connection
    getConnection() {
        // 'this' refers to instance, returning its _connection
        return this._connection;
    }

    // Instance method to close connection
    closeConnection() {
        console.log('Closing connection...');
        // 'this' refers to instance, clearing its _connection
        this._connection = null;
    }
}

// Demo usage:
(async () => {
    // First call - creates new instance
    const db1 = await DatabaseConnectionManager.getInstance();
    console.log('First instance connection:', db1.getConnection());

    // Second call - returns SAME instance
    const db2 = await DatabaseConnectionManager.getInstance();
    console.log('Second instance connection:', db2.getConnection());

    // Prove they're the same instance
    console.log('Same instance?', db1 === db2);  // true

    db1.closeConnection();
    // Both db1 and db2 are affected because they're the same instance
    console.log('Both connections after closing:', db1.getConnection(), db2.getConnection());
})();