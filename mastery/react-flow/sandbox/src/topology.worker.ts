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

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT':
      nodes = JSON.parse(JSON.stringify(payload.nodes));
      edges = JSON.parse(JSON.stringify(payload.edges));
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

    case 'TICK':
      tickTelemetry();
      const deltas = nodes.map(n => ({
        id: n.id,
        status: n.data.status,
        color: n.data.color,
        telemetry: n.data.telemetry
      }));
      self.postMessage({ type: 'TELEMETRY_UPDATE', payload: deltas });
      break;
  }
};

function updateNodeMap() {
  nodeMap.clear();
  nodes.forEach(n => nodeMap.set(n.id, n));
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
