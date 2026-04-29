# SCALING-INV-16: Reactive Batching & Throttling

## Purpose
Ensure UX fluidity by synchronizing engine updates with the display refresh rate, preventing "Event Spam" from overwhelming the Scaling Pipeline.

## The Limitation of xyflow (Production)
`xyflow` is highly reactive. When dragging a node, every `mousemove` event triggers a state update.
- While React's internal batching handles some of this, the **Main Thread-to-Worker** bridge (INV-13) and **QuadTree updates** (INV-14) can become a bottleneck if triggered 100+ times per second.
- Result: Micro-stutter and increased input latency.

## The L7 Scaling DNA: The rAF Batcher
Instead of immediate execution, we use a **Throttled Queue**.
1. **Accumulation**: All incoming changes (move, zoom, selection) are added to a "Pending Buffer."
2. **Synchronization**: We listen for the browser's `requestAnimationFrame` (rAF).
3. **Execution**: Just before the next frame, we "Flush" the buffer—merging redundant changes (e.g., if a node moved 5 times, only the latest position matters) and sending a single batch to the engine.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Event Handling | Immediate / Reactive | rAF Synchronized |
| Message Overhead | High (per-event) | Low (per-frame) |
| Input Latency | Variable (event queue) | Deterministic (frame-aligned) |

## Implementation Roadmap
- [ ] Implement a `ChangeBatcher` that queues node/viewport updates.
- [ ] Add a `flush()` mechanism that deduplicates changes.
- [ ] Integrate with `INV-13` (Worker) to send batched payloads.
