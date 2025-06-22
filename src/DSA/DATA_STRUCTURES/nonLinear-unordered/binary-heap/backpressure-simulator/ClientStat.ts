export type ClientStat = {
  id: string;
  lastAckTime: number;
  inflight: number;
  latencyMs: number;
};
