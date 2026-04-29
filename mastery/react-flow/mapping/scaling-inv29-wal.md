# SCALING-INV-29: Immutable Write-Ahead Log (WAL)

## Purpose
Scale persistence to massive graphs by moving from "Full State Snapshots" to "Append-only Change Streams."

## The Limitation of xyflow (Production)
`xyflow` persists state by serializing the entire `nodes` and `edges` array to JSON.
- **The Bottleneck**: For a graph with 1,000,000 nodes, serializing the whole state on every change is impossible ($O(N)$). 

## The L7 Scaling DNA: The Binary Log
1. **The Append-only Stream**: Every change is appended to a binary file (the Log).
2. **Deterministic Replay**: To restore state, the engine "Replays" the log from the last checkpoint.
3. **O(1) Persistence**: Saving a change takes the same amount of time, regardless of whether the graph has 10 nodes or 10 million nodes.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Save Complexity | $O(N)$ | $O(1)$ |
| Storage Format | Monolithic JSON | Incremental Binary Log |

## Implementation Roadmap
- [ ] Implement a `BinaryWAL` that records bit-packed changes.
- [ ] Implement a `Replayer` that reconstructs state from the log.
