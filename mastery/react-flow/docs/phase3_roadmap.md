# Phase 3: Synthesis Roadmap (Sequential)

This roadmap defines the step-by-step implementation of the Mini-ReactFlow synthesis. Each step must be stabilized and verified before moving to the next.

## Step 3.1: Coordinate Sovereignty (Viewport)
*   **Goal**: Establish the infinite grid and flawless pan/zoom.
*   **Tasks**:
    *   [x] Fix World-to-Screen projection (unproject).
    *   [x] Implement Zoom-to-Mouse (calculateZoomToward).
    *   [x] Add "Reset View" (Home) mechanism.
*   **Success**: Clicking "Reset" centers the world at 0.5x zoom perfectly.

## Step 3.2: Structural Sovereignty (Service Mesh)
*   **Goal**: Replace random clusters with a professional architectural layout.
*   **Tasks**:
    *   [x] Implement Layered Layout (Gateway -> Load Balancer -> Service).
    *   [x] Standardize Node Dimensions (220x80 cards).
    *   [x] Add high-fidelity pulsing glassmorphism.
*   **Success**: The initial view looks like a real "Service Mesh" diagram.

## Step 3.3: Interactivity Sovereignty (Drag & Drop)
*   **Goal**: Restore 10/10 dragging fluidity for nodes and clusters.
*   **Tasks**:
    *   [x] Implement incremental deltas (dx/dy).
    *   [x] Add Cluster-level dragging (move all nodes in group).
    *   [x] Fix SharedArrayBuffer headers for 60FPS.
*   **Success**: Dragging a cluster follows the mouse with zero lag or vanishing nodes.

## Step 3.4: Connection Sovereignty (Edges)
*   **Goal**: Re-introduce static graph connections.
*   **Tasks**:
    *   [ ] Implement SVG Overlay layer.
    *   [ ] Render Bezier Edges between Mesh Layers.
    *   [ ] Bind edges to node position updates (Dynamic Routing).
*   **Success**: Moving a node causes its connected edges to re-route in real-time.

## Step 3.5: Magnetic Interactions (Snapping)
*   **Goal**: Implement "Pro" connection logic.
*   **Tasks**:
    *   [ ] Add Port/Handle UI (Source/Target circles).
    *   [ ] Implement Handle Snapping (Magnetic attraction).
    *   [ ] Interactive Edge Creation (Drag-to-connect).
*   **Success**: Dragging an edge near a handle causes it to "Snap" and color-pulse.

## Step 3.6: Professional Operations (HUD & Selection)
*   **Goal**: Final polish of the "IDE" experience.
*   **Tasks**:
    *   [ ] Implement Selection Multi-select (box selection).
    *   [ ] Add Node Deletion / Addition.
    *   [ ] Refine the Glassmorphic HUD with real-time stats.
*   **Success**: The app feels like a production tool (e.g., Miro or Figma).
