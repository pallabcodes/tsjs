export type WeightedSourceTask = {
  id: string;
  sourceId: string;
  priority: number;
  runAt: number;
  createdAt: number;
  payload: any;
};
