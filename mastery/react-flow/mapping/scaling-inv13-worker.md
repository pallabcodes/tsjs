# SCALING-INV-13: Worker-based Reconciliation

## Purpose
Elevate the ReactFlow reconciliation engine (INV-01) by offloading state calculations to a Web Worker.

## The Limitation of xyflow (Production)
In standard `xyflow`, the `applyNodeChanges` and `applyEdgeChanges` functions run on the **Main Thread**. 
- **The Bottleneck**: When dragging 1,000+ nodes, the iteration over the `changesMap` and object cloning happens in the same thread as the 60fps UI rendering.
- **The Symptom**: "Jank" or frame drops during complex interactions.

## The L7 Scaling DNA
1.  **Serialized Change Stream**: Emitting changes as binary-safe objects to the worker.
2.  **Worker Reconciliation**: Running the reconciliation logic on a background thread.
3.  **Diff-only Synchronization**: Only sending the *updated* node properties back to the main thread (minimizing structured clone overhead).

## Evolutionary Step: From xyflow to L7
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Execution | Main Thread | Web Worker |
| State | Monolithic Store | Mirror Stores (Main/Worker) |
| Performance | $O(N)$ Main Thread | $O(1)$ Main Thread (Wait for Worker) |
| Latency | Zero (Sync) | ~1-2ms (Async Message) |

## Implementation Roadmap
- [ ] Create a `NodeWorker` that wraps `applyNodeChanges`.
- [ ] Implement a `PostMessage` bridge for state synchronization.
- [ ] Verify that high-frequency drags remain 60fps on Main Thread.
