# OStream Implementation Task List

## Phase 1: Invariant Definition & Contract Setup
- [x] Define `media.proto` core invariants.
- [ ] Set up Monorepo structure for `engine-cpp`, `agent-go`, and `shell-react`.
- [ ] Generate language-specific bindings (Protobuf/gRPC) for C++, Go, and Java.

## Phase 2: The "Thin Slice" (C++ to Go Bridge)
- [ ] **Engine-CPP**: Implement headless RTSP header parser (NAL unit extraction).
- [ ] **Agent-Go**: Implement the OTEL bridge (receiving metadata via Unix Sockets).
- [ ] **Verification**: Unit test C++ parser logic without a browser.

## Phase 3: The Manager & Visualizer
- [ ] **Manager-Java**: Implement gRPC sink for `StreamHealth` updates.
- [ ] **Shell-React**: Build the `xyflow` dashboard using the Engine/Shell pattern.
- [ ] **Live Debugging**: Trace a frame from C++ $\to$ Go $\to$ Java $\to$ React.

## Phase 4: Staff-Level Optimization
- [ ] Implement Zero-Copy memory passing between C++ and Go.
- [ ] Implement AI-driven anomaly detection (Python) for Jitter patterns.
- [ ] Finalize "PII Redaction" at the ingest layer.
