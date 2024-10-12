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
  const logger = new LoggerAdapter(new XmlLogger()); // { xmlLogger: { log: f }, logMessage: f logMessage }
  logger.logMessage('hello message'); // Use a string message
}

// Call the main function to execute
main();
