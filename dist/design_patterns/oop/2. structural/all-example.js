"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = exports.Button = exports.RateLimitedAPIClient = exports.BaseAPIClient = exports.VideoProcessor = exports.PaymentSystemAdapter = void 0;
// Legacy API we need to work with
class LegacyPaymentSystem {
    async makePayment(_amountInCents) {
        // Legacy implementation
        return 'SUCCESS';
    }
}
// Adapter to make legacy system work with modern interface
class PaymentSystemAdapter {
    constructor(legacySystem) {
        this.legacySystem = legacySystem;
    }
    async processPayment(amount, _currency) {
        try {
            const amountInCents = amount * 100;
            const result = await this.legacySystem.makePayment(amountInCents);
            return result === 'SUCCESS';
        }
        catch (error) {
            console.error('Payment failed:', error);
            return false;
        }
    }
}
exports.PaymentSystemAdapter = PaymentSystemAdapter;
// Added missing video processing related classes
class VideoValidator {
    async validate(_file) {
        // Validation logic here
        return true;
    }
}
class VideoCompressor {
    async compress(file) {
        // Compression logic here
        return file;
    }
}
class VideoTranscoder {
    async transcode(file) {
        // Transcoding logic here
        return file;
    }
}
class CloudUploader {
    async upload(_file) {
        // Upload logic here
        return 'https://cloud-storage.com/video-url';
    }
}
// FACADE PATTERN
// Real-world example: Video Processing Service
class VideoProcessor {
    async process(videoFile) {
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
        }
        catch (error) {
            throw new Error(`Video processing failed: ${error.message}`);
        }
    }
}
exports.VideoProcessor = VideoProcessor;
class BaseAPIClient {
    async fetch(url) {
        const response = await fetch(url);
        return response.json();
    }
}
exports.BaseAPIClient = BaseAPIClient;
// Rate Limiting Decorator
class RateLimitedAPIClient {
    constructor(client, limitPerMinute = 60) {
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
        this.client = client;
        this.limit = limitPerMinute;
        this.windowMs = 60000; // 1 minute
    }
    async fetch(url) {
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
exports.RateLimitedAPIClient = RateLimitedAPIClient;
class Button {
    constructor(label) {
        this.label = label;
    }
    render() {
        return `<button>${this.label}</button>`;
    }
}
exports.Button = Button;
class Container {
    constructor() {
        this.children = [];
    }
    addChild(child) {
        this.children.push(child);
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
    render() {
        return `<div>${this.children.map(child => child.render()).join('')}</div>`;
    }
}
exports.Container = Container;
//# sourceMappingURL=all-example.js.map