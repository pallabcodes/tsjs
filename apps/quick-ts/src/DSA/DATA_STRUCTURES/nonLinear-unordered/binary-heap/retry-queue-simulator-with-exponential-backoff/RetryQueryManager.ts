import { RetryJob } from './RetryJob';
import { BinaryHeap } from '../heap-lab/core/BinaryHeap';

export class RetryQueueManager {
  private retryHeap: BinaryHeap<RetryJob>;

  constructor() {
    this.retryHeap = new BinaryHeap<RetryJob>((a, b) => a.nextRetryTime - b.nextRetryTime);
  }

  scheduleRetry(job: RetryJob) {
    this.retryHeap.insert(job);
  }

  getDueJobs(): RetryJob[] {
    const now = Date.now();
    const due: RetryJob[] = [];

    while (!this.retryHeap.isEmpty() && this.retryHeap.peek()!.nextRetryTime <= now) {
      due.push(this.retryHeap.extract()!);
    }

    return due;
  }

  size(): number {
    return this.retryHeap.size();
  }
}
