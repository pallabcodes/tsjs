"use strict";
// use: API Request Construction
class APIRequest {
    constructor(method, headers, body) {
        this.method = method;
        this.headers = headers;
        this.body = body;
    }
}
class APIRequestBuilder {
    constructor() {
        this.method = 'GET';
        this.headers = {};
        this.body = {};
    }
    setMethod(method) {
        this.method = method;
        return this;
    }
    setHeaders(headers) {
        this.headers = headers;
        return this;
    }
    setBody(body) {
        this.body = body;
        return this;
    }
    build() {
        return new APIRequest(this.method, this.headers, this.body);
    }
}
// Usage
const request = new APIRequestBuilder()
    .setMethod('POST')
    .setHeaders({ 'Content-Type': 'application/json' })
    .setBody({ user: 'John Doe' })
    .build();
console.log(request);
//# sourceMappingURL=14.js.map