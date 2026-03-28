import { ScheduledTask } from "./ScheduledTask";

const starvationAwareComparator = (a: ScheduledTask, b: ScheduledTask): number => {
  const now = Date.now();

  const score = (t: ScheduledTask) =>
    t.priority + ((now - t.createdAt) * (t.agingFactor ?? 0));

  if (a.runAt !== b.runAt) return a.runAt - b.runAt;

  const aScore = score(a);
  const bScore = score(b);

  return bScore - aScore; // higher effective priority wins
};

export { starvationAwareComparator };