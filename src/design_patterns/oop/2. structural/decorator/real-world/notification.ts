/**
 * Example: Enhancing a Notification System with Decorators
 *   Problem:
 *     Suppose you have a base Notification system that sends plain text notifications. Over time, you need to add features like:
 *
 * 1. Email notifications
 * 2. SMS notifications
 * 3. Push notifications
 * 4. Logging for analytics
 * 5. Encryption for security
 *
 * Instead of modifying the base class, we will use decorators to wrap and extend its functionality.
 * */

// Step 1: Define the Notification Interface

// Base Interface for Notifications
interface Notification {
  send(message: string): void;
}

// Concrete Implementation
class SimpleNotification implements Notification {
  send(message: string): void {
    console.log(`Sending notification: ${message}`);
  }
}

// Step 3: Create the Abstract Decorator Class
// All decorators will implement the Notification interface and extend functionality by wrapping an existing Notification object.

// Abstract Decorator
abstract class NotificationDecorator implements Notification {
  protected notification: Notification;

  constructor(notification: Notification) {
    this.notification = notification;
  }

  send(message: string): void {
    this.notification.send(message);
  }
}

// Step 4: Implement Concrete Decorators
// Each decorator adds a specific feature to the notification system.

class EmailNotificationDecorator extends NotificationDecorator {
  override send(message: string): void {
    super.send(message); // Send base notification
    this.sendEmail(message); // Add email functionality
  }

  private sendEmail(message: string): void {
    console.log(`Sending email: ${message}`);
  }
}

// # SMS Notification
class SMSNotificationDecorator extends NotificationDecorator {
  override send(message: string): void {
    super.send(message); // Send base notification
    this.sendSMS(message); // Add SMS functionality
  }

  private sendSMS(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}

// # Push Notification
class PushNotificationDecorator extends NotificationDecorator {
  override send(message: string): void {
    super.send(message); // Send base notification
    this.sendPush(message); // Add push notification functionality
  }

  private sendPush(message: string): void {
    console.log(`Sending push notification: ${message}`);
  }
}

// # Logging Decorator
class LoggingDecorator extends NotificationDecorator {
  override send(message: string): void {
    super.send(message); // Send base notification
    this.logMessage(message); // Add logging
  }

  private logMessage(message: string): void {
    console.log(`Log: Notification sent with message: "${message}"`);
  }
}

// # Encryption Decorator
class EncryptionDecorator extends NotificationDecorator {
  override send(message: string): void {
    const encryptedMessage = this.encrypt(message);
    super.send(encryptedMessage); // Send encrypted message
  }

  private encrypt(message: string): string {
    return `***${message}***`; // Simple encryption (placeholder)
  }
}

// # Step 5: Usage Example
// Create a base notification with decorators in the correct order
let notification: Notification = new SimpleNotification();

// Apply encryption first (innermost decorator)
notification = new EncryptionDecorator(notification);
// Then add other decorators
notification = new LoggingDecorator(notification);
notification = new EmailNotificationDecorator(notification);
notification = new SMSNotificationDecorator(notification);
notification = new PushNotificationDecorator(notification);

// Send the notification
notification.send('Hello, this is a test notification!');

// # OUTPUT

/**
 * Log: Notification sent with message: "***Hello, this is a test notification!***"
 * Sending notification: ***Hello, this is a test notification!***
 * Sending email: ***Hello, this is a test notification!***
 * Sending SMS: ***Hello, this is a test notification!***
 * Sending push notification: ***Hello, this is a test notification!***
 *
 * */
