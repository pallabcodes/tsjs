// ADAPTER PATTERN
// Real-world example: Third-party API integration
interface ModernPaymentAPI {
    processPayment(amount: number, currency: string): Promise<boolean>;
}

// Legacy API we need to work with
class LegacyPaymentSystem {
    async makePayment(amountInCents: number): Promise<string> {
        // Legacy implementation
        return "SUCCESS";
    }
}

// Adapter to make legacy system work with modern interface
class PaymentSystemAdapter implements ModernPaymentAPI {
    private legacySystem: LegacyPaymentSystem;

    constructor(legacySystem: LegacyPaymentSystem) {
        this.legacySystem = legacySystem;
    }

    async processPayment(amount: number, currency: string): Promise<boolean> {
        try {
            const amountInCents = amount * 100;
            const result = await this.legacySystem.makePayment(amountInCents);
            return result === "SUCCESS";
        } catch (error) {
            console.error("Payment failed:", error);
            return false;
        }
    }
}

// FACADE PATTERN
// Real-world example: Video Processing Service
class VideoProcessor {
    async process(videoFile: File): Promise<string> {
        // Complex video processing logic
        const validator = new VideoValidator();
        const compressor = new VideoCompressor();
        const transcoder = new VideoTranscoder();
        const uploader = new CloudUploader();

        try {
            // Validate video
            await validator.validate(videoFile);

            // Process video
            const compressed = await compressor.compress(videoFile);
            const transcoded = await transcoder.transcode(compressed);

            // Upload to cloud
            const url = await uploader.upload(transcoded);

            return url;
        } catch (error) {
            throw new Error(`Video processing failed: ${error.message}`);
        }
    }
}

// DECORATOR PATTERN
// Real-world example: API Rate Limiting and Caching
interface APIClient {
    fetch(url: string): Promise<any>;
}

class BaseAPIClient implements APIClient {
    async fetch(url: string): Promise<any> {
        const response = await fetch(url);
        return response.json();
    }
}

// Rate Limiting Decorator
class RateLimitedAPIClient implements APIClient {
    private client: APIClient;
    private requestCount: number = 0;
    private lastRequestTime: number = Date.now();
    private readonly limit: number;
    private readonly windowMs: number;

    constructor(client: APIClient, limitPerMinute: number = 60) {
        this.client = client;
        this.limit = limitPerMinute;
        this.windowMs = 60000; // 1 minute
    }

    async fetch(url: string): Promise<any> {
        const now = Date.now();
        if (now - this.lastRequestTime > this.windowMs) {
            this.requestCount = 0;
            this.lastRequestTime = now;
        }

        if (this.requestCount >= this.limit) {
            throw new Error('Rate limit exceeded');
        }

        this.requestCount++;
        return this.client.fetch(url);
    }
}

// COMPOSITE PATTERN
// Real-world example: UI Component Tree
interface UIComponent {
    render(): string;
    addChild?(child: UIComponent): void;
    removeChild?(child: UIComponent): void;
}

class Button implements UIComponent {
    constructor(private label: string) {}

    render(): string {
        return `<button>${this.label}</button>`;
    }
}

class Container implements UIComponent {
    private children: UIComponent[] = [];

    addChild(child: UIComponent): void {
        this.children.push(child);
    }

    removeChild(child: UIComponent): void {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }

    render(): string {
        return `<div>${this.children.map(child => child.render()).join('')}</div>`;
    }
}