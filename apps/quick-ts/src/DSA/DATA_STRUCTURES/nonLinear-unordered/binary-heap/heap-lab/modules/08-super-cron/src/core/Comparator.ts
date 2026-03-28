import { ScheduledTask } from "./ScheduledTask";

const compareTasks = (a: ScheduledTask, b: ScheduledTask) => {
  if (a.runAt !== b.runAt) return a.runAt - b.runAt;
  return b.priority - a.priority;
};

// Starvation-aware comparator
export const compareWithAging = (a: ScheduledTask, b: ScheduledTask): number => {
  const now = Date.now();
  const aScore = a.runAt - now - a.priority * 100;
  const bScore = b.runAt - now - b.priority * 100;
  return aScore - bScore;
};
