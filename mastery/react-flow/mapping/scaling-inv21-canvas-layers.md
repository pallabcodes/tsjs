# SCALING-INV-21: Multi-Layer Canvas Pipeline

## Purpose
Bypass the browser's DOM / SVG mounting overhead by moving to a multi-layered rendering architecture.

## The Limitation of xyflow (Production)
`xyflow` is built on React + SVG/HTML.
- **The Bottleneck**: Updating 1,000 DOM nodes or SVG paths in a single frame is expensive because the browser has to recalculate the entire render tree and layout.
- **The Symptom**: "Layout Thrashing" and frame drops when panning across a dense graph.

## The L7 Scaling DNA: Layer Separation
1. **The Static Layer (Canvas)**: Rendering thousands of non-moving nodes into a single bitmap.
2. **The Active Layer (Canvas/DOM)**: Only rendering the "currently moving" or "selected" nodes as separate objects.
3. **The Composition**: Layering these buffers so the CPU only has to draw 1–2 large bitmaps instead of thousands of small objects.

## Evolutionary Step
| Feature | xyflow Production | L7 Mastery Scaling |
|---------|-------------------|-------------------|
| Rendering Tech | React (DOM/SVG) | Multi-Layer Canvas |
| Frame Complexity | $O(N)$ objects | $O(L)$ layers |

## Implementation Roadmap
- [ ] Create a `LayerManager` that tracks `Static` vs `Dynamic` nodes.
- [ ] Implement a "Flattening" logic that draws nodes to a single buffer.
