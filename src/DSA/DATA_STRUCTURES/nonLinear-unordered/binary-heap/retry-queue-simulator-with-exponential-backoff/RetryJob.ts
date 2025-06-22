export type RetryJob = {
  id: string;
  attempt: number;
  lastError?: string;
  nextRetryTime: number;
  payload: any;
};
