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

// 1. Event Management System Example
// Real-world use case: Analytics tracking system that monitors user interactions

interface AnalyticsEvent {
  eventName: string;
  timestamp: number;
  metadata: Record<string, any>;
}

interface AnalyticsObserver {
  update(event: AnalyticsEvent): Promise<void>;
}

class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private observers: Set<AnalyticsObserver>;
  private constructor() {
    this.observers = new Set();
  }

  static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  subscribe(observer: AnalyticsObserver): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: AnalyticsObserver): void {
    this.observers.delete(observer);
  }

  async trackEvent(
    eventName: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const event: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      metadata,
    };

    const trackingPromises = Array.from(this.observers).map(observer =>
      observer.update(event).catch(error => {
        console.error(`Analytics observer error: ${error}`);
      })
    );

    await Promise.all(trackingPromises);
  }
}

// Example analytics observers
class GoogleAnalyticsObserver implements AnalyticsObserver {
  async update(event: AnalyticsEvent): Promise<void> {
    // Production implementation would use actual GA SDK
    console.log(`GA tracking: ${event.eventName}`, event.metadata);
  }
}

class MixpanelObserver implements AnalyticsObserver {
  async update(event: AnalyticsEvent): Promise<void> {
    // Production implementation would use actual Mixpanel SDK
    console.log(`Mixpanel tracking: ${event.eventName}`, event.metadata);
  }
}

// 2. Real-time Data Monitoring Example
// Real-world use case: Stock price monitoring system

interface StockPrice {
  symbol: string;
  price: number;
  timestamp: number;
}

interface StockPriceObserver {
  onPriceUpdate(price: StockPrice): void;
}

class StockMarketMonitor {
  private observers: Map<string, Set<StockPriceObserver>>;
  private prices: Map<string, StockPrice>;

  constructor() {
    this.observers = new Map();
    this.prices = new Map();
  }

  subscribe(symbol: string, observer: StockPriceObserver): void {
    if (!this.observers.has(symbol)) {
      this.observers.set(symbol, new Set());
    }
    this.observers.get(symbol)!.add(observer);

    // Send current price if available
    const currentPrice = this.prices.get(symbol);
    if (currentPrice) {
      observer.onPriceUpdate(currentPrice);
    }
  }

  unsubscribe(symbol: string, observer: StockPriceObserver): void {
    const symbolObservers = this.observers.get(symbol);
    if (symbolObservers) {
      symbolObservers.delete(observer);
      if (symbolObservers.size === 0) {
        this.observers.delete(symbol);
      }
    }
  }

  updatePrice(symbol: string, newPrice: number): void {
    const priceUpdate: StockPrice = {
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
        } catch (error) {
          console.error(`Error notifying observer for ${symbol}:`, error);
        }
      });
    }
  }
}

// 3. Progress Tracking Example
// Real-world use case: File upload system with multiple progress listeners

interface UploadProgress {
  fileId: string;
  bytesUploaded: number;
  totalBytes: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: Error;
}

interface UploadProgressObserver {
  onProgressUpdate(progress: UploadProgress): void;
}

class FileUploadManager {
  private observers: Map<string, Set<UploadProgressObserver>>;
  private uploadStates: Map<string, UploadProgress>;

  constructor() {
    this.observers = new Map();
    this.uploadStates = new Map();
  }

  subscribeToFile(fileId: string, observer: UploadProgressObserver): void {
    if (!this.observers.has(fileId)) {
      this.observers.set(fileId, new Set());
    }
    this.observers.get(fileId)!.add(observer);

    // Send current state if available
    const currentState = this.uploadStates.get(fileId);
    if (currentState) {
      observer.onProgressUpdate(currentState);
    }
  }

  unsubscribeFromFile(fileId: string, observer: UploadProgressObserver): void {
    const fileObservers = this.observers.get(fileId);
    if (fileObservers) {
      fileObservers.delete(observer);
      if (fileObservers.size === 0) {
        this.observers.delete(fileId);
      }
    }
  }

  async uploadFile(fileId: string, file: File): Promise<void> {
    const initialState: UploadProgress = {
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
    } catch (error) {
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

  private async uploadChunk(_chunk: Blob): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private updateProgress(progress: UploadProgress): void {
    this.uploadStates.set(progress.fileId, progress);

    const fileObservers = this.observers.get(progress.fileId);
    if (fileObservers) {
      fileObservers.forEach(observer => {
        try {
          observer.onProgressUpdate(progress);
        } catch (error) {
          console.error(`Error notifying upload observer:`, error);
        }
      });
    }
  }
}

// Example usage:
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function demonstratePatterns(): Promise<void> {
  // 1. Analytics tracking
  const analytics = AnalyticsTracker.getInstance();
  analytics.subscribe(new GoogleAnalyticsObserver());
  analytics.subscribe(new MixpanelObserver());
  await analytics.trackEvent('user_login', { userId: '123' });

  // 2. Stock market monitoring
  const stockMonitor = new StockMarketMonitor();
  const appleStockObserver: StockPriceObserver = {
    onPriceUpdate(price: StockPrice) {
      console.log(`AAPL price: $${price.price}`);
    },
  };
  stockMonitor.subscribe('AAPL', appleStockObserver);
  stockMonitor.updatePrice('AAPL', 150.5);

  // 3. File upload
  const uploadManager = new FileUploadManager();
  const progressObserver: UploadProgressObserver = {
    onProgressUpdate(progress: UploadProgress) {
      const percentage = (progress.bytesUploaded / progress.totalBytes) * 100;
      console.log(`Upload progress: ${percentage.toFixed(2)}%`);
    },
  };

  const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  uploadManager.subscribeToFile('file1', progressObserver);
  await uploadManager.uploadFile('file1', file);
}
