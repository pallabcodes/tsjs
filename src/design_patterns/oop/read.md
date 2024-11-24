In real-world product-based companies, structural design patterns are frequently used to solve problems related to organizing code for scalability, maintainability, and reuse. Here's a list of the **most commonly used structural patterns** along with their real-world applications:

---

### **1. Adapter Pattern**
- **Purpose**: Allows incompatible interfaces to work together by providing a bridge.
- **Real-World Usage**:
    - Integrating third-party APIs or libraries into your system.
    - Connecting legacy systems with modern systems.
- **Example**:
    - Adapting a payment gateway API (e.g., PayPal) to a unified interface for multiple payment methods.

---

### **2. Proxy Pattern**
- **Purpose**: Provides a surrogate to control access to an object.
- **Real-World Usage**:
    - Implementing lazy loading (e.g., database queries).
    - Adding security layers to sensitive operations.
    - Logging, caching, or monitoring calls to expensive resources.
- **Example**:
    - Database proxy to cache frequent queries.
    - Image loading proxies in image-heavy applications.

---

### **3. Decorator Pattern**
- **Purpose**: Dynamically adds or augments behavior to objects without altering their structure.
- **Real-World Usage**:
    - Extending features of a core system (e.g., adding logging, encryption).
    - UI frameworks where widgets can be decorated with additional functionalities.
- **Example**:
    - Middleware in web frameworks like Express.js or Flask.
    - Extending message sending with logging and encryption layers.

---

### **4. Bridge Pattern**
- **Purpose**: Decouples abstraction from its implementation to allow independent evolution.
- **Real-World Usage**:
    - Designing systems with multiple variants (e.g., devices and operating systems).
    - Implementing cross-platform interfaces.
- **Example**:
    - A remote control interface that works with both TVs and projectors.
    - Payment gateways abstracted from specific payment methods.

---

### **5. Facade Pattern**
- **Purpose**: Provides a simplified interface to a complex subsystem.
- **Real-World Usage**:
    - Wrapping a set of APIs into a single interface.
    - Simplifying access to complex libraries or frameworks.
- **Example**:
    - Facade for a file processing system (e.g., reading, writing, and compressing files).
    - A service layer in an enterprise application.

---

### **6. Flyweight Pattern**
- **Purpose**: Reduces memory usage by sharing common parts of objects.
- **Real-World Usage**:
    - Rendering repetitive UI elements like icons, text, or shapes.
    - Caching reusable resources (e.g., font rendering in a text editor).
- **Example**:
    - Sharing styles across multiple DOM elements in a web application.
    - Object pooling for database connections or threads.

---

### **7. Composite Pattern**
- **Purpose**: Treats individual objects and compositions of objects uniformly.
- **Real-World Usage**:
    - Hierarchical structures like file systems, menus, or organizational charts.
    - Managing complex tree-like structures.
- **Example**:
    - A file explorer where files and directories are treated similarly.
    - Nested UI components in a web or mobile app.

---

### **8. Singleton Pattern**
- **Purpose**: Ensures a class has only one instance and provides a global point of access.
- **Real-World Usage**:
    - Managing shared resources (e.g., logging, configuration).
    - Database connection management.
- **Example**:
    - A single instance of a configuration manager in a web application.
    - Session management in an authentication service.

---

### **9. MVC (Model-View-Controller)**
- **Purpose**: While not strictly a structural pattern, it provides a clear separation of concerns in applications.
- **Real-World Usage**:
    - Commonly used in web and desktop applications.
- **Example**:
    - Frameworks like Django (Python), Ruby on Rails (Ruby), and ASP.NET MVC.

---

### **10. Composite + Decorator Hybrid**
- **Purpose**: Used when a system needs hierarchical structures combined with flexible enhancements.
- **Real-World Usage**:
    - Flexible rendering engines where elements (like buttons or panels) can be nested and decorated dynamically.
- **Example**:
    - UI frameworks like React or Flutter.
    - Graphical editors like Adobe Photoshop.

---

### **Most Common in Product-Based Companies**
- **Adapter** and **Facade** are commonly used when integrating APIs or services.
- **Proxy** is widely used in backend systems for security, caching, and logging.
- **Decorator** is heavily used in middleware-based systems like web frameworks.
- **Singleton** is almost ubiquitous for managing global states or configurations.
- **Flyweight** is essential in performance-critical applications like game development.
- **Bridge** is used for systems requiring decoupling and scalability.

Let me know if you'd like to deep-dive into the implementation of any of these! 😊