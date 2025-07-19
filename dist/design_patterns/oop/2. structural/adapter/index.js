"use strict";
// The Adapter Pattern is a structural design pattern that allows incompatible interfaces to work together by acting as a bridge. It’s particularly useful in real-world scenarios when integrating with legacy systems, third-party libraries, or APIs with mismatched interfaces.
// Class for XmlLogger
class XmlLogger {
    log(xmlMessage) {
        console.log(xmlMessage);
    }
}
// LoggerAdapter class that adapts XmlLogger to JsonLogger
class LoggerAdapter {
    constructor(xmlLogger) {
        this.xmlLogger = xmlLogger;
    }
    logMessage(message) {
        this.xmlLogger.log(message);
    }
}
// Main function to demonstrate the adapter pattern
function main() {
    const logger = new LoggerAdapter(new XmlLogger());
    logger.logMessage('hello message'); // Use a string message
}
// Call the main function to execute
main();
//# sourceMappingURL=index.js.map