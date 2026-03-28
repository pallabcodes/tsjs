import { ScheduledTask } from './ScheduledTask';

export const taskComparator = (a: ScheduledTask, b: ScheduledTask) => {
  if (a.runAt !== b.runAt) {
    return a.runAt - b.runAt; // earlier first
  }
  return b.priority - a.priority; // higher priority first
};
