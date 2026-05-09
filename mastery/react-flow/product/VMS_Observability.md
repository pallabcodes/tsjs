# Product Strategy: The Media-Observability Mesh

## 1. The Goal

To bridge the gap between **Video Reality** and **Infrastructure Observability**. We are building a "Media-Native" extension to OpenTelemetry that allows engineers to trace a video frame's lifecycle from the camera hardware to the end-user's screen, correlating media-specific artifacts (GOP stutter, NAL corruption) with system-level metrics (CPU, Memory, Network).

## 2. The "Unfair Advantage"

Unlike Datadog or Milestone, this tool is **Media-Aware**.

- **Datadog/OTEL** is "Media-Blind" (sees bytes, not frames).
- **Genetec/Milestone** is "Resource-Oriented" (sees servers, not flows).
- **This Tool** is **"Flow-Oriented"** (sees the journey of a frame).

## 3. High-Level Architecture (Engine & Shell)

### The Engine (Logic & Invariants)

- **Language**: Go (Orchestration) + C++ (Binary Parsing).
- **Role**: A headless sidecar that intercepts RTSP/WebRTC traffic, parses NAL unit headers, calculates GOP integrity, and emits standard OTEL spans enriched with "Media Metadata."
- **Testing**: 100% Headless Unit/Integration tests.

### The Shell (Visualization & Reflex)

- **Language**: React + TypeScript + `xyflow`.
- **Role**: A "Flow-Centric" dashboard that renders the media pipeline as a live graph. Nodes represent processing stages; edges represent the health of the frame stream.
- **Testing**: Visual regression and E2E interaction tests.

### The Governance Layer (Policy)

- **Language**: Java + Spring + DGS (GraphQL).
- **Role**: Manages camera registries, enforces PII redaction policies, and provides a unified API for the Shell.

---

## 4. Initial Type Contract (The "Mechanical Sympathy")

To ensure parallel development, we define the core entities that both the Engine and Shell must understand.

### `MediaSpan` (The Core Trace Unit)

```typescript
interface MediaSpan {
  traceId: string;
  spanId: string;
  timestamp: number;

  // Media-Specific Metadata
  media: {
    frameType: 'I' | 'P' | 'B';
    gopIndex: number;
    pts: number; // Presentation Timestamp
    dts: number; // Decoding Timestamp
    bitrate: number;
    codec: 'h264' | 'h265';
  };

  // Health Invariants
  health: {
    hasJitter: boolean;
    isCorrupt: boolean;
    isDropped: boolean;
  };

  // Standard Infrastructure Context
  resource: {
    podId: string;
    nodeId: string;
    cameraId: string;
  };
}
```

## 5. Phase 1 Milestone: "The Pulse"

Build a minimal vertical slice:

1.  **Engine**: A Go service that "mocks" the parsing of an RTSP stream and emits 10 `MediaSpans` per second.
2.  **Shell**: A React app that renders these 10 spans as a moving flow in an `xyflow` graph.
3.  **Validation**: Verify that the Shell updates at 60fps without lag when the Engine increases throughput.
