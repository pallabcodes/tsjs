export type RetryJob = {
  id: string;
  attempt: number;
  priority: number; // 🔥 new!
  nextRetryTime: number;
  lastError?: string;
  payload: any;
};
