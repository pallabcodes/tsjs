# SCALING-INV-27: Collaborative DNA (CRDTs)

## Purpose
Enable zero-lock, multi-user collaboration at extreme scales using Conflict-free Replicated Data Types (CRDTs).

## The Limitation of xyflow (Production)
In standard `xyflow`, the state is local. If two users move the same node, the "last one to save" wins, or the state becomes inconsistent. 
- **The Bottleneck**: Traditional "Server-side Locking" doesn't scale to thousands of users or high-latency connections.

## The L7 Scaling DNA: The Vector Clock
1. **Local Autonomy**: Every change is timestamped with a `Vector Clock` (User ID + Sequence).
2. **Commutative Merging**: Changes are designed so they can be applied in any order and produce the same result (LWW - Last Writer Wins).
3. **P2P Sync**: Nodes can sync directly with each other without a central bottleneck.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| State Model | Single-User / Central | Multi-User / Distributed |
| Conflict Resolution | Last-Writer-Wins (Overwrite) | Deterministic Merge (CRDT) |

## Implementation Roadmap
- [ ] Implement a `VectorClock` for change tracking.
- [ ] Implement a `LWWRegister` (Last-Writer-Wins) for node positions.
- [ ] Verify that out-of-order updates result in a consistent state.
