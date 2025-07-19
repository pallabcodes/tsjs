"use strict";
// When Object Construction is Time-Consuming
class NetworkRequest {
    constructor(method, headers, // Changed object to Record<string, string>
    body) {
        this.method = method;
        this.headers = headers;
        this.body = body;
    }
}
class AsyncNetworkRequestBuilder {
    constructor() {
        this.method = 'GET';
        this.headers = {}; // Updated type to Record<string, string>
        this.body = null;
    }
    async setMethod(method) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.method = method;
        return this;
    }
    async setHeaders(headers) {
        // Updated type to Record<string, string>
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        this.headers = headers;
        return this;
    }
    async setBody(body) {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 500));
        this.body = body;
        return this;
    }
    async build() {
        // Asynchronous build
        await new Promise(resolve => setTimeout(resolve, 500));
        return new NetworkRequest(this.method, this.headers, this.body);
    }
}
// Usage
(async () => {
    // Corrected: Ensure async methods are chained properly
    const builder = new AsyncNetworkRequestBuilder();
    const request = await builder
        .setMethod('POST')
        .then(() => builder.setHeaders({ 'Content-Type': 'application/json' }))
        .then(() => builder.setBody(JSON.stringify({ key: 'value' })))
        .then(() => builder.build());
    console.log(request);
})();
//# sourceMappingURL=08.js.map