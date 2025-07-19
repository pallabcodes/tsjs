"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendingRateService = void 0;
const HeapWrapper_1 = require("./HeapWrapper");
const LOOKBACK_MS = 10_000; // Check delta over last 10s
const TOP_K = 5;
class TrendingRateService {
    constructor() {
        this.maxHeap = new HeapWrapper_1.BinaryHeap((a, b) => b.deltaRate - a.deltaRate);
        this.history = new Map();
    }
    insert(event) {
        const now = event.timestamp;
        const symbol = event.symbol;
        if (!this.history.has(symbol)) {
            this.history.set(symbol, []);
        }
        const events = this.history.get(symbol);
        events.push(event);
        // Purge anything older than LOOKBACK
        while (events.length && now - events[0].timestamp > LOOKBACK_MS) {
            events.shift();
        }
        if (events.length >= 2) {
            const oldest = events[0];
            const deltaRate = (event.price - oldest.price) / (now - oldest.timestamp); // price per ms
            this.maxHeap.insert({
                symbol,
                deltaRate: parseFloat((deltaRate * 1000).toFixed(2)), // scaled to per second
                latestPrice: event.price,
                since: oldest.timestamp,
                now
            });
        }
    }
    getTopTrending() {
        const result = [];
        const copy = new HeapWrapper_1.BinaryHeap(this.maxHeap['compare'], this.maxHeap.toArray());
        const now = Date.now();
        while (!copy.isEmpty() && result.length < TOP_K) {
            const top = copy.extract();
            // Optional: ignore stale deltas
            if (now - top.now < LOOKBACK_MS * 2) {
                result.push(top);
            }
        }
        return result;
    }
}
exports.TrendingRateService = TrendingRateService;
//# sourceMappingURL=TrendingRateService.js.map