// Strategy Pattern Use Cases:
// 1. Payment Processing Systems
//    - Different payment methods (Credit Card, PayPal, Crypto)
//    - Various payment gateways
//    - International payment handling

// 2. Authentication Mechanisms
//    - OAuth providers
//    - Password-based auth
//    - Biometric authentication
//    - SSO implementations

// 3. Data Export/Import Formats
//    - CSV, JSON, XML processing
//    - Different file format handlers
//    - Data transformation pipelines

// 4. Shipping Cost Calculation
//    - Different courier services
//    - International vs domestic shipping
//    - Weight-based vs distance-based pricing

// 5. Tax Calculation Systems
//    - Different country tax rules
//    - Various tax brackets
//    - Special tax zones handling

// 6. Content Rendering
//    - Mobile vs desktop layouts
//    - Different themes/styles
//    - Accessibility modes

// 7. Search Algorithms
//    - Different search methods
//    - Various sorting strategies
//    - Filter implementations

// 8. Notification Systems
//    - Email, SMS, Push notifications
//    - Different notification providers
//    - Priority-based notifications

// 9. Compression Algorithms
//    - Image compression
//    - Data compression
//    - Video compression

// 10. Pricing Strategies
//    - Seasonal pricing
//    - Volume-based pricing
//    - Customer tier pricing

// Here are three detailed, production-grade examples:

// 1. Payment Processing Example
// Type-safe payment processing with multiple providers

interface PaymentResult {
  success: boolean;
  transactionId: string;
  timestamp: Date;
  amount: number;
  currency: string;
  error?: string;
}

interface PaymentDetails {
  amount: number;
  currency: string;
  customerId: string;
  metadata: Record<string, unknown>;
}

interface PaymentProcessingStrategy {
  processPayment(details: PaymentDetails): Promise<PaymentResult>;
  validatePaymentDetails(details: PaymentDetails): boolean;
  getProviderName(): string;
  pay(amount: number): Promise<PaymentResult>;
  refund(transactionId: string): Promise<PaymentResult>;
}

export class StripePaymentStrategy implements PaymentProcessingStrategy {
  private readonly apiKey: string;
  private readonly apiEndpoint: string;

  constructor(apiKey: string, apiEndpoint: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = apiEndpoint;
  }

  async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      if (!this.validatePaymentDetails(details)) {
        throw new Error('Invalid payment details');
      }

      // Simulated Stripe API call
      await this.makeStripeRequest(details);

      return {
        success: true,
        transactionId: `stripe_${Date.now()}`,
        timestamp: new Date(),
        amount: details.amount,
        currency: details.currency,
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        timestamp: new Date(),
        amount: details.amount,
        currency: details.currency,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  validatePaymentDetails(details: PaymentDetails): boolean {
    return (
      details.amount > 0 &&
      details.currency.length === 3 &&
      details.customerId.length > 0
    );
  }

  getProviderName(): string {
    return 'Stripe';
  }

  private async makeStripeRequest(_details: PaymentDetails): Promise<unknown> {
    // Actual Stripe API implementation would go here
    return Promise.resolve({ id: `stripe_${Date.now()}` });
  }

  async pay(amount: number): Promise<PaymentResult> {
    return this.processPayment({
      amount,
      currency: 'USD',
      customerId: 'default',
      metadata: {},
    });
  }

  async refund(transactionId: string): Promise<PaymentResult> {
    try {
      return {
        success: true,
        transactionId: `refund_${transactionId}`,
        timestamp: new Date(),
        amount: 0,
        currency: 'USD',
      };
    } catch (error) {
      return {
        success: false,
        transactionId: '',
        timestamp: new Date(),
        amount: 0,
        currency: 'USD',
        error: error instanceof Error ? error.message : 'Refund failed',
      };
    }
  }
}

// 2. Authentication Strategy Example
// Type-safe authentication handling with multiple providers

interface AuthCredentials {
  username: string;
  password?: string;
  token?: string;
  provider?: string;
}

interface AuthResult {
  success: boolean;
  userId?: string;
  token?: string;
  expiresAt?: Date;
  error?: string;
}

interface AuthStrategy {
  authenticate(credentials: AuthCredentials): Promise<AuthResult>;
  validateCredentials(credentials: AuthCredentials): boolean;
  refreshToken?(token: string): Promise<AuthResult>;
}

export class OAuth2Strategy implements AuthStrategy {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly provider: string;

