import { BinaryHeap } from "../../nonLinear-unordered/binary-heap/heap-lab/core/BinaryHeap";

/**
 * ✅ Scenario 1: Task Scheduling System
 * Problem: You’re building a task scheduler that processes tasks in priority order. Tasks may fail and need to be retried, with the ability to give higher priority to more urgent tasks.
 * 
 * Solution:
 * Use a stack to track the state of each task (in-progress, completed, failed).
 * Use a monotonic stack for prioritizing tasks dynamically, based on timestamps and task priority.
 * 
*/

// Add this type alias to resolve the error
type Heap<T> = BinaryHeap<T>;

type Task = {
  id: string;
  priority: number; // higher number = higher priority
  timestamp: number; // time when the task was created
  failedRetries: number;
};

class TaskScheduler {
  private taskStack: Task[] = []; // Stack to track task states
  private retryHeap: Heap<Task>; // Min-heap to track tasks by priority and timestamp

  constructor() {
    // Min-heap of tasks: higher priority tasks will come out first
    this.retryHeap = new BinaryHeap<Task>((a, b) => a.priority - b.priority);
  }

  addTask(task: Task): void {
    this.retryHeap.insert(task); // Push task to heap based on priority
  }

  retryTask(task: Task): void {
    if (task.failedRetries > 3) {
      console.log(`Task ${task.id} reached max retries`);
      return;
    }
    task.failedRetries++;
    this.retryHeap.insert(task); // Re-insert with updated priority
  }

  processTask(): void {
    const task = this.retryHeap.extract();
    if (task) {
      // Process the task (simulate success/failure)
      console.log(`Processing task: ${task.id}`);
      this.taskStack.push(task); // Track it as processed
    }
  }
}

/**
 * Explanation:
 * 
 * The taskStack keeps track of all processed tasks.
 * The retryHeap ensures that tasks with the highest priority are processed first, and if they fail, they are retried with a backoff mechanism.
 * 
 * 
*/

