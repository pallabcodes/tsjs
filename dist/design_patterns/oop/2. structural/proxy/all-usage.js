"use strict";
class RealSubject {
    request() {
        console.log('RealSubject: Handling request.');
    }
}
class Proxy {
    constructor() {
        this.realSubject = null;
    }
    request() {
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
class ProtectedResource {
    request() {
        console.log('Accessing protected resource...');
    }
}
class AccessControlProxy {
    constructor() {
        this.realSubject = null;
    }
    request() {
        if (this.hasAccess()) {
            if (!this.realSubject) {
                this.realSubject = new ProtectedResource();
            }
            this.realSubject.request();
        }
        else {
            console.log('Access Denied!');
        }
    }
    hasAccess() {
        // Add logic to check if the user has access rights
        return false; // Simulating access denial
    }
}
// Usage example
const accessProxy = new AccessControlProxy();
accessProxy.request(); // Access Denied!
// #### 3. **Logging and Monitoring**
class Service {
    request() {
        console.log('Service: Request received.');
    }
}
class LoggingProxy {
    constructor() {
        this.realSubject = null;
    }
    request() {
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
class ExpensiveCalculation {
    constructor() {
        this.result = null;
    }
    request() {
        if (this.result === null) {
            console.log('Performing expensive calculation...');
            this.result = 42; // Simulating an expensive calculation
        }
        else {
            console.log('Returning cached result...');
        }
        console.log(`Result: ${this.result}`);
    }
}
class CachingProxy {
    constructor() {
        this.realSubject = null;
    }
    request() {
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
class Image {
    constructor(file) {
        this.file = file;
    }
    request() {
        console.log(`Displaying image: ${this.file}`);
    }
}
class VirtualProxy {
    constructor(file) {
        this.realImage = null;
        this.file = file;
    }
    request() {
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
//# sourceMappingURL=all-usage.js.map