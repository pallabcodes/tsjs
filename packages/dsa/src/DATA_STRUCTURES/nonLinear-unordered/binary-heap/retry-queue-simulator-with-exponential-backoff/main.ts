import { RetryQueueManager } from './RetryQueryManager';
import { getExponentialBackoffDelay } from './RetryStrategy';

const manager = new RetryQueueManager();

function simulateJobFailure(): boolean {
  return Math.random() < 0.6; // 60% chance to fail
}

type RetryJob = {
  id: string;
  attempt: number;
  nextRetryTime: number;
  payload: any;
  lastError?: string;
};

function processJob(job: RetryJob) {
  const ok = !simulateJobFailure();

  if (ok) {
    console.log(`✅ Job ${job.id} succeeded on attempt ${job.attempt}`);
  } else {
    const nextDelay = getExponentialBackoffDelay(job.attempt);
    const nextRetryTime = Date.now() + nextDelay;

    if (job.attempt >= 5) {
      console.warn(`❌ Job ${job.id} permanently failed after ${job.attempt} attempts.`);
    } else {
      console.warn(`⚠️ Job ${job.id} failed. Retrying in ${nextDelay / 1000}s`);
      manager.scheduleRetry({
        ...job,
        attempt: job.attempt + 1,
        nextRetryTime,
        lastError: 'Simulated failure',
      });
    }
  }
}

// Insert some initial jobs
for (let i = 1; i <= 5; i++) {
  manager.scheduleRetry({
    id: `job-${i}`,
    attempt: 1,
    nextRetryTime: Date.now(),
    payload: { foo: 'bar' },
  });
}

setInterval(() => {
  const dueJobs = manager.getDueJobs();
  for (const job of dueJobs) {
    processJob(job);
  }

  console.log(`📦 Retry Queue Size: ${manager.size()}`);

}, 1000);
