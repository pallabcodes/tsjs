package contract

// MediaSpan represents the "Media-Native" Trace Unit.
type MediaSpan struct {
	TraceID   string `json:"traceId"`
	SpanID    string `json:"spanId"`
	Timestamp int64  `json:"timestamp"`

	Media MediaMetadata `json:"media"`
	Health HealthMetrics `json:"health"`
	Resource ResourceContext `json:"resource"`
}

type MediaMetadata struct {
	FrameType string `json:"frameType"` // "I", "P", "B"
	GOPIndex  int    `json:"gopIndex"`
	PTS       int64  `json:"pts"`
	DTS       int64  `json:"dts"`
	Bitrate   int    `json:"bitrate"`
	Codec     string `json:"codec"`
}

type HealthMetrics struct {
	HasJitter  bool    `json:"hasJitter"`
	IsCorrupt  bool    `json:"isCorrupt"`
	IsDropped  bool    `json:"isDropped"`
	LatencyMs  float64 `json:"latencyMs"`
}

type ResourceContext struct {
	PodID     string `json:"podId"`
	NodeID    string `json:"nodeId"`
	CameraID  string `json:"cameraId"`
	StreamURL string `json:"streamUrl"`
}
