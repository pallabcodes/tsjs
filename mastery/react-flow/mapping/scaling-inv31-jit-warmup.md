# SCALING-INV-31: JIT Profile-Guided Warmup (PGO)

## Purpose
Ensure "Zero-Latency" first impressions by pre-warming the JIT compiler before user interaction begins.

## The Limitation of xyflow (Production)
`xyflow` is interpreted on startup. 
- **The Bottleneck**: The very first time a user drags a node, the JS engine (V8) hasn't compiled the code yet. The first 100-500ms of interaction are slower and more "jittery" than the rest.

## The L7 Scaling DNA: Warmup Invariant
1. **The Synthetic Load**: Running the core reconciliation (INV-01) and spatial query (INV-14) loops with dummy data during initialization.
2. **Compiler Hinting**: Forcing the JIT to recognize "Hot" code paths and compile them to optimized machine code (TurboFan) before the `onMount` event.
3. **Deterministic Performance**: Ensuring that the performance measured in benchmarks is the same performance the user feels in their first second of use.

## Evolutionary Step
| Feature | Standard App | L7 Mastery Scaling |
|---------|--------------|-------------------|
| Optimization Timing | On-demand (Slow Start) | Pre-interaction (Fast Start) |
| First-Interaction Latency | High | Zero (Pre-compiled) |

## Implementation Roadmap
- [ ] Implement a `JitWarmer` that executes hot invariants 10,000 times.
- [ ] Verify that the first real execution is as fast as the 10,000th.
