"use strict";
// Strategy Pattern Use Cases:
// 1. Payment Processing Systems
//    - Different payment methods (Credit Card, PayPal, Crypto)
//    - Various payment gateways
//    - International payment handling
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Strategy = exports.StripePaymentStrategy = void 0;
exports.executePayment = executePayment;
exports.authenticateUser = authenticateUser;
exports.exportData = exportData;
class StripePaymentStrategy {
    constructor(apiKey, apiEndpoint) {
        this.apiKey = apiKey;
        this.apiEndpoint = apiEndpoint;
    }
    async processPayment(details) {
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
        }
        catch (error) {
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
    validatePaymentDetails(details) {
        return (details.amount > 0 &&
            details.currency.length === 3 &&
            details.customerId.length > 0);
    }
    getProviderName() {
        return 'Stripe';
    }
    async makeStripeRequest(_details) {
        // Actual Stripe API implementation would go here
        return Promise.resolve({ id: `stripe_${Date.now()}` });
    }
    async pay(amount) {
        return this.processPayment({
            amount,
            currency: 'USD',
            customerId: 'default',
            metadata: {},
        });
    }
    async refund(transactionId) {
        try {
            return {
                success: true,
                transactionId: `refund_${transactionId}`,
                timestamp: new Date(),
                amount: 0,
                currency: 'USD',
            };
        }
        catch (error) {
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
exports.StripePaymentStrategy = StripePaymentStrategy;
class OAuth2Strategy {
    constructor(clientId, clientSecret, provider) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.provider = provider;
    }
    async authenticate(credentials) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Authentication failed',
            };
        }
    }
    validateCredentials(credentials) {
        return Boolean(credentials.token && credentials.provider === this.provider);
    }
    async refreshToken(token) {
        try {
            // Simulated token refresh
            const refreshResult = await this.performTokenRefresh(token);
            return {
                success: true,
                token: refreshResult.newToken,
                expiresAt: new Date(Date.now() + 3600000),
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Token refresh failed',
            };
        }
    }
    async performOAuthFlow(_credentials) {
        // Real OAuth implementation would go here
        return Promise.resolve({
            userId: `user_${Date.now()}`,
            accessToken: `token_${Date.now()}`,
        });
    }
    async performTokenRefresh(_token) {
        // Real token refresh implementation would go here
        return Promise.resolve({
            newToken: `refreshed_token_${Date.now()}`,
        });
    }
}
exports.OAuth2Strategy = OAuth2Strategy;
class CSVExportStrategy {
    constructor(delimiter = ',', includeHeaders = true) {
        this.delimiter = delimiter;
        this.includeHeaders = includeHeaders;
    }
    async export(data, options) {
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
        }
        catch (error) {
            return {
                success: false,
                data: '',
                error: error instanceof Error ? error.message : 'Export failed',
            };
        }
    }
    validateData(data) {
        return (Array.isArray(data) &&
            data.every(item => item !== null && typeof item === 'object'));
    }
    getContentType() {
        return 'text/csv';
    }
    async convertToCSV(data) {
        if (!data.length)
            return '';
        const headers = Object.keys(data[0]);
        const rows = data.map(item => headers
            .map(header => this.escapeCsvValue(item[header]))
            .join(this.delimiter));
        return this.includeHeaders
            ? [headers.join(this.delimiter), ...rows].join('\n')
            : rows.join('\n');
    }
    escapeCsvValue(value) {
        if (value === null || value === undefined)
            return '';
        const stringValue = String(value);
        return stringValue.includes(this.delimiter) || stringValue.includes('\n')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
    }
    async compressData(data) {
        // Real compression implementation would go here
        return data; // Simplified for example
    }
}
// Usage examples:
async function executePayment(strategy, payment) {
    const result = await strategy.processPayment(payment);
    if (!result.success) {
        console.error(`Payment failed: ${result.error}`);
        return;
    }
    console.log(`Payment successful: ${result.transactionId}`);
}
async function authenticateUser(strategy, credentials) {
    const result = await strategy.authenticate(credentials);
    if (!result.success) {
        console.error(`Authentication failed: ${result.error}`);
        return;
    }
    console.log(`User authenticated: ${result.userId}`);
}
async function exportData(strategy, data, options) {
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
//# sourceMappingURL=all-usage.js.map