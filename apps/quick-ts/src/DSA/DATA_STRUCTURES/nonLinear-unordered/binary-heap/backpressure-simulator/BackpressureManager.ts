import { BinaryHeap } from '../heap-lab/core/BinaryHeap';
import { ClientStat } from './ClientStat';

export class BackpressureManager {
  private clientMap: Map<string, ClientStat>;
  private heap: BinaryHeap<ClientStat>;

  constructor() {
    this.clientMap = new Map();
    this.heap = new BinaryHeap<ClientStat>((a, b) => b.latencyMs - a.latencyMs); // Max latency first
  }

  updateClient(stat: ClientStat) {
    this.clientMap.set(stat.id, stat);
    this.heap.insert(stat);
  }

  getWorstClients(topK: number): ClientStat[] {
    const result: ClientStat[] = [];
    const snapshot = new BinaryHeap<ClientStat>(this.heap['compare'], this.heap.toArray());

    while (!snapshot.isEmpty() && result.length < topK) {
      const top = snapshot.extract();
      if (top) result.push(top);
    }

    return result;
  }

  getBestClients(topK: number): ClientStat[] {
    const snapshot = this.heap.toArray().sort((a, b) => a.latencyMs - b.latencyMs);
    return snapshot.slice(0, topK);
  }
}
