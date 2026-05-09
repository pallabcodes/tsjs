/**
 * The "Media-Native" Trace Unit.
 * This is the shared contract between the Engine and the Shell.
 */
export interface MediaSpan {
  traceId: string;
  spanId: string;
  timestamp: number; // UTC Epoch ms

  // Media-Specific Metadata
  media: {
    frameType: 'I' | 'P' | 'B';
    gopIndex: number;
    pts: number; // Presentation Timestamp
    dts: number; // Decoding Timestamp
    bitrate: number; // bits per second
    codec: 'h264' | 'h265';
  };

  // Health Invariants
  health: {
    hasJitter: boolean;
    isCorrupt: boolean;
    isDropped: boolean;
    latencyMs: number; // E2E Latency
  };

  // Standard Infrastructure Context
  resource: {
    podId: string;
    nodeId: string;
    cameraId: string;
    streamUrl: string;
  };
}

export type StreamStatus = 'idle' | 'streaming' | 'error' | 'reconnecting';

export interface StreamNode {
  id: string;
  type: 'camera' | 'transcoder' | 'egress';
  status: StreamStatus;
  metrics: {
    fps: number;
    bandwidth: number;
  };
}
