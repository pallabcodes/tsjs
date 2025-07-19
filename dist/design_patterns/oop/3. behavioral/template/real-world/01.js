"use strict";
// The **Template Pattern** is a behavioral design pattern
// that defines the skeleton of an algorithm in a superclass
// while allowing subclasses to override specific steps of the algorithm without changing its structure
// and it's particularly useful
// when there is a common workflow but certain steps need customization or implementation-specific logic.
//
// To demonstrate the **Template Pattern** fully in a real-world context, we'll focus on an example that showcases:
//
// 1. **Abstract Workflow with Customizable Steps**: A well-defined algorithm structure that can be extended.
// 2. **Reusable Base Logic**: Avoids duplicating logic across subclasses.
// 3. **Enforcing Rules and Order**: Ensures a consistent sequence of operations.
// 4. **Real-World Use Case**: A system handling notifications via different channels
// (e.g., Email, SMS, Push Notification).
//
// ---
//
// ### Real-World Example: Notification Service with Template Pattern
//
// #### Problem:
//   A notification system sends notifications via multiple channels like **Email**,
//   **SMS**, and **Push Notifications**.
//   The general workflow is the same:
//   1. Validate the recipient.
// 2. Format the message.
// 3. Send the notification.
// 4. Log the result.
//
//   However, each channel has specific requirements,
//   such as formatting messages differently or using a distinct delivery mechanism.
//
// #### Solution:
// We use the **Template Pattern** to define the common workflow in a base class
// and allow each channel to customize only the necessary steps.
// ### Implementation
// =========================
// Base Template Class
// =========================
class NotificationTemplate {
    // Template method - defines the algorithm's structure
    sendNotification(recipient, message) {
        try {
            if (!this.validateRecipient(recipient)) {
                console.error(`Invalid recipient: ${recipient}`);
                return false;
            }
            const formattedMessage = this.formatMessage(message);
            this.deliver(recipient, formattedMessage);
            this.logResult(recipient);
            return true;
        }
        catch (error) {
            console.error(`Failed to send notification: ${error}`);
            return false;
        }
    }
    // Step 1: Validate recipient (can be overridden)
    validateRecipient(recipient) {
        return recipient.trim().length > 0; // Default validation
    }
    // Step 4: Log result (optional override)
    logResult(recipient) {
        try {
            console.log(`Notification sent to ${recipient}`);
        }
        catch (error) {
            console.error(`Failed to log notification: ${error}`);
        }
    }
}
// =========================
// Concrete Implementations
// =========================
// Email Notification
class EmailNotification extends NotificationTemplate {
    validateRecipient(recipient) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(recipient);
    }
    formatMessage(message) {
        return `Email Message: ${message}`;
    }
    deliver(recipient, message) {
        console.log(`Sending email to ${recipient} with message: "${message}"`);
        // Simulate email delivery logic
    }
}
// SMS Notification
class SMSNotification extends NotificationTemplate {
    validateRecipient(recipient) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        return phoneRegex.test(recipient);
    }
    formatMessage(message) {
        return `SMS Message: ${message}`;
    }
    deliver(recipient, message) {
        console.log(`Sending SMS to ${recipient} with message: "${message}"`);
        // Simulate SMS delivery logic
    }
}
// Push Notification
class PushNotification extends NotificationTemplate {
    validateRecipient(recipient) {
        return typeof recipient === 'string' && recipient.length > 0;
    }
    formatMessage(message) {
        return `Push Notification: ${message}`;
    }
    deliver(recipient, message) {
        console.log(`Sending push notification to ${recipient} with message: "${message}"`);
        // Simulate push notification delivery logic
    }
}
// =========================
// Usage Example
// =========================
const emailNotifier = new EmailNotification();
const emailSuccess = emailNotifier.sendNotification('user@example.com', 'Hello via Email!');
if (!emailSuccess) {
    console.error('Failed to send email notification');
}
const smsNotifier = new SMSNotification();
smsNotifier.sendNotification('1234567890', 'Hello via SMS!');
const pushNotifier = new PushNotification();
pushNotifier.sendNotification('device123', 'Hello via Push Notification!');
// ### Key Features of the Template Pattern in This Example:
//
// 1. **Abstract Workflow with Customizable Steps**:
// - The `sendNotification` method defines a strict sequence of operations for sending notifications.
// - Steps like `validateRecipient`, `formatMessage`, and `deliver` are customizable.
//
// 2. **Reusable Base Logic**:
// - Common logic like logging results is implemented in the base class to avoid duplication.
//
// 3. **Enforcing Rules and Order**:
// - The base class ensures that the workflow is followed in the correct sequence.
//
// 4. **Real-World Use Case**:
// - It models a real-world problem: sending notifications via multiple channels with shared and unique requirements.
// ### Does This Cover Everything for Product-Based Standards?
//
//   This example demonstrates the full power of the **Template Pattern** as applied to a product-standard real-world scenario. Here's why it’s sufficient:
//
// 1. **Complexity Handling**: It handles complexity by abstracting reusable logic and enforcing workflow consistency.
// 2. **Extensibility**: Adding a new notification channel (e.g., **Slack** or **WhatsApp**) is straightforward—just extend `NotificationTemplate` and implement the specific methods.
// 3. **Readability and Maintainability**: The pattern ensures that the workflow is easy to understand, modify, and extend.
// 4. **Practical Use Case**: Notifications are a common feature in modern systems, and the example mirrors real-world product requirements.
// ### Possible Extensions:
//   If you're exploring additional power, consider:
// - **Pre- and Post-hooks**: Add hooks in the base class for more fine-grained control over the workflow (e.g., pre-validation or post-logging).
// - **Configuration Options**: Add configurable options to the template (e.g., retry mechanisms or priority levels).
// - **Async/Await**: Adapt the template to handle asynchronous workflows.
// ### Conclusion:
// This example showcases the full potential of the **Template Pattern** for real-world use cases. It’s practical, extensible, and adheres to product-based standards. It’s unlikely you’d need to go beyond this structure for most scenarios involving the **Template Pattern**.
//# sourceMappingURL=01.js.map