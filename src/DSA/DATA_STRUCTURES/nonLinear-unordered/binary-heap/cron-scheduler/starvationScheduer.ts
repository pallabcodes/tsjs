import { BinaryHeap } from '../heap-lab/core/BinaryHeap';
import { starvationAwareComparator } from './starvationComparator';
import { ScheduledTask } from './ScheduledTask';

export class StarvationAwareScheduler {
  private readonly heap: BinaryHeap<ScheduledTask>;

  constructor() {
    this.heap = new BinaryHeap<ScheduledTask>(starvationAwareComparator);
  }

  schedule(task: ScheduledTask) {
    this.heap.insert(task);
  }

  pollDueTasks(): ScheduledTask[] {
    const now = Date.now();
    const ready: ScheduledTask[] = [];

    while (!this.heap.isEmpty()) {
      const top = this.heap.peek();
      if (!top || top.runAt > now) break;
      ready.push(this.heap.extract()!);
    }

    return ready;
  }

  size(): number {
    return this.heap.size();
  }

  allTasks(): ScheduledTask[] {
    return this.heap.toArray().sort(starvationAwareComparator);
  }
}
