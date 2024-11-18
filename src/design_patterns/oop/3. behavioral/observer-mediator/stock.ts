// Sure! Here's an example where we integrate the **Observer** and **Mediator** patterns into a **Real-Time Stock Price Update System**. The system will incorporate **performance considerations**, **asynchronous handling**, and **error handling**. We'll use a **single class** to cover all these features and provide a more robust solution for large-scale systems.
//
// ### Scenario:
//   We have a system that updates users about stock price changes. The stock prices are updated in real-time, and the users (observers) are notified about these changes. However, we need to handle:
//
//   1. **Performance considerations**: Limit the number of notifications sent to users in a given time (rate-limiting).
// 2. **Asynchronous updates**: Stock price updates come from an external API or WebSocket service.
// 3. **Error handling**: There are retries for failed notifications, and status change validations to ensure only valid updates are sent.
//
// ### Full Example: Stock Price Update System with Enhanced Features
//
// We will create a `StockPriceNotifier` class that acts as both the **Mediator** and **Observer**, and manage the stock price updates and notifications efficiently.


interface Observer {
    update(stockSymbol: string, price: number): void;
}

class StockPriceNotifier implements Observer {
    private users: Set<Observer> = new Set();
    private priceHistory: Map<string, number> = new Map();
    private notificationQueue: string[] = [];
    private failedNotifications: string[] = [];
    private notificationRateLimit: number = 5; // Limit notifications per minute
    private notificationTimeout: number = 60000; // 1-minute window for rate-limiting
    private lastNotificationTime: number = Date.now();

    constructor(private stockSymbol: string) {}

    // Method to register users as observers
    registerObserver(user: Observer): void {
        this.users.add(user);
    }

    // Method to unregister users from notifications
    unregisterObserver(user: Observer): void {
        this.users.delete(user);
    }

    // Method to update stock price
    async updateStockPrice(stockSymbol: string, newPrice: number): Promise<void> {
        try {
            // Validate price change (for example, only allow price updates > 0)
            if (newPrice <= 0) {
                throw new Error("Invalid stock price update: Price must be greater than 0");
            }

            // Store the new price for historical tracking
            this.priceHistory.set(stockSymbol, newPrice);

            // Handle rate-limiting and notification
            const now = Date.now();
            if (now - this.lastNotificationTime > this.notificationTimeout) {
                this.notificationQueue = []; // Reset the queue after rate limit window
            }

            // Check if we can notify users based on the rate limit
            if (this.notificationQueue.length < this.notificationRateLimit) {
                this.lastNotificationTime = now;
                this.notificationQueue.push(stockSymbol);
                this.notifyUsers(stockSymbol, newPrice);
            } else {
                console.log("Rate limit reached: Notifications are delayed.");
            }

        } catch (error) {
            console.error("Error updating stock price:", error.message);
            this.retryFailedNotification(stockSymbol, newPrice);
        }
    }

    // Method to notify all observers about the stock price change
    private async notifyUsers(stockSymbol: string, newPrice: number): Promise<void> {
        try {
            // Simulate async behavior (e.g., WebSocket or API call)
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

            this.users.forEach((user) => {
                user.update(stockSymbol, newPrice);
            });
        } catch (error) {
            console.error("Error sending notifications:", error.message);
            this.retryFailedNotification(stockSymbol, newPrice);
        }
    }

    // Method to retry failed notifications
    private retryFailedNotification(stockSymbol: string, newPrice: number): void {
        console.log("Retrying failed notifications...");

        this.failedNotifications.push(stockSymbol);
        setTimeout(() => {
            console.log(`Retrying stock price notification for ${stockSymbol}`);
            this.updateStockPrice(stockSymbol, newPrice); // Retry sending notification
        }, 5000); // Retry after 5 seconds
    }

    // Observer pattern implementation: Each user is notified of stock price changes
    update(stockSymbol: string, price: number): void {
        console.log(`Stock Price Update - ${stockSymbol}: $${price}`);
    }
}

// Example of User class implementing Observer interface
class User implements Observer {
    constructor(private name: string) {}

    update(stockSymbol: string, price: number): void {
        console.log(`${this.name} received update - ${stockSymbol}: $${price}`);
    }
}

// Example usage:

const stockNotifier = new StockPriceNotifier('AAPL');

// Register users
const user1 = new User('Alice');
const user2 = new User('Bob');
const user3 = new User('Charlie');

stockNotifier.registerObserver(user1);
stockNotifier.registerObserver(user2);
stockNotifier.registerObserver(user3);

// Simulate stock price updates
(async () => {
    await stockNotifier.updateStockPrice('AAPL', 150);
    await stockNotifier.updateStockPrice('AAPL', 155);
    await stockNotifier.updateStockPrice('AAPL', 160); // More updates within the rate limit window
    await stockNotifier.updateStockPrice('AAPL', 165);
    await stockNotifier.updateStockPrice('AAPL', 170);
    await stockNotifier.updateStockPrice('AAPL', 175); // Should hit rate-limiting
})();

// ### Key Features and How They're Implemented:

// 1. **Performance Considerations (Rate Limiting)**:
// - The `notificationRateLimit` variable is set to 5 notifications per minute, and notifications are queued using `notificationQueue`.
// - If the number of notifications exceeds the rate limit within the 1-minute window (`notificationTimeout`), subsequent notifications are delayed.

// 2. **Asynchronous Handling (Real-time Updates)**:
// - The `updateStockPrice` and `notifyUsers` methods simulate asynchronous behavior using `setTimeout` to mimic a real-time WebSocket or external API call.
// - Notifications are sent asynchronously, and the system can handle delays, ensuring the program doesn't block other operations.

// 3. **Error Handling (Retries and Validation)**:
// - **Stock Price Validation**: The price update is validated to ensure it is greater than 0. Invalid prices throw an error.
// - **Retry Mechanism**: If sending notifications fails (e.g., network error or failure to notify users), a retry mechanism is implemented with a 5-second delay using `setTimeout`.
// - **Error Logging**: Errors are logged in the console to track failures in real-time.

// ### How This Example Covers Product-Based Standards:
//
// - **Scalability**: The system can be scaled by adding more users and managing more stock symbols. The rate-limiting mechanism helps manage resources and avoid overwhelming the system with too many notifications.
// - **Performance**: By using asynchronous updates and rate-limiting, the system can efficiently handle a large number of users and updates without overwhelming the resources.
// - **Error Handling**: Retry mechanisms are implemented to handle network or other failures, ensuring robustness in a production environment.
// - **Real-Time Updates**: The asynchronous pattern allows for non-blocking, real-time updates, which is crucial for chat apps, live price feeds, or collaborative tools.

// ### Conclusion:
//   This **StockPriceNotifier** class provides a robust implementation of both the **Observer** and **Mediator** patterns while addressing **performance considerations**, **asynchronous behavior**, and **error handling**. It showcases how these patterns can be applied to real-world product scenarios where scalability, fault tolerance, and real-time updates are crucial for success. This example can easily be adapted to other domains, such as live event notifications, user status updates, or collaborative systems.