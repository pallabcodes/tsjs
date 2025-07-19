"use strict";
// Common use cases for the Observer Pattern:
//
// 1. Event Management Systems
//    - User interface event handling
//    - Custom event systems
//    - Input handling in games
//
// 2. Real-time Data Monitoring
//    - Stock market price tracking
//    - System resource monitoring
//    - IoT sensor data handling
//
// 3. Progress Tracking
//    - File upload/download progress
//    - Long-running task status
//    - Build/deployment progress
//
// 4. State Synchronization
//    - Distributed systems sync
//    - Multi-user collaboration
//    - Real-time data replication
//
// 5. Notification Systems
//    - Push notifications
//    - Email alerts
//    - In-app notifications
//
// Here are production-ready examples for each category:
class AnalyticsTracker {
    constructor() {
        this.observers = new Set();
    }
    static getInstance() {
        if (!AnalyticsTracker.instance) {
            AnalyticsTracker.instance = new AnalyticsTracker();
        }
        return AnalyticsTracker.instance;
    }
    subscribe(observer) {
        this.observers.add(observer);
    }
    unsubscribe(observer) {
        this.observers.delete(observer);
    }
    async trackEvent(eventName, metadata = {}) {
        const event = {
            eventName,
            timestamp: Date.now(),
            metadata,
        };
        const trackingPromises = Array.from(this.observers).map(observer => observer.update(event).catch(error => {
            console.error(`Analytics observer error: ${error}`);
        }));
        await Promise.all(trackingPromises);
    }
}
// Example analytics observers
class GoogleAnalyticsObserver {
    async update(event) {
        // Production implementation would use actual GA SDK
        console.log(`GA tracking: ${event.eventName}`, event.metadata);
    }
}
class MixpanelObserver {
    async update(event) {
        // Production implementation would use actual Mixpanel SDK
        console.log(`Mixpanel tracking: ${event.eventName}`, event.metadata);
    }
}
class StockMarketMonitor {
    constructor() {
        this.observers = new Map();
        this.prices = new Map();
    }
    subscribe(symbol, observer) {
        if (!this.observers.has(symbol)) {
            this.observers.set(symbol, new Set());
        }
        this.observers.get(symbol).add(observer);
        // Send current price if available
        const currentPrice = this.prices.get(symbol);
        if (currentPrice) {
            observer.onPriceUpdate(currentPrice);
        }
    }
    unsubscribe(symbol, observer) {
        const symbolObservers = this.observers.get(symbol);
        if (symbolObservers) {
            symbolObservers.delete(observer);
            if (symbolObservers.size === 0) {
                this.observers.delete(symbol);
            }
        }
    }
    updatePrice(symbol, newPrice) {
        const priceUpdate = {
            symbol,
            price: newPrice,
            timestamp: Date.now(),
        };
        this.prices.set(symbol, priceUpdate);
        const symbolObservers = this.observers.get(symbol);
        if (symbolObservers) {
            symbolObservers.forEach(observer => {
                try {
                    observer.onPriceUpdate(priceUpdate);
                }
                catch (error) {
                    console.error(`Error notifying observer for ${symbol}:`, error);
                }
            });
        }
    }
}
class FileUploadManager {
    constructor() {
        this.observers = new Map();
        this.uploadStates = new Map();
    }
    subscribeToFile(fileId, observer) {
        if (!this.observers.has(fileId)) {
            this.observers.set(fileId, new Set());
        }
        this.observers.get(fileId).add(observer);
        // Send current state if available
        const currentState = this.uploadStates.get(fileId);
        if (currentState) {
            observer.onProgressUpdate(currentState);
        }
    }
    unsubscribeFromFile(fileId, observer) {
        const fileObservers = this.observers.get(fileId);
        if (fileObservers) {
            fileObservers.delete(observer);
            if (fileObservers.size === 0) {
                this.observers.delete(fileId);
            }
        }
    }
    async uploadFile(fileId, file) {
        const initialState = {
            fileId,
            bytesUploaded: 0,
            totalBytes: file.size,
            status: 'pending',
        };
        this.updateProgress(initialState);
        try {
            // Simulated chunk upload with progress
            const chunkSize = 1024 * 1024; // 1MB chunks
            let bytesUploaded = 0;
            while (bytesUploaded < file.size) {
                const chunk = file.slice(bytesUploaded, bytesUploaded + chunkSize);
                await this.uploadChunk(chunk);
                bytesUploaded += chunk.size;
                this.updateProgress({
                    fileId,
                    bytesUploaded,
                    totalBytes: file.size,
                    status: 'uploading',
                });
            }
            this.updateProgress({
                fileId,
                bytesUploaded: file.size,
                totalBytes: file.size,
                status: 'completed',
            });
        }
        catch (error) {
            this.updateProgress({
                fileId,
                bytesUploaded: 0,
                totalBytes: file.size,
                status: 'error',
                error: error instanceof Error ? error : new Error(String(error)),
            });
            throw error;
        }
    }
    async uploadChunk(_chunk) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    updateProgress(progress) {
        this.uploadStates.set(progress.fileId, progress);
        const fileObservers = this.observers.get(progress.fileId);
        if (fileObservers) {
            fileObservers.forEach(observer => {
                try {
                    observer.onProgressUpdate(progress);
                }
                catch (error) {
                    console.error(`Error notifying upload observer:`, error);
                }
            });
        }
    }
}
// Example usage:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function demonstratePatterns() {
    // 1. Analytics tracking
    const analytics = AnalyticsTracker.getInstance();
    analytics.subscribe(new GoogleAnalyticsObserver());
    analytics.subscribe(new MixpanelObserver());
    await analytics.trackEvent('user_login', { userId: '123' });
    // 2. Stock market monitoring
    const stockMonitor = new StockMarketMonitor();
    const appleStockObserver = {
        onPriceUpdate(price) {
            console.log(`AAPL price: $${price.price}`);
        },
    };
    stockMonitor.subscribe('AAPL', appleStockObserver);
    stockMonitor.updatePrice('AAPL', 150.5);
    // 3. File upload
    const uploadManager = new FileUploadManager();
    const progressObserver = {
        onProgressUpdate(progress) {
            const percentage = (progress.bytesUploaded / progress.totalBytes) * 100;
            console.log(`Upload progress: ${percentage.toFixed(2)}%`);
        },
    };
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    uploadManager.subscribeToFile('file1', progressObserver);
    await uploadManager.uploadFile('file1', file);
}
//# sourceMappingURL=all-usage.js.map