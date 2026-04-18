export type TaskType = 'email' | 'log' | 'api';

export type ScheduleMode = 'cron' | 'interval';

export interface ScheduledTask {
  id: string;
  taskType: TaskType;
  scheduleMode: ScheduleMode;
  cronExpr?: string;            // for scheduleMode = "cron"
  intervalMs?: number;          // for scheduleMode = "interval"
  repeat?: number;              // how many times to run (optional)
  runAt: number;
  createdAt: number;
  priority: number;
  payload: any;
  retry?: {
    retries: number;
    backoffMs: number;
  };
  onFailure?: {
  type: 'slack' | 'webhook' | 'email';
  to: string;              // webhook URL or email address
  message?: string;
}

}
