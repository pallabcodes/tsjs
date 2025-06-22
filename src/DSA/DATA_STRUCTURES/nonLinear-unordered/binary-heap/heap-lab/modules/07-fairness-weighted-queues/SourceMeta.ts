import { BinaryHeap } from "../../core/BinaryHeap";
import { WeightedSourceTask } from "./WeightedSourceTask";

export type SourceMeta = {
  weight: number; // how many turns per cycle
  heap: BinaryHeap<WeightedSourceTask>;
};
