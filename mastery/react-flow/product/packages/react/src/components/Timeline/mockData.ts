export interface TrackData {
  id: string
  label: string
  type: 'stream' | 'anomaly' | 'telemetry'
  group?: string
  spans?: [number, number][] // [start, duration] in seconds
  events?: number[] // [timestamp] in seconds
  color: 'emerald' | 'blue' | 'red'
}

export const FORENSIC_MOCK_DATA: TrackData[] = [
  {
    id: 'stream-01',
    label: 'LOBBY_CAM_01',
    type: 'stream',
    group: 'Video Feeds',
    spans: [
      [0, 600],
      [1200, 800],
      [2400, 1200],
    ],
    events: [120, 580, 1500, 2600],
    color: 'emerald',
  },
  {
    id: 'stream-02',
    label: 'PARKING_CAM_03',
    type: 'stream',
    group: 'Video Feeds',
    spans: [
      [100, 900],
      [1500, 500],
      [2800, 800],
    ],
    events: [300, 1600],
    color: 'emerald',
  },
  {
    id: 'telemetry-01',
    label: 'AUTH_SERVICE',
    type: 'telemetry',
    group: 'Services',
    spans: [
      [400, 200],
      [1000, 100],
      [1800, 1500],
    ],
    events: [450, 1050, 2000, 2500],
    color: 'blue',
  },
  {
    id: 'telemetry-02',
    label: 'API_GATEWAY',
    type: 'telemetry',
    group: 'Services',
    spans: [
      [200, 400],
      [900, 300],
      [1600, 700],
      [2600, 400],
    ],
    events: [250, 1100, 1700],
    color: 'blue',
  },
  {
    id: 'anomaly-01',
    label: 'NETWORK_LAG',
    type: 'anomaly',
    group: 'Anomalies',
    events: [450, 1250, 1850, 2800, 3100],
    color: 'red',
  },
  {
    id: 'anomaly-02',
    label: 'AUTH_FAILURE',
    type: 'anomaly',
    group: 'Anomalies',
    events: [600, 1400, 2200, 3000],
    color: 'red',
  },
]

/** Collect all events from all tracks, sorted */
export const getAllEvents = (): number[] => {
  const events = FORENSIC_MOCK_DATA.flatMap(t => t.events ?? [])
  return [...new Set(events)].sort((a, b) => a - b)
}
