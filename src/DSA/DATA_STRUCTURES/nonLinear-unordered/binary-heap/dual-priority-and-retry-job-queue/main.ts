import { RetryJob } from './RetryJob';
import { RetryQueueManager } from './RetryQueueManager';
import { getExponentialBackoffDelay } from '../retry-queue-simulator-with-exponential-backoff/RetryStrategy';

const manager = new RetryQueueManager();

function simulateJobFailure(): boolean {
  return Math.random() < 0.5; // 50% chance to fail
}

function processJob(job: RetryJob) {
  const success = !simulateJobFailure();

  if (success) {
    console.log(`✅ Job ${job.id} (P${job.priority}) succeeded (attempt ${job.attempt})`);
  } else {
    const delay = getExponentialBackoffDelay(job.attempt);
    const retryTime = Date.now() + delay;

    if (job.attempt >= 5) {
      console.warn(`❌ Job ${job.id} permanently failed`);
    } else {
      console.warn(`🔁 Job ${job.id} (P${job.priority}) failed, retrying in ${delay / 1000}s`);
      manager.scheduleRetry({
        ...job,
        attempt: job.attempt + 1,
        nextRetryTime: retryTime,
      });
    }
  }
}

for (let i = 1; i <= 8; i++) {
  manager.scheduleRetry({
    id: `job-${i}`,
    attempt: 1,
    priority: Math.floor(Math.random() * 10), // 0–9
    nextRetryTime: Date.now(),
    payload: { type: 'task' }
  });
}

setInterval(() => {
  const due = manager.getDueJobs();
  for (const job of due) {
    processJob(job);
  }

  console.log(`📦 Heap Size: ${manager.size()}`);
}, 1000);