  constructor(clientId: string, clientSecret: string, provider: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.provider = provider;
  }

  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    try {
      if (!this.validateCredentials(credentials)) {
        throw new Error('Invalid OAuth credentials');
      }

      // Simulated OAuth flow
      const authResult = await this.performOAuthFlow(credentials);

      return {
        success: true,
        userId: authResult.userId,
        token: authResult.accessToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  validateCredentials(credentials: AuthCredentials): boolean {
    return Boolean(credentials.token && credentials.provider === this.provider);
  }

  async refreshToken(token: string): Promise<AuthResult> {
    try {
      // Simulated token refresh
      const refreshResult = await this.performTokenRefresh(token);

      return {
        success: true,
        token: refreshResult.newToken,
        expiresAt: new Date(Date.now() + 3600000),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed',
      };
    }
  }

  private async performOAuthFlow(
    _credentials: AuthCredentials
  ): Promise<{ userId: string; accessToken: string }> {
    // Real OAuth implementation would go here
    return Promise.resolve({
      userId: `user_${Date.now()}`,
      accessToken: `token_${Date.now()}`,
    });
  }

  private async performTokenRefresh(
    _token: string
  ): Promise<{ newToken: string }> {
    // Real token refresh implementation would go here
    return Promise.resolve({
      newToken: `refreshed_token_${Date.now()}`,
    });
  }
}

// 3. Export Strategy Example
// Type-safe data export handling with multiple formats

interface ExportOptions {
  format: string;
  compression?: boolean;
  includeMetadata?: boolean;
  filters?: Record<string, unknown>;
}

interface ExportResult {
  success: boolean;
  data: Buffer | string;
  metadata?: Record<string, unknown>;
  error?: string;
}

interface ExportStrategy {
  export(data: unknown[], options: ExportOptions): Promise<ExportResult>;
  validateData(data: unknown[]): boolean;
  getContentType(): string;
}

class CSVExportStrategy implements ExportStrategy {
  private readonly delimiter: string;
  private readonly includeHeaders: boolean;

  constructor(delimiter = ',', includeHeaders = true) {
    this.delimiter = delimiter;
    this.includeHeaders = includeHeaders;
  }

  async export(data: unknown[], options: ExportOptions): Promise<ExportResult> {
    try {
      if (!this.validateData(data)) {
        throw new Error('Invalid data format for CSV export');
      }

      const csvData = await this.convertToCSV(data);
      const compressedData = options.compression
        ? await this.compressData(csvData)
        : csvData;

      return {
        success: true,
        data: compressedData,
        metadata: options.includeMetadata
          ? {
              rowCount: data.length,
              format: 'CSV',
              compressed: options.compression,
              generatedAt: new Date().toISOString(),
            }
          : undefined,
      };
    } catch (error) {
      return {
        success: false,
        data: '',
        error: error instanceof Error ? error.message : 'Export failed',
      };
    }
  }

  validateData(data: unknown[]): boolean {
    return (
      Array.isArray(data) &&
      data.every(item => item !== null && typeof item === 'object')
    );
  }

  getContentType(): string {
    return 'text/csv';
  }

  private async convertToCSV(data: unknown[]): Promise<string> {
    if (!data.length) return '';

    const headers = Object.keys(data[0] as Record<string, unknown>);
    const rows = data.map(item =>
      headers
        .map(header =>
          this.escapeCsvValue((item as Record<string, unknown>)[header])
        )
        .join(this.delimiter)
    );

    return this.includeHeaders
      ? [headers.join(this.delimiter), ...rows].join('\n')
      : rows.join('\n');
  }

  private escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    return stringValue.includes(this.delimiter) || stringValue.includes('\n')
      ? `"${stringValue.replace(/"/g, '""')}"`
      : stringValue;
  }

  private async compressData(data: string): Promise<string> {
    // Real compression implementation would go here
    return data; // Simplified for example
  }
}

// Usage examples:

export async function executePayment(
  strategy: PaymentProcessingStrategy,
  payment: PaymentDetails
): Promise<void> {
  const result = await strategy.processPayment(payment);
  if (!result.success) {
    console.error(`Payment failed: ${result.error}`);
    return;
  }
  console.log(`Payment successful: ${result.transactionId}`);
}

export async function authenticateUser(
  strategy: AuthStrategy,
  credentials: AuthCredentials
): Promise<void> {
  const result = await strategy.authenticate(credentials);
  if (!result.success) {
    console.error(`Authentication failed: ${result.error}`);
    return;
  }
  console.log(`User authenticated: ${result.userId}`);
}

export async function exportData(
  strategy: ExportStrategy,
  data: unknown[],
  options: ExportOptions
): Promise<void> {
  const result = await strategy.export(data, options);
  if (!result.success) {
    console.error(`Export failed: ${result.error}`);
    return;
  }
  console.log(`Data exported successfully: ${result.metadata?.rowCount} rows`);
}

// Example usage of CSVExportStrategy
const csvStrategy = new CSVExportStrategy(',', true);
exportData(csvStrategy, [{ name: 'John', age: 30 }], { format: 'csv' });
