// ### Proxy Pattern Use Cases
//
// The **Proxy Pattern** is a structural design pattern that provides an object representing another object. The proxy controls access to the original object, potentially adding additional behavior like lazy loading, access control, logging, or caching.
//
// Key scenarios where you would use the Proxy pattern:
//
// 1. **Lazy Initialization**: Create and initialize the real object only when it’s needed.
// 2. **Access Control**: Restrict access to the real object based on certain conditions.
// 3. **Logging and Monitoring**: Track operations and access to the real object.
// 4. **Caching**: Store results from expensive operations to avoid repeated computations.
// 5. **Virtual Proxy**: Handle resource-intensive objects by delaying their creation until required.
//
// #### 1. **Lazy Initialization**
interface Subject {
  request(): void;
}

class RealSubject implements Subject {
  request(): void {
    console.log('RealSubject: Handling request.');
  }
}

class Proxy implements Subject {
  private realSubject: RealSubject | null = null;

  request(): void {
    if (!this.realSubject) {
      this.realSubject = new RealSubject();
    }
    this.realSubject.request();
  }
}

// Usage example
const proxy = new Proxy();
proxy.request(); // RealSubject: Handling request.

// #### 2. **Access Control**
class ProtectedResource implements Subject {
  request(): void {
    console.log('Accessing protected resource...');
  }
}

class AccessControlProxy implements Subject {
  private realSubject: ProtectedResource | null = null;

  request(): void {
    if (this.hasAccess()) {
      if (!this.realSubject) {
        this.realSubject = new ProtectedResource();
      }
      this.realSubject.request();
    } else {
      console.log('Access Denied!');
    }
  }

  private hasAccess(): boolean {
    // Add logic to check if the user has access rights
    return false; // Simulating access denial
  }
}

// Usage example
const accessProxy = new AccessControlProxy();
accessProxy.request(); // Access Denied!

// #### 3. **Logging and Monitoring**
class Service implements Subject {
  request(): void {
    console.log('Service: Request received.');
  }
}

class LoggingProxy implements Subject {
  private realSubject: Service | null = null;

  request(): void {
    console.log('LoggingProxy: Logging request...');
    if (!this.realSubject) {
      this.realSubject = new Service();
    }
    this.realSubject.request();
  }
}

// Usage example
const loggingProxy = new LoggingProxy();
loggingProxy.request(); // LoggingProxy: Logging request... Service: Request received.

// #### 4. **Caching**
class ExpensiveCalculation implements Subject {
  private result: number | null = null;

  request(): void {
    if (this.result === null) {
      console.log('Performing expensive calculation...');
      this.result = 42; // Simulating an expensive calculation
    } else {
      console.log('Returning cached result...');
    }
    console.log(`Result: ${this.result}`);
  }
}

class CachingProxy implements Subject {
  private realSubject: ExpensiveCalculation | null = null;

  request(): void {
    if (!this.realSubject) {
      this.realSubject = new ExpensiveCalculation();
    }
    this.realSubject.request();
  }
}

// Usage example
const cachingProxy = new CachingProxy();
cachingProxy.request(); // Performing expensive calculation... Result: 42
cachingProxy.request(); // Returning cached result... Result: 42

// #### 5. **Virtual Proxy**
class Image implements Subject {
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  request(): void {
    console.log(`Displaying image: ${this.file}`);
  }
}

class VirtualProxy implements Subject {
  private realImage: Image | null = null;
  private file: string;

  constructor(file: string) {
    this.file = file;
  }

  request(): void {
    if (!this.realImage) {
      console.log('Lazy loading image...');
      this.realImage = new Image(this.file);
    }
    this.realImage.request();
  }
}

// Usage example
const imageProxy = new VirtualProxy('image1.jpg');
imageProxy.request(); // Lazy loading image... Displaying image: image1.jpg
imageProxy.request(); // Displaying image: image1.jpg
