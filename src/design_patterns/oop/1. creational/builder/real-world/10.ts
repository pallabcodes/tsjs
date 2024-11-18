// Avoiding Constructor Overloading

class DatabaseConnection {
    constructor(
        public host: string,
        public port: number,
        public username: string,
        public password: string,
        public database: string
    ) {}
}

interface DatabaseConnectionBuilder {
    setHost(host: string): this;
    setPort(port: number): this;
    setUsername(username: string): this;
    setPassword(password: string): this;
    setDatabase(database: string): this;
    build(): DatabaseConnection;
}

class DatabaseConnectionBuilderImpl implements DatabaseConnectionBuilder {
    private host: string = "localhost";
    private port: number = 3306;
    private username: string = "root";
    private password: string = "";
    private database: string = "test";

    setHost(host: string): this {
        this.host = host;
        return this;
    }
    setPort(port: number): this {
        this.port = port;
        return this;
    }
    setUsername(username: string): this {
        this.username = username;
        return this;
    }
    setPassword(password: string): this {
        this.password = password;
        return this;
    }
    setDatabase(database: string): this {
        this.database = database;
        return this;
    }
    build(): DatabaseConnection {
        return new DatabaseConnection(this.host, this.port, this.username, this.password, this.database);
    }
}

// Usage
const dbConnection = new DatabaseConnectionBuilderImpl()
    .setHost("192.168.1.1")
    .setPort(5432)
    .setUsername("admin")
    .setPassword("secret")
    .setDatabase("production")
    .build();
console.log(dbConnection);
