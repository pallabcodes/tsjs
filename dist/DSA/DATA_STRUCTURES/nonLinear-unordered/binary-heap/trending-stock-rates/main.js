"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StockEvent_1 = require("./StockEvent");
const TrendingRateService_1 = require("./TrendingRateService");
const rateTracker = new TrendingRateService_1.TrendingRateService();
setInterval(() => {
    const event = (0, StockEvent_1.generateRandomStockEvent)();
    rateTracker.insert(event);
    console.clear();
    console.log('⚡ Trending Stocks by Speed of Price Change (₹/s):\n');
    console.table(rateTracker.getTopTrending());
}, 1000);
//# sourceMappingURL=main.js.map