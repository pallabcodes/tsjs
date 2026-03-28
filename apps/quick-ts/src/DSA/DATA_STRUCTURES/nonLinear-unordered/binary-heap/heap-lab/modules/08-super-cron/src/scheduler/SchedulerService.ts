import { BinaryHeap } from '../core/BinaryHeap';
import { ScheduledTask } from '../core/ScheduledTask';
import { save, load } from './PersistentStore';

const compareTasks = (a: ScheduledTask, b: ScheduledTask) => {
  if (a.runAt !== b.runAt) return a.runAt - b.runAt;
  return b.priority - a.priority;
};

export class SchedulerService {
  private readonly heap = new BinaryHeap<ScheduledTask>(compareTasks);

  constructor() {
    const persisted = load();
    for (const task of persisted) {
      this.heap.insert(task);
    }
  }

  schedule(task: ScheduledTask) {
    this.heap.insert(task);
    save(this.heap.toArray());
  }

  public extractNext(): ScheduledTask | undefined {
    const t = this.heap.extract();
    save(this.heap.toArray());
    return t;
  }

  pollDue(): ScheduledTask[] {
    const now = Date.now();
    const due: ScheduledTask[] = [];

    while (this.heap.size() > 0 && this.heap.peek()!.runAt <= now) {
      due.push(this.extractNext()!); // Using wrapper
    }

    return due;
  }

  all(): ScheduledTask[] {
    return this.heap.toArray();
  }
}
