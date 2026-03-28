import { RetryJob } from './RetryJob';
import { BinaryHeap } from '../heap-lab/core/BinaryHeap';

// Dual-priority: ready jobs first, then by priority (higher is better)
const retryComparator = (a: RetryJob, b: RetryJob) => {
  const now = Date.now();
  const aReady = now >= a.nextRetryTime;
  const bReady = now >= b.nextRetryTime;

  if (aReady && !bReady) return -1;
  if (!aReady && bReady) return 1;
  if (!aReady && !bReady) return a.nextRetryTime - b.nextRetryTime; // who becomes ready first

  // Both are ready → compare priority (higher is better)
  return b.priority - a.priority;
};

export class RetryQueueManager {
  private retryHeap: BinaryHeap<RetryJob>;

  constructor() {
    this.retryHeap = new BinaryHeap<RetryJob>(retryComparator);
  }

  scheduleRetry(job: RetryJob) {
    this.retryHeap.insert(job);
  }

  getDueJobs(): RetryJob[] {
    const now = Date.now();
    const due: RetryJob[] = [];

    while (!this.retryHeap.isEmpty()) {
      const top = this.retryHeap.peek();
      if (!top) break;
      if (now < top.nextRetryTime) break;
      due.push(this.retryHeap.extract()!);
    }

    return due;
  }

  size(): number {
    return this.retryHeap.size();
  }
}
