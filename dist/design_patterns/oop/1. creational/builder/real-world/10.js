"use strict";
// Avoiding Constructor Overloading
class DatabaseConnection {
    constructor(host, port, username, password, database) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.database = database;
    }
}
class DatabaseConnectionBuilderImpl {
    constructor() {
        this.host = 'localhost';
        this.port = 3306;
        this.username = 'root';
        this.password = '';
        this.database = 'test';
    }
    setHost(host) {
        this.host = host;
        return this;
    }
    setPort(port) {
        this.port = port;
        return this;
    }
    setUsername(username) {
        this.username = username;
        return this;
    }
    setPassword(password) {
        this.password = password;
        return this;
    }
    setDatabase(database) {
        this.database = database;
        return this;
    }
    build() {
        return new DatabaseConnection(this.host, this.port, this.username, this.password, this.database);
    }
}
// Usage
const dbConnection = new DatabaseConnectionBuilderImpl()
    .setHost('192.168.1.1')
    .setPort(5432)
    .setUsername('admin')
    .setPassword('secret')
    .setDatabase('production')
    .build();
console.log(dbConnection);
//# sourceMappingURL=10.js.map