/**
 * SCALING-INV-13: Off-Thread Telemetry Engine
 * 
 * This worker handles the heavy lifting of infra simulation:
 * 1. Jitter & Drift for latency/cpu
 * 2. Back-pressure propagation along the topology
 * 3. Recovery machine for restarting nodes
 */

let nodes: any[] = [];
let edges: any[] = [];
let nodeMap = new Map<string, any>();
let sharedBuffer: Float32Array | null = null;
let snapshotHistory: Float32Array[] = [];
const MAX_HISTORY = 600; // 60 seconds at 10Hz

// L7 Status Enum
const STATUS_MAP = { 'HEALTHY': 0, 'DEGRADED': 1, 'CRITICAL': 2, 'RESTARTING': 3 };

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT':
      nodes = JSON.parse(JSON.stringify(payload.nodes));
      edges = JSON.parse(JSON.stringify(payload.edges));
      sharedBuffer = new Float32Array(payload.buffer);
      updateNodeMap();
      break;

    case 'INJECT_FAULT':
      const node = nodeMap.get(payload.id);
      if (node) {
        node.data.status = 'CRITICAL';
        node.data.color = '#f43f5e';
        node.data.telemetry.cpu = 99.8;
        node.data.telemetry.errorRate = "12.50";
      }
      break;

    case 'RESTART_NODE':
      const rNode = nodeMap.get(payload.id);
      if (rNode) {
        rNode.data.status = 'RESTARTING';
        rNode.data.color = '#3b82f6';
        rNode.data.telemetry.cpu = 0;
        rNode.data.telemetry.latency = "0.0";
      }
      break;

    case 'REGION_OUTAGE':
      // L7 Advanced Resilience (Module 11): Entire INGRESS zone fails
      nodes.filter(n => n.data.type === 'GATEWAY').forEach(n => {
        n.data.status = 'CRITICAL';
        n.data.color = '#f43f5e';
        n.data.telemetry.cpu = 100;
        n.data.telemetry.errorRate = "100.0";
      });
      break;

    case 'DB_DEADLOCK':
      // L7 Advanced Resilience (Module 11): Data layer stalls causing cascading back-pressure
      nodes.filter(n => n.data.type === 'DATABASE').forEach(n => {
        n.data.status = 'CRITICAL';
        n.data.color = '#f43f5e';
        n.data.telemetry.cpu = 100;
        n.data.telemetry.errorRate = "99.9";
      });
      break;

    case 'TICK':
      tickTelemetry();
      syncToBuffer();
      captureHistory();
      self.postMessage({ type: 'TELEMETRY_TICK', historyCount: snapshotHistory.length });
      break;

    case 'GET_HISTORY':
      if (payload.index < snapshotHistory.length) {
        self.postMessage({ type: 'HISTORY_SNAPSHOT', snapshot: snapshotHistory[payload.index], index: payload.index });
      }
      break;
  }
};

function captureHistory() {
  if (!sharedBuffer) return;
  const snapshot = new Float32Array(sharedBuffer);
  snapshotHistory.push(snapshot);
  if (snapshotHistory.length > MAX_HISTORY) snapshotHistory.shift();
}

function updateNodeMap() {
  nodeMap.clear();
  nodes.forEach(n => nodeMap.set(n.id, n));
}

function syncToBuffer() {
  const buf = sharedBuffer;
  if (!buf) return;
  nodes.forEach((n, i) => {
    const offset = i * 5;
    buf[offset] = parseFloat(n.data.telemetry.latency);
    buf[offset + 1] = n.data.telemetry.cpu;
    buf[offset + 2] = STATUS_MAP[n.data.status as keyof typeof STATUS_MAP] || 0;
    buf[offset + 3] = n.data.telemetry.requests || 0;
    buf[offset + 4] = parseFloat(n.data.telemetry.errorRate || '0');
  });
}

function tickTelemetry() {
  nodes.forEach(n => {
    if (!n.data?.telemetry) return;

    // 1. Recovery Machine
    if (n.data.status === 'RESTARTING') {
      n.data.telemetry.cpu += 5;
      if (n.data.telemetry.cpu >= 100) {
        n.data.status = 'HEALTHY';
        n.data.color = '#3b82f6';
        n.data.telemetry.cpu = 20 + Math.random() * 5;
      }
    }

    // 2. Base Jitter
    const t = n.data.telemetry;
    const latBase = parseFloat(t.latency || '5');
    t.latency = Math.max(1, latBase + (Math.random() - 0.5) * 2).toFixed(1);
    const cpuBase = t.cpu || 20;
    t.cpu = Math.min(100, Math.max(0, cpuBase + (Math.random() - 0.5) * 4));

    // 3. Propagation Logic
    const upstreams = edges.filter(e => e.target === n.id);
    let backPressure = 0;
    upstreams.forEach(edge => {
      const source = nodeMap.get(edge.source);
      if (source?.data.status === 'CRITICAL') backPressure += 30;
      if (source?.data.status === 'DEGRADED') backPressure += 10;
    });

    if (backPressure > 0) {
      t.cpu = Math.min(100, t.cpu + backPressure);
      if (t.cpu > 90) { n.data.status = 'CRITICAL'; n.data.color = '#f43f5e'; }
      else if (t.cpu > 70) { n.data.status = 'DEGRADED'; n.data.color = '#fbbf24'; }
    } else if (n.data.status !== 'HEALTHY' && n.data.status !== 'RESTARTING' && t.cpu < 70) {
      n.data.status = 'HEALTHY';
      n.data.color = '#3b82f6';
    }
  });
}
