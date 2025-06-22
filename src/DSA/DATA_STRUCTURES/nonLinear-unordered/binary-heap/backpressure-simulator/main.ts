import { BackpressureManager } from './BackpressureManager';

const manager = new BackpressureManager();
const CLIENT_COUNT = 10;

function randomLatency() {
  return Math.floor(Math.random() * 200); // 0–200ms
}

setInterval(() => {
  const now = Date.now();

  for (let i = 0; i < CLIENT_COUNT; i++) {
    const latency = randomLatency();
    manager.updateClient({
      id: `client-${i}`,
      lastAckTime: now - latency,
      inflight: Math.floor(Math.random() * 10),
      latencyMs: latency
    });
  }

  console.clear();
  console.log('🔥 Worst Clients (highest latency):');
  console.table(manager.getWorstClients(5));

  console.log('✅ Best Clients (lowest latency):');
  console.table(manager.getBestClients(5));

}, 1000);
