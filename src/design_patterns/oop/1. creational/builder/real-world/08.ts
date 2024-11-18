// When Object Construction is Time-Consuming

class NetworkRequest {
    constructor(
        public method: string,
        public headers: Record<string, string>,  // Changed object to Record<string, string>
        public body: string | null
    ) {}
}

interface NetworkRequestBuilder {
    setMethod(method: string): Promise<this>;  // Changed return type to Promise<this>
    setHeaders(headers: Record<string, string>): Promise<this>;  // Changed return type to Promise<this>
    setBody(body: string | null): Promise<this>;  // Changed return type to Promise<this>
    build(): Promise<NetworkRequest>;
}

class AsyncNetworkRequestBuilder implements NetworkRequestBuilder {
    private method: string = "GET";
    private headers: Record<string, string> = {};  // Updated type to Record<string, string>
    private body: string | null = null;

    async setMethod(method: string): Promise<this> {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.method = method;
        return this;
    }

    async setHeaders(headers: Record<string, string>): Promise<this> {  // Updated type to Record<string, string>
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.headers = headers;
        return this;
    }

    async setBody(body: string | null): Promise<this> {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.body = body;
        return this;
    }

    async build(): Promise<NetworkRequest> {
        // Asynchronous build
        await new Promise((resolve) => setTimeout(resolve, 500));
        return new NetworkRequest(this.method, this.headers, this.body);
    }
}

// Usage
(async () => {
    // Corrected: Ensure async methods are chained properly
    const builder = new AsyncNetworkRequestBuilder();
    const request = await builder
        .setMethod("POST")
        .then(() => builder.setHeaders({ "Content-Type": "application/json" }))
        .then(() => builder.setBody(JSON.stringify({ key: "value" })))
        .then(() => builder.build());

    console.log(request);
})();
