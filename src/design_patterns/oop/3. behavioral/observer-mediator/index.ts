// Certainly! The **Observer** and **Mediator** patterns are both powerful behavioral design patterns often used in complex systems to handle communication between components. While each pattern can stand on its own, they can also be used together in product-based scenarios, especially when components need to communicate but shouldn't be directly coupled.

// ### Understanding Observer + Mediator Patterns

// - **Observer Pattern** is used when an object (the **subject**) notifies other objects (the **observers**) about state changes, without the subject needing to know who or how many observers are involved.

// - **Mediator Pattern** is used to control communication between objects (components), reducing direct dependencies between them. It centralizes the communication, so that objects don't directly reference one another.

// When combined, **Observer** handles notifications and **Mediator** can manage the interactions, ensuring loose coupling between components.

// ### Real-World Example: Chat Application with User Status Updates

// In a **chat application**, we can apply both the **Observer** and **Mediator** patterns to manage the communication between users and update their statuses. The **Mediator** coordinates interactions between users, and the **Observer** pattern is used to notify users about other users' status changes.


// ### Full Example: Chat Application with User Status Updates
// We will simulate a chat application where users can change their statuses (online, offline, busy), and the **Mediator** will coordinate the interactions and notifications between users. The **Observer** will allow users to observe the status of other users in the system.

// #### 1. **Observer Pattern**: User Observers

// Each user will be an observer, watching for changes in another user’s status.

// #### 2. **Mediator Pattern**: ChatRoom

// The **ChatRoom** will act as the mediator, coordinating the status updates between users.


// #### **Step 1: Define the Observer (User) Class**


interface UserObserver {
    update(userStatus: string): void;
}

class User implements UserObserver {
    private status: string;
    private username: string;

    constructor(username: string) {
        this.username = username;
        this.status = 'offline'; // default status
    }

    // Implementing the update method from UserObserver
    update(userStatus: string): void {
        this.status = userStatus;
        console.log(`${this.username}'s status has been updated to: ${this.status}`);
}

// Method to change user status
changeStatus(newStatus: string) {
  this.status = newStatus;
}

getStatus() {
  return this.status;
}

getUsername() {
  return this.username;
}

}


// - **User Class**: Each user has a status and can observe changes in other users' statuses. When a user's status changes, all observers (other users) will be notified.
// #### **Step 2: Define the Mediator (ChatRoom) Class**


interface Mediator {
  registerUser(user: User): void;
  notifyUsers(changedUser: User, newStatus: string): void;
}

class ChatRoom implements Mediator {
  private users: User[] = [];

  // Register users in the chatroom
  registerUser(user: User): void {
    this.users.push(user);
  }

  // Notify all users about a status change
  notifyUsers(changedUser: User, newStatus: string): void {
    for (let user of this.users) {
      // Don't notify the user who changed the status
      if (user !== changedUser) {
        user.update(newStatus);
      }
    }
  }
}

// **ChatRoom Class (Mediator)**: The **ChatRoom** acts as the mediator. It registers users and notifies them when another user's status changes. This way, users don't communicate directly with each other; the **ChatRoom** manages the communication.

// #### **Step 3: Putting It All Together**

// Create a new chatroom (mediator)
const chatRoom = new ChatRoom();

// Create users
const alice = new User('Alice');
const bob = new User('Bob');
const charlie = new User('Charlie');

// Register users with the chatroom (mediator)
chatRoom.registerUser(alice);
chatRoom.registerUser(bob);
chatRoom.registerUser(charlie);

// Change the status of users and notify observers
alice.changeStatus('online');
chatRoom.notifyUsers(alice, alice.getStatus()); // Alice's status change should notify Bob and Charlie

bob.changeStatus('busy');
chatRoom.notifyUsers(bob, bob.getStatus()); // Bob's status change should notify Alice and Charlie

charlie.changeStatus('offline');
chatRoom.notifyUsers(charlie, charlie.getStatus()); // Charlie's status change should notify Alice and Bob

// ### Key Concepts Covered:
//
// 1. **Observer Pattern** (User as Observer):
//    - The **User** class acts as the observer. Each user is watching for status changes of other users.
//    - The `update` method in the **User** class is called whenever a user's status changes. Each user updates their local status when notified by the mediator.
//
// 2. **Mediator Pattern** (ChatRoom as Mediator):
//    - The **ChatRoom** class is the mediator, managing interactions between users. When one user's status changes, it notifies all other registered users about the change, thus decoupling users from directly communicating with one another.
//    - The **ChatRoom** ensures users only interact through it, minimizing direct dependencies.
//
// 3. **Loose Coupling**:
//    - Users don’t need to know about each other’s existence directly. They interact only with the **ChatRoom** mediator.
//    - This reduces dependencies and keeps components (users) independent from each other, promoting easier maintenance and scalability.
//
// 4. **Fluent Interface** (Not visible in this case, but can be added for user creation and status management):
//    - A fluent interface can be added to the `User` class methods for chaining status changes and updates in a more readable way.
//
// ---
//
// ### Does This Cover the Full Power of the "Observer + Mediator" Pattern?
//
// - **Complex, Real-World Application**: This is a realistic example of how the **Observer** and **Mediator** patterns are applied in product-based scenarios, specifically in systems like messaging platforms, event-driven systems, and collaborative applications.
//
// - **Separation of Concerns**: By using these patterns together, the **ChatRoom** manages communication, while the **User** class only cares about its own status. The logic is encapsulated and decoupled, promoting **single responsibility** and **loose coupling**.
//
// - **Scalability**: The system can easily scale by adding more users without modifying how users are notified of each other's status changes. The mediator manages the logic for notifications, so new observers (users) can be added without any additional changes to the business logic.
//
// - **Extensibility**: You can extend this system to handle other types of updates (e.g., messages, activity logs) or more complex interactions like private messages, while the basic structure remains the same. Adding more observers or modifying the mediation logic won’t require drastic changes.
//
// - **Real-World Use Case**: In large product-based systems, these patterns are often used in complex systems like chat applications, real-time notifications, event tracking systems, etc.
//
// ---
//
// ### Conclusion:
//
// This example should be sufficient to cover the majority of use cases for **Observer** + **Mediator** patterns in real-world product-based standards. It demonstrates how to manage interactions between multiple objects without direct dependencies, how notifications can propagate through the system, and how a mediator can simplify communication.
//
// However, depending on the complexity of your system, there might be additional features to consider:
// - **Performance considerations** for large-scale systems (e.g., limiting the number of notifications or users being notified).
// - **Asynchronous handling** for real-time updates (e.g., using WebSockets for status updates).
// - **Error handling** or advanced features like status change validations, retries, etc.
//
// But as far as a basic example of **Observer + Mediator** goes, this is a solid foundation.