import { ScheduledTask } from "../core/ScheduledTask";
import { CronExpressionParser } from 'cron-parser';
import fs from 'fs';

type RawJob = {
  id: string;
  scheduleMode: 'cron' | 'interval';
  cronExpr?: string;
  intervalMs?: number;
  priority?: number;
  type?: string;
  payload?: any;
};

export function loadJobs(file = 'cron.json'): ScheduledTask[] {
  const raw = fs.readFileSync(file, 'utf-8');
  const parsed: RawJob[] = JSON.parse(raw);

  return parsed.map((job: RawJob) => {
    const now = Date.now();
    let runAt = now;

    if (job.scheduleMode === 'cron' && job.cronExpr) {
      const interval = CronExpressionParser.parse(job.cronExpr);
      runAt = interval.next().getTime();
    } else if (job.scheduleMode === 'interval') {
      runAt = now + (job.intervalMs ?? 1000);
    }

    return {
      ...job,
      runAt,
      createdAt: now
    } as ScheduledTask;
  });
}

