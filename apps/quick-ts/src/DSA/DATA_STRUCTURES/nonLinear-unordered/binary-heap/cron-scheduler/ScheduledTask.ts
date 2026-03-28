export type TaskType = 'email' | 'retry' | 'sync' | 'notification';

export type ScheduledTask = {
  id: string;
  runAt: number;           // Timestamp in ms
  createdAt: number;
  priority: number;        // Higher = more urgent
  type: TaskType;
  payload: any;
  agingFactor?: number
};