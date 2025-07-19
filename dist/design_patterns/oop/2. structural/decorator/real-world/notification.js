"use strict";
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
// Concrete Implementation
class SimpleNotification {
    send(message) {
        console.log(`Sending notification: ${message}`);
    }
}
// Step 3: Create the Abstract Decorator Class
// All decorators will implement the Notification interface and extend functionality by wrapping an existing Notification object.
// Abstract Decorator
class NotificationDecorator {
    constructor(notification) {
        this.notification = notification;
    }
    send(message) {
        this.notification.send(message);
    }
}
// Step 4: Implement Concrete Decorators
// Each decorator adds a specific feature to the notification system.
class EmailNotificationDecorator extends NotificationDecorator {
    send(message) {
        super.send(message); // Send base notification
        this.sendEmail(message); // Add email functionality
    }
    sendEmail(message) {
        console.log(`Sending email: ${message}`);
    }
}
// # SMS Notification
class SMSNotificationDecorator extends NotificationDecorator {
    send(message) {
        super.send(message); // Send base notification
        this.sendSMS(message); // Add SMS functionality
    }
    sendSMS(message) {
        console.log(`Sending SMS: ${message}`);
    }
}
// # Push Notification
class PushNotificationDecorator extends NotificationDecorator {
    send(message) {
        super.send(message); // Send base notification
        this.sendPush(message); // Add push notification functionality
    }
    sendPush(message) {
        console.log(`Sending push notification: ${message}`);
    }
}
// # Logging Decorator
class LoggingDecorator extends NotificationDecorator {
    send(message) {
        super.send(message); // Send base notification
        this.logMessage(message); // Add logging
    }
    logMessage(message) {
        console.log(`Log: Notification sent with message: "${message}"`);
    }
}
// # Encryption Decorator
class EncryptionDecorator extends NotificationDecorator {
    send(message) {
        const encryptedMessage = this.encrypt(message);
        super.send(encryptedMessage); // Send encrypted message
    }
    encrypt(message) {
        return `***${message}***`; // Simple encryption (placeholder)
    }
}
// # Step 5: Usage Example
// Create a base notification with decorators in the correct order
let notification = new SimpleNotification();
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
//# sourceMappingURL=notification.js.map