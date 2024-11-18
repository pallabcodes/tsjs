// use: API Request Construction

interface RequestBuilder {
  setMethod(method: string): this;
  setHeaders(headers: object): this;
  setBody(body: object): this;
  build(): APIRequest;
}

class APIRequest {
  constructor(
    public method: string,
    public headers: object,
    public body: object
  ) {}
}

class APIRequestBuilder implements RequestBuilder {
  private method = 'GET';
  private headers: object = {};
  private body: object = {};

  setMethod(method: string): this {
    this.method = method;
    return this;
  }
  setHeaders(headers: object): this {
    this.headers = headers;
    return this;
  }
  setBody(body: object): this {
    this.body = body;
    return this;
  }
  build(): APIRequest {
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
