import { BinaryHeap } from '../heap-lab/core/BinaryHeap';
import { taskComparator as runAtComparator } from './MinHeap';
import { ScheduledTask } from './ScheduledTask';

export class TaskScheduler {
  private  readonly taskHeap: BinaryHeap<ScheduledTask>;

  constructor() {
    this.taskHeap = new BinaryHeap(runAtComparator);
  }

  schedule(task: ScheduledTask) {
    this.taskHeap.insert(task);
  }

  pollDueTasks(): ScheduledTask[] {
    const now = Date.now();
    const due: ScheduledTask[] = [];

    while (!this.taskHeap.isEmpty() && this.taskHeap.peek()!.runAt <= now) {
      due.push(this.taskHeap.extract()!);
    }

    return due;
  }

  size(): number {
    return this.taskHeap.size();
  }

  nextTaskEta(): number | null {
    return this.taskHeap.peek()?.runAt ?? null;
  }

  allTasks(): ScheduledTask[] {
    return this.taskHeap ? [...this.taskHeap] : [];
  }
}
