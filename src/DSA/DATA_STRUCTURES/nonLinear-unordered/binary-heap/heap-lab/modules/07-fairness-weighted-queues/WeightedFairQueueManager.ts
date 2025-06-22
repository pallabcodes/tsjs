import { BinaryHeap } from "../../core/BinaryHeap";
import { SourceMeta } from "./SourceMeta";
import { WeightedSourceTask } from "./WeightedSourceTask";

export class WeightedFairQueueManager {
  private sources: Map<string, SourceMeta> = new Map();
  private rrIndex: string[] = [];

  registerSource(sourceId: string, weight: number = 1) {
    const heap = new BinaryHeap<WeightedSourceTask>(
      (a, b) => a.runAt - b.runAt || b.priority - a.priority
    );

    this.sources.set(sourceId, { weight, heap });

    for (let i = 0; i < weight; i++) {
      this.rrIndex.push(sourceId); // multiple entries = weighted round robin
    }
  }

  enqueue(task: WeightedSourceTask) {
    const meta = this.sources.get(task.sourceId);
    if (!meta) throw new Error(`Source ${task.sourceId} not registered`);
    meta.heap.insert(task);
  }

  pollNextTask(): WeightedSourceTask | null {
    for (let i = 0; i < this.rrIndex.length; i++) {
      const sourceId = this.rrIndex.shift()!;
      this.rrIndex.push(sourceId); // rotate

      const meta = this.sources.get(sourceId)!;
      const task = meta.heap.peek();
      if (task && task.runAt <= Date.now()) {
        return meta.heap.extract()!;
      }
    }

    return null;
  }

  getAllTasks(): WeightedSourceTask[] {
    return [...this.sources.values()].flatMap(src => src.heap.toArray());
  }
}
