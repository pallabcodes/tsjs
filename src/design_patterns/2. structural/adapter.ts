// N.B: comparability, using a solely unrelated class's properties and method through a wrapper class i.e. LoggerAdapter

interface JsonLogger {
  logMessage(message: string): void;
}

// Class for XmlLogger
class XmlLogger {
  public log(xmlMessage: string): void {
    console.log(xmlMessage);
  }
}

// LoggerAdapter class that adapts XmlLogger to JsonLogger
class LoggerAdapter implements JsonLogger {
  private xmlLogger: XmlLogger;

  constructor(xmlLogger: XmlLogger) {
    this.xmlLogger = xmlLogger;
  }

  public logMessage(message: string): void {
    this.xmlLogger.log(message);
  }
}

// Main function to demonstrate the adapter pattern
function main() {
  const logger: JsonLogger = new LoggerAdapter(new XmlLogger());
  logger.logMessage('hello message'); // Use a string message
}

// Call the main function to execute
main();
