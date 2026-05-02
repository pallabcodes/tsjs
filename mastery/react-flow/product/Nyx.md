# Nyx: The Media-Native Observability Mesh

**Nyx** (named after the Greek Goddess of the Night) is a high-performance, distributed observability platform designed to watch over **Video Management Systems (VMS)** and **Streaming Pipelines** while you sleep.

## 1. The Core Vision
The goal of Nyx is to eliminate the "3AM Incident Response" for streaming infrastructure. By providing atomic visibility into the media pipeline, Nyx identifies "unknown-unknown" failures that standard observability tools ignore.

## 2. The Core Problem: "The Green Dashboard Paradox"
Standard tools (Datadog, CloudWatch) monitor infrastructure, not "Media Reality."
*   **Infrastructure Health**: CPU, RAM, and Network are 100% healthy.
*   **Media Reality**: The video stream is stuttering, frames are being dropped, or the GOP (Group of Pictures) is malformed.
*   **The Result**: Engineers are woken up at 3AM to manually "hunt" for a bug that the dashboard says doesn't exist.

## 3. The Objective: "Semantic Tracing"
Nyx provides a **Traceable Path** for every frame. It correlates **Media Invariants** with **System Invariants** to provide instant root-cause analysis.

## 4. The "Engine and Shell" Architecture

### The Engine (The "Night-Watcher")
*   **Implementation**: A headless, zero-overhead sidecar built in **Go** and **C++**.
*   **Function**: 
    *   **NAL-Level Parsing**: Deep-packet inspection of RTSP/WebRTC streams.
    *   **Metadata Injection**: Injects frame-level health (Jitter, PTS/DTS offsets, Sequence gaps) into standard OpenTelemetry (OTEL) Spans.
    *   **Performance**: Utilizes zero-copy buffers and hardware-accelerated headers to handle 10k+ concurrent streams with <1ms overhead.

### The Shell (The "Lighthouse")
*   **Implementation**: A React-based visualization platform built on **ReactFlow**.
*   **Function**:
    *   **Flow-Centric Graph**: Renders the media pipeline as a live topology.
    *   **Visual Debugging**: Nodes change state based on the **Media Health** reported by the engine. 
    *   **Causality Replay**: Allows engineers to "rewind" an incident to see exactly where the "Ozhukk" (Flow) was interrupted.

## 5. Technology Stack

To ensure "Mechanical Sympathy" with existing VMS infrastructure, Nyx utilizes a polyglot stack optimized for both raw performance and enterprise governance:

*   **The Engine (The Core)**: **C / C++**. 
    *   *Role*: Deep-packet inspection, zero-copy buffer analysis, and NAL-unit parsing. Chosen for maximum performance and direct integration with existing C-based media drivers.
*   **The Connective Tissue**: **Go** (or **Elixir** for high-concurrency signaling).
    *   *Role*: Managing the OTEL collection pipeline, signaling between edge/cloud, and providing high-availability distributed coordination.
*   **The Management Plane**: **Java (Spring Boot / DGS)**.
    *   *Role*: Handling complex business logic, multi-tenancy, authentication, and the GraphQL API for the Shell.
*   **The Analysis Layer**: **Python**.
    *   *Role*: Real-time anomaly detection and predictive failure analysis using the ingested telemetry.
*   **The Interface (The Shell)**: **React, TypeScript, ReactFlow**.
    *   *Role*: High-fidelity, reactive visualization of the media pipeline.

---

**Nyx: High-performance visibility at the speed of the stream.**
