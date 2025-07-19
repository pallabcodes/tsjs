"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomStockEvent = generateRandomStockEvent;
const STOCK_SYMBOLS = ['AAPL', 'GOOG', 'AMZN', 'TSLA', 'MSFT', 'NVDA'];
function generateRandomStockEvent() {
    const symbol = STOCK_SYMBOLS[Math.floor(Math.random() * STOCK_SYMBOLS.length)];
    const price = parseFloat((100 + Math.random() * 50).toFixed(2));
    return {
        symbol,
        price,
        timestamp: Date.now()
    };
}
//# sourceMappingURL=StockEvent.js.map