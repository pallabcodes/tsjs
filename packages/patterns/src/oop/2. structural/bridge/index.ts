/**
 * Use Case: Cross-Platform Notification System
 * Scenario:
 * Your application needs to send notifications via different channels: Email, SMS, and Push Notifications.
 * Each channel supports multiple providers (e.g., Email: SendGrid, Mailgun; SMS: Twilio, Plivo).
 * The implementation must allow adding new notification types or providers without altering existing code.
 * The Bridge Pattern decouples the abstraction (notification type) from its implementation (provider), allowing them to evolve independently.
 * */

// Step 1: Define the Abstraction
// The abstraction is the Notification class, representing different notification types (e.g., Alert, Reminder).
abstract class Notification {
  protected provider: NotificationProvider;

  constructor(provider: NotificationProvider) {
    if (!provider) {
      throw new Error('Notification provider must be provided.');
    }
    this.provider = provider; // Bridge to the implementation
  }

  abstract send(message: string, recipient: string): Promise<void>;
}

// Step 2: Refine the Abstraction
// Create concrete notification types extending the base abstraction.

class AlertNotification extends Notification {
  async send(message: string, recipient: string): Promise<void> {
    console.log('Sending Alert Notification...');
    try {
      return this.provider.sendNotification(message, recipient);
    } catch (error) {
      console.error('Failed to send alert notification:', error);
    }
  }
}

class ReminderNotification extends Notification {
  async send(message: string, recipient: string): Promise<void> {
    console.log('Sending Reminder Notification...');
    try {
      return this.provider.sendNotification(message, recipient);
    } catch (error) {
      console.error('Failed to send reminder notification:', error);
    }
  }
}

// Step 3: Define the Implementation Interface
// This defines the contract that all providers must adhere to.
interface NotificationProvider {
  sendNotification(message: string, recipient: string): void | Promise<void>;
}

// Step 4: Create Concrete Implementations of Providers
// These are the different providers implementing the notification sending logic.
class SendGridProvider implements NotificationProvider {
  async sendNotification(message: string, recipient: string): Promise<void> {
    // Simulate a real async API call (e.g., SendGrid API)
    if (!message || !recipient) {
      throw new Error('Missing message or recipient for SendGrid.');
    }

    console.log(`SendGrid: Sending Email - "${message}" to ${recipient}`);

    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('SendGrid: Email sent successfully!');
  }
}
class TwilioProvider implements NotificationProvider {
  async sendNotification(message: string, recipient: string): Promise<void> {
    // Simulate a real async API call (e.g., Twilio API)
    if (!message || !recipient) {
      throw new Error('Missing message or recipient for Twilio.');
    }

    console.log(`Twilio: Sending SMS - "${message}" to ${recipient}`);

    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Twilio: SMS sent successfully!');
  }
}
class FirebaseProvider implements NotificationProvider {
  async sendNotification(message: string, recipient: string): Promise<void> {
    // Simulate a real async API call (e.g., Firebase Cloud Messaging)
    if (!message || !recipient) {
      throw new Error('Missing message or recipient for Firebase.');
    }

    console.log(
      `Firebase: Sending Push Notification - "${message}" to ${recipient}`
    );

    // Simulating API response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Firebase: Push Notification sent successfully!');
  }
}

// Step 5: Integrate the System

// Create providers
const sendGrid = new SendGridProvider();
const twilio = new TwilioProvider();
const firebase = new FirebaseProvider();

// Create notifications with different providers
const alertEmail = new AlertNotification(sendGrid);
const alertSMS = new AlertNotification(twilio);
const reminderPush = new ReminderNotification(firebase);

// Send notifications
(async () => {
  await alertEmail.send('Server Down!', 'admin@example.com');
  await alertSMS.send('Server Down!', '+1234567890');
  await reminderPush.send('Meeting at 3 PM', 'user_device_token');
})();

/**
 * Sending Alert Notification...
 * SendGrid: Sending Email - "Server Down!" to admin@example.com
 * SendGrid: Email sent successfully!
 *
 * Sending Alert Notification...
 * Twilio: Sending SMS - "Server Down!" to +1234567890
 * Twilio: SMS sent successfully!
 *
 * Sending Reminder Notification...
 * Firebase: Sending Push Notification - "Meeting at 3 PM" to user_device_token
 * Firebase: Push Notification sent successfully!
 * */

/**
 * Final Thoughts on Improvements:
 * ------------------------------
 * Async Handling: Using async/await properly ensures the system works efficiently without blocking the execution thread, especially important for I/O-bound operations like sending emails or SMS.
 * Proper Error Handling: We have added try/catch blocks to handle errors when sending notifications, ensuring the system behaves predictably in case of failures.
 * Mock Implementation for Real-World Use: Even though this code uses mocked API calls with timeouts, in a production environment, you'd replace these mock delays with real HTTP requests or SDK calls to services like SendGrid, Twilio, or Firebase.
 * Separation of Concerns: The Notification class doesn’t deal with the specifics of how messages are sent, which adheres to the Bridge Pattern principle. The different providers handle that, making it easy to swap out providers without touching the notification logic.
 *
 * */

/**
 * summary:
 *
 * Explanation of Key TypeScript Features Used:
 * Abstract Classes:
 *
 * The Notification class is abstract, meaning it can't be instantiated directly and must be extended by concrete classes.
 * Interfaces:
 *
 * The NotificationProvider interface ensures that all provider classes implement the sendNotification() method, providing a standardized way to send messages across different types of providers.
 * Dependency Injection:
 *
 * The Notification class receives a NotificationProvider through its constructor. This dependency injection allows different types of notification providers to be passed to the same Notification abstraction.
 * Polymorphism:
 *
 * The concrete AlertNotification and ReminderNotification classes both call the sendNotification() method on the NotificationProvider interface, demonstrating polymorphism. The actual method that gets executed depends on which provider is passed (e.g., SendGridProvider or TwilioProvider).
 * Advantages for Backend in TypeScript:
 * Scalability: New notification types or providers can be easily added without modifying existing code.
 * Separation of Concerns: The abstraction handles the "what" (notification type), and the implementation handles the "how" (sending the notification).
 * Extensibility: Adding new notification providers (e.g., MailgunProvider or PlivoProvider) can be done without changing the core notification logic.
 * Type Safety: TypeScript ensures that all providers adhere to the NotificationProvider interface, providing better compile-time validation.
 * */
