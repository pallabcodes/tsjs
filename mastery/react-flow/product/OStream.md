# Project OStream: The Media-Native Observability Mesh

Despite virtually every Video Management System (VMS) facing the same scaling and troubleshooting challenges, teams are still left to manually correlate video artifacts with server logs. Standard observability tools (Datadog, OTEL) are "Media-Blind," and legacy VMS health tools are "System-Blind." 

**OStream** is built to bridge this gap, providing a high-performance, polyglot engine that correlates real-time Media Pipeline invariants (GOP, NAL, RTP) with distributed system traces.

---

## 1. Why We Are Building OStream (The Conflict)

Building a modern, software-defined VMS at scale requires a system that can handle thousands of high-bitrate streams while providing sub-millisecond diagnostic clarity. Existing tools fail for three specific reasons:

1.  **The "Blind Blob" Problem**: Standard OTEL treats video as an opaque `byte[]`. It can tell you a service is slow, but it cannot tell you if that slowness caused a **Reference Frame Loss** or a **GOP Violation**.
2.  **The "Reactive Dashboard" Trap**: Tools like Milestone/Genetec monitor hardware resources (CPU/Disk), but they cannot trace a **single frame's lifecycle** across a microservice mesh. When a stream lags, engineers are forced to guess where the "ghost" in the machine is.
3.  **The "Metadata Drift" Crisis**: AI events (e.g., Object Detection) often drift from the video frames they describe. There is no industry-standard way to **atomically sync** an OTEL Span ID with a specific Media Sequence Number.

---

## 2. Our Non-Negotiable Requirements

These requirements shape every architectural decision for OStream, from our C++ parser to our React/xyflow visualizer:

*   **Media-Protocol Awareness**: The system must natively parse RTP/RTSP/NAL headers at the "Edge" (C++ Engine) to extract semantic meaning without full decoding.
*   **Atomic Trace Correlation**: Every media frame must be uniquely correlated with a **Distributed Trace ID**. We must be able to ask: *"Show me the exact system trace for the frame where the Jitter exceeded 50ms."*
*   **Zero-Overhead Ingress**: Processing must handle 10k+ metadata points per second with <1ms of overhead on the media path.
*   **Cost-Centric Observability**: We must identify "Greedy Streams" (misconfigured bitrates/profiles) that are causing cluster-wide resource exhaustion.
*   **Sovereign Deployment**: The engine must be a lightweight **Sidecar** that runs on-prem (Metal) or in the Cloud (AWS) with zero external data dependencies.

---

## 3. The Architecture (Engine & Shell)

To achieve these requirements, OStream is split into three independently operating layers:

1.  **The Parser (C++ Engine)**: A headless sidecar that hooks into the media pipe. It extracts GOP structure, NAL types, and RTP timestamps.
2.  **The Injector (Go Middleware)**: A high-performance bridge that normalizes media metadata and injects it into standard OTEL Spans. It handles the context propagation between the Media Pipe and the Trace Pipe.
3.  **The Visualizer (React/xyflow Shell)**: A "Live Pipeline Map" that renders the graph of the distributed VMS. It doesn't just show services; it shows the **Bitrate Flow** and **Quality Health** across the mesh.

---

## 4. Learning Growth Map (The Staff Engineering Journey)

Building OStream provides deep technical mastery in:
*   **Systems Programming**: High-performance binary protocol parsing (RTP/NAL) in C++ and Go.
*   **Distributed Systems**: Mastering custom OTEL instrumentation and polyglot context propagation.
*   **Mechanical Sympathy**: Zero-copy data passing and hardware-accelerated observability.
*   **Frontend Mastery**: Building 60FPS telemetry-driven graph UIs with xyflow.
