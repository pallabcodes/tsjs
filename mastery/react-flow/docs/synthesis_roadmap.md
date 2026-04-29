# Phase 3: Modular Tracking Roadmap (CNTP Synthesis)

## Product: The Cloud-Native Topology Plane (CNTP)
**What**: A live, high-performance spatial map of 1,000+ microservices.
**Why**: To solve "Architectural Drift" by bridging the gap between System Design (HLD) and Operational Telemetry.

---

## [MODULE 1] The Static Canvas (Visual Sovereignty)
*   **Goal**: Render the "Service Mesh" structured layout (Gateway -> Services -> DBs) with zero interactivity.
*   **Status**: COMPLETED
*   **Verification**: Does it look like a professional Cloud Console? Is the "Gateway" the clear entry point?
*   **Code Boundary**: `MasteryEngine` / `App.tsx` (CSS & Layout).

## [MODULE 2] Viewport Sovereignty (Interactive Camera)
*   **Goal**: Add precision Pan and Zoom to the static mesh.
*   **Status**: COMPLETED
*   **Verification**: Does zoom center on the cursor? Is the parallax grid depth-correct?
*   **Code Boundary**: `inv02-viewport`.

## [MODULE 3] Spatial Interaction (Node Mastery)
*   **Goal**: Precision node-level dragging.
*   **Status**: COMPLETED
*   **Verification**: 60FPS dragging with zoom-normalization. Zero jitter.
*   **Code Boundary**: `MasteryEngine.handleDrag`.

## [MODULE 4] Connection Synthesis (Graph DNA)
*   **Goal**: Render the Bezier "Flow" between services.
*   **Status**: PENDING
*   **Verification**: Do lines correctly connect Gateway -> Service -> DB? Are arrowheads visible?
*   **Code Boundary**: `inv08-routing`.

## [MODULE 5] Magnetic Interactivity (The "Snap")
*   **Goal**: High-precision handle snapping and interaction reveal.
*   **Status**: PENDING
*   **Verification**: Do connections snap magnetically? Do handles pulse on hover?
*   **Code Boundary**: `inv17-dependency`.

## [MODULE 6] Semantic Density (LOD & Scaling)
*   **Goal**: Semantic clustering for high-density observability.
*   **Status**: PENDING
*   **Verification**: Do hexagons represent "Cluster Health" at low zoom?
*   **Code Boundary**: `scaling-inv22-lod`.

## [MODULE 7] Contextual Telemetry (The Control Interface)
*   **Goal**: Add a side-panel for node-specific data (Latency, Error Rate, Logs).
*   **Status**: PENDING
*   **Verification**: Does selecting a node reveal its "Service Telemetry"?
*   **Code Boundary**: `App.tsx` (Side-Panel Component).

## [MODULE 8] Persistence Sovereignty (State Sync)
*   **Goal**: Save and Load the topology state (JSON).
*   **Status**: PENDING
*   **Verification**: Can we "Export" a design and "Import" it back exactly?
*   **Code Boundary**: `MasteryEngine.serialize`.
## [MODULE 9] Search & Discovery (The Finder)
*   **Goal**: Implement a search interface to locate and "Jump-To" specific nodes.
*   **Status**: PENDING
*   **Verification**: Does searching for "Database 5" smoothly pan the viewport to that node?
*   **Code Boundary**: `App.tsx` (Search Component) / `MasteryEngine.findNode`.

## [MODULE 10] Multi-Layered Sovereignty (Groups & Minimap)
*   **Goal**: Implement manual grouping (Namespaces) and a navigation Minimap.
*   **Status**: PENDING
*   **Verification**: Can we see the "Bird's Eye View" in the Minimap? Do group boxes move their children?
*   **Code Boundary**: `inv10-groups` / `inv11-minimap`.
