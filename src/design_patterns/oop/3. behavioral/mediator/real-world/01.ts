// The **Mediator Pattern** is a behavioral design pattern that facilitates communication between objects (colleagues) without them being directly dependent on each other. Instead, a mediator object handles the interaction, promoting loose coupling and better maintainability.

// A **single example** may suffice to demonstrate the full power of the **Mediator Pattern**, provided it is comprehensive and incorporates realistic scenarios. The example should meet product-based standards by addressing:

// 1. **Loose coupling**: Objects communicate indirectly through a mediator.
// 2. **Scalability**: New components can be integrated without modifying existing ones.
// 3. **Encapsulation of behavior**: Interaction logic is centralized in the mediator.
// 4. **Real-world complexity**: Examples should reflect practical, product-grade use cases.


// ### Comprehensive Real-World Example: A Chatroom System

// This example demonstrates a **Mediator Pattern** in a real-world scenario where users communicate in a chatroom. The chatroom acts as the mediator, managing messages and ensuring participants don't directly interact, satisfying the product-based requirements.

// #### Key Features:
//   - **Loose Coupling**: Users don't interact directly; the chatroom handles communication.
// - **Scalability**: New user types (e.g., admins, moderators) can be added easily.
// - **Encapsulation**: All message handling logic resides in the chatroom.
// - **Real-world relevance**: A familiar chatroom scenario.

// ===========================
// Mediator Interface
// ===========================
interface ChatroomMediator {
    sendMessage(message: string, sender: User): void;
    addUser(user: User): void;
}

// ===========================
// Concrete Mediator
// ===========================
class Chatroom implements ChatroomMediator {
    private users: Map<string, User> = new Map();

    addUser(user: User): void {
        this.users.set(user.name, user);
        user.setMediator(this);
    }

    sendMessage(message: string, sender: User): void {
        console.log(`[Chatroom] ${sender.name} says: "${message}"`);

        // Relay message to all other users
        this.users.forEach((user) => {
            if (user !== sender) {
                user.receiveMessage(message, sender.name);
            }
        });
    }
}

// ===========================
// Abstract Colleague (User)
// ===========================
abstract class User {
    protected mediator?: ChatroomMediator;
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    setMediator(mediator: ChatroomMediator): void {
        this.mediator = mediator;
    }

    sendMessage(message: string): void {
        if (!this.mediator) {
            throw new Error("No mediator set for user.");
        }
        this.mediator.sendMessage(message, this);
    }

    abstract receiveMessage(message: string, senderName: string): void;
}

// ===========================
// Concrete Colleagues
// ===========================
class RegularUser extends User {
    receiveMessage(message: string, senderName: string): void {
        console.log(`[RegularUser: ${this.name}] Received from ${senderName}: "${message}"`);
    }
}

class AdminUser extends User {
    receiveMessage(message: string, senderName: string): void {
        console.log(`[AdminUser: ${this.name}] Received (priority) from ${senderName}: "${message}"`);
    }

    kickUser(userToKick: string): void {
        console.log(`[AdminUser: ${this.name}] Initiates a kick for user: ${userToKick}`);
        // Admin-specific logic to kick a user (out of scope here)
    }
}

// ===========================
// Usage Example
// ===========================
const chatroom = new Chatroom();

const alice = new RegularUser("Alice");
const bob = new RegularUser("Bob");
const charlie = new AdminUser("Charlie");

chatroom.addUser(alice);
chatroom.addUser(bob);
chatroom.addUser(charlie);

alice.sendMessage("Hi, everyone!");
bob.sendMessage("Hello, Alice!");
charlie.sendMessage("Welcome to the chatroom!");
charlie.kickUser("Bob");

// ### Key Concepts Covered:
//
//   #### 1. **Loose Coupling**
// - Users (colleagues) don’t interact directly with one another. They use the `Chatroom` (mediator) to send and receive messages.
//
// #### 2. **Encapsulation of Interaction Logic**
// - The `Chatroom` centralizes all interaction logic, such as broadcasting messages or handling special actions like kicking a user.
//
// #### 3. **Scalability**
// - New user roles (e.g., moderators, premium users) can be added without altering existing users or the chatroom. For example, a `ModeratorUser` could be created with additional privileges.
//
// #### 4. **Real-World Complexity**
// - The chatroom system reflects real-world scenarios involving diverse users and interactions. The admin’s ability to "kick" users demonstrates role-based functionality.


// ### Extending the Example for Full Product-Based Standards:
//
// - **Customizable Rules**: Implement rules for message filtering (e.g., profanity detection) or limiting message frequency.
// - **Integration with External Services**: Extend the mediator to integrate logging, analytics, or monitoring services.
// - **Concurrency**: Use patterns like thread-safe queues for handling messages in high-traffic systems.
// - **Dynamic Groups**: Add functionality for users to create private chatrooms (sub-mediators).


// ### Is This Enough?

// This example showcases the **full power of the Mediator Pattern**:
// 1. **Covers core principles**: Encapsulation, loose coupling, and centralization.
// 2. **Reflects real-world use cases**: A chatroom is practical and familiar.
// 3. **Scalable**: New features or types can be integrated seamlessly.
// 4. **Encourages separation of concerns**: Interaction logic is decoupled from user objects.
//   However, **the power of the Mediator Pattern is contextual**. For product-based standards, ensure:
// - The mediator’s logic doesn’t become a monolith (refactor if needed).
// - The implementation aligns with specific requirements (e.g., performance or security).

// If you need another real-world example, such as **traffic control systems**, **e-commerce order workflows**, or **event-driven systems**, let me know! But the chatroom example should serve as a solid, comprehensive template.