// The Adapter Pattern is a structural design pattern that allows incompatible interfaces to work together by acting as a bridge. It’s particularly useful in real-world scenarios when integrating with legacy systems, third-party libraries, or APIs with mismatched interfaces.

/**
 * Key Scenarios Where Adapter Pattern is Used:
 * Adapting Legacy Code: Integrating old systems with new code.
 * Third-party Libraries: Making a library conform to your interface.
 * Incompatible APIs: Wrapping APIs with a unified interface for easier usage.
 * System Abstractions: Adapting low-level modules into high-level abstractions.
 * */

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
