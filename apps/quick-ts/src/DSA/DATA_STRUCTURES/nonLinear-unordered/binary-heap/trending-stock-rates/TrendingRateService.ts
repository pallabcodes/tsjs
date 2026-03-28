import { StockEvent } from './StockEvent';
import { BinaryHeap } from './HeapWrapper';

type DeltaRateEntry = {
  symbol: string;
  deltaRate: number;
  latestPrice: number;
  since: number;
  now: number;
};

const LOOKBACK_MS = 10_000; // Check delta over last 10s
const TOP_K = 5;

export class TrendingRateService {
  private maxHeap: BinaryHeap<DeltaRateEntry>;
  private history: Map<string, StockEvent[]>;

  constructor() {
    this.maxHeap = new BinaryHeap<DeltaRateEntry>((a, b) => b.deltaRate - a.deltaRate);
    this.history = new Map();
  }

  insert(event: StockEvent) {
    const now = event.timestamp;
    const symbol = event.symbol;

    if (!this.history.has(symbol)) {
      this.history.set(symbol, []);
    }

    const events = this.history.get(symbol)!;
    events.push(event);

    // Purge anything older than LOOKBACK
    while (events.length && now - events[0].timestamp > LOOKBACK_MS) {
      events.shift();
    }

    if (events.length >= 2) {
      const oldest = events[0];
      const deltaRate =
        (event.price - oldest.price) / (now - oldest.timestamp); // price per ms

      this.maxHeap.insert({
        symbol,
        deltaRate: parseFloat((deltaRate * 1000).toFixed(2)), // scaled to per second
        latestPrice: event.price,
        since: oldest.timestamp,
        now
      });
    }
  }

  getTopTrending(): DeltaRateEntry[] {
    const result: DeltaRateEntry[] = [];
    const copy = new BinaryHeap<DeltaRateEntry>(this.maxHeap['compare'], this.maxHeap.toArray());
    const now = Date.now();

    while (!copy.isEmpty() && result.length < TOP_K) {
      const top = copy.extract();
      // Optional: ignore stale deltas
      if (now - top!.now < LOOKBACK_MS * 2) {
        result.push(top!);
      }
    }

    return result;
  }
}
