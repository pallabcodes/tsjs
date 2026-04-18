// ### Hybrid Command + Chain of Responsibility Pattern Use Cases
//
// The **Command Pattern** encapsulates a request as an object, thus allowing for parameterization and queuing of requests.
// The **Chain of Responsibility Pattern** allows passing a request along a chain of handlers, where each handler can process or pass on the request.
//
// Combining both patterns is useful when requests need to be processed by multiple handlers (with possible retries or logging) in a chain, and each handler executes a command.

interface Command {
  execute(): void;
}

class ConcreteCommand implements Command {
  constructor(private message: string) {}

  execute() {
    console.log(`Executing command: ${this.message}`);
  }
}

abstract class Handler {
  protected nextHandler: Handler | null = null;

  setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  abstract handleRequest(request: Command): void;
}

class RetryHandler extends Handler {
  handleRequest(request: Command): void {
    console.log('RetryHandler: Retrying command');
    request.execute();
    if (this.nextHandler) {
      this.nextHandler.handleRequest(request);
    }
  }
}

class LoggingHandler extends Handler {
  handleRequest(request: Command): void {
    console.log('LoggingHandler: Logging command');
    request.execute();
    if (this.nextHandler) {
      this.nextHandler.handleRequest(request);
    }
  }
}

// Usage example
const command = new ConcreteCommand('Send Email');
const retryHandler = new RetryHandler();
const loggingHandler = new LoggingHandler();

retryHandler.setNext(loggingHandler);

retryHandler.handleRequest(command); // Executes with retry and logging
