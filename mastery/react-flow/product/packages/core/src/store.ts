import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { INITIAL_SCALE, DEFAULT_FRAME_RATE, DEFAULT_TRACK_HEIGHT, MIN_TRACK_HEIGHT, MAX_TRACK_HEIGHT, MIN_SCALE, MAX_SCALE, TIMELINE_DURATION } from './constants';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Annotation {
  id: string;
  time: number;
  duration?: number; // Added for Range Annotations (Forensic Spans)
  title: string;
  description?: string;
  color: 'emerald' | 'red' | 'blue' | 'amber';
}

export interface Bookmark {
  id: string;
  time: number;
  label: string;
}

export type TimeFormat = 'absolute' | 'relative';
export type ExportFormat = 'json' | 'csv' | 'clipboard';

export type GridMode = '1x1' | '2x2' | '3x3' | 'hero';

export type AppView = 'live' | 'map' | 'search' | 'locker' | 'settings' | 'gmaps';

export interface TrackMeta {
  id: string;
  muted: boolean;
  solo: boolean;
  hidden: boolean;
  height: number;
  collapsed: boolean;
}

export interface Device {
  id: string;
  label: string;
  status: 'online' | 'offline' | 'error';
  type: 'camera' | 'sensor' | 'gateway';
  ip?: string;
  latency?: number;
  // Spatial Data for Floor Plan
  x?: number; // 0-1 percentage
  y?: number; // 0-1 percentage
  angle?: number; // 0-360 degrees
  fov?: number; // field of view angle
}

export interface EvidenceItem {
  id: string;
  timestamp: number;
  camId: string;
  camLabel: string;
  thumbnail: string;
  type: 'snapshot' | 'clip';
  tags: string[];
  notes?: string;
  caseId?: string;
  hash: string; // Forensic Chain of Custody
}

export interface Detection {
  id: string;
  cls: 'person' | 'vehicle' | 'bag';
  x: number; y: number; w: number; h: number;
  confidence: number;
  attributes?: {
    color?: string;
    action?: string;
    gear?: string[];
  };
}

export interface SystemStats {
  inferenceLatency: number;
  storageThroughput: number;
  networkJitter: number;
  cpuLoad: number;
  gpuLoad: number;
  activeNodes: number;
}

export interface Incident {
  id: string;
  timestamp: number;
  type: 'intrusion' | 'loitering' | 'package' | 'comms';
  severity: 'critical' | 'warning' | 'info';
  label: string;
  camId: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  evidenceIds: string[];
  status: 'active' | 'archived' | 'exported';
}

// ─── State ───────────────────────────────────────────────────────────────────

interface MeshState {
  // Navigation
  activeView: AppView;
  activeSite: 'campus' | 'hq-primary';
  isNavCollapsed: boolean;
  isLeftSidebarCollapsed: boolean;

  // Inventory
  devices: Device[];
  evidence: EvidenceItem[];
  cases: Case[];
  activeCaseId: string | null;

  // Sovereign Data Provider
  detections: Record<string, Detection[]>; // CamId -> Detections

  // Playback
  activeTab: string;
  currentTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  isReversing: boolean;
  loopMode: 'off' | 'full' | 'selection';
  frameRate: number;

  // Scale & View
  scale: number;
  timeFormat: TimeFormat;
  isTimelineCollapsed: boolean;
  isTimelineFullscreen: boolean;
  timelineHeight: number;
  showMinimap: boolean;
  showSettings: boolean;
  showBookmarkPanel: boolean;
  showDetailPanel: boolean;
  detailPanelData: any | null;

  // Selection
  selectionRange: [number, number] | null;
  isSelectionMode: boolean;
  isDraggingPlayhead: boolean;
  isDraggingSelection: boolean;
  selectionDragEdge: 'start' | 'end' | null;

  // Tracks
  selectedTrackIds: string[];
  trackMeta: Record<string, TrackMeta>;
  trackOrder: string[];

  // Annotations & Bookmarks
  annotations: Annotation[];
  bookmarks: Bookmark[];

  // Telemetry
  measuredFps: number;

  // Player & Grid
  gridMode: GridMode;
  activeCameras: string[];
  focusedCamera: string | null;
  isPlayerSidebarCollapsed: boolean; // This is the RIGHT sidebar
  showOSD: boolean;
  showBoundingBoxes: boolean;
  showForensicDetails: boolean;
  ghostTime: number | null;

  // ─── Actions ─────────────────────────────────────────────────────────────

  setActiveView: (view: AppView) => void;
  setActiveSite: (site: 'campus' | 'hq-primary') => void;
  setIsNavCollapsed: (v: boolean) => void;
  setIsLeftSidebarCollapsed: (v: boolean) => void;

  setDevices: (devices: Device[]) => void;
  addEvidence: (item: Omit<EvidenceItem, 'id' | 'hash'>) => void;
  removeEvidence: (id: string) => void;
  
  // Case Management
  addCase: (title: string, description: string) => void;
  addEvidenceToCase: (evidenceId: string, caseId: string) => void;
  setActiveCase: (caseId: string | null) => void;
  exportCaseReport: (caseId: string) => void;

  // Simulation Engine
  tickDetections: (time: number) => void;
  
  // Semantic Search
  searchSemantic: (query: string) => any[]; // Returns ranked results

  // Incidents
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;

  // Infrastructure
  systemStats: SystemStats;
  tickSystemStats: () => void;

  // Forensic Tools
  isMagnifierActive: boolean;
  magnifierPos: { x: number; y: number };
  magnifierCameraId: string | null;
  toggleMagnifier: (active?: boolean) => void;
  updateMagnifierPos: (x: number, y: number, camId: string | null) => void;

  // Forensic Intelligence
  selectedDetectionId: string | null;
  setSelectedDetectionId: (id: string | null) => void;
  
  // Chain of Custody & Audit
  auditLogs: { id: string; msg: string; ts: number }[];
  addAuditLog: (msg: string) => void;

  setActiveTab: (tab: string) => void;
  setCurrentTime: (time: number | ((prev: number) => number)) => void;
  setScale: (scale: number | ((prev: number) => number)) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setIsReversing: (isReversing: boolean) => void;
  setLoopMode: (mode: 'off' | 'full' | 'selection') => void;
  setFrameRate: (fps: number) => void;

  setGridMode: (mode: GridMode) => void;
  setActiveCameras: (cameras: string[]) => void;
  setFocusedCamera: (camId: string | null) => void;
  setIsPlayerSidebarCollapsed: (collapsed: boolean) => void;
  setShowOSD: (show: boolean) => void;
  setShowBoundingBoxes: (show: boolean) => void;
  setShowForensicDetails: (show: boolean) => void;
  setGhostTime: (v: number | null) => void;

  setSelectionRange: (range: [number, number] | null) => void;
  setIsSelectionMode: (mode: boolean) => void;
  setIsDraggingPlayhead: (v: boolean) => void;
  setIsDraggingSelection: (v: boolean) => void;
  setSelectionDragEdge: (edge: 'start' | 'end' | null) => void;

  toggleTrackSelection: (id: string) => void;
  setTrackMeta: (id: string, meta: Partial<TrackMeta>) => void;
  setTrackOrder: (order: string[]) => void;
  toggleTrackMute: (id: string) => void;
  toggleTrackSolo: (id: string) => void;
  toggleTrackHidden: (id: string) => void;
  setTrackHeight: (id: string, height: number) => void;

  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  addBookmark: (time: number, label?: string) => void;
  removeBookmark: (id: string) => void;

  setTimeFormat: (format: TimeFormat) => void;
  setIsTimelineCollapsed: (v: boolean) => void;
  setIsTimelineFullscreen: (v: boolean) => void;
  setTimelineHeight: (h: number) => void;
  setShowMinimap: (v: boolean) => void;
  setShowSettings: (v: boolean) => void;
  setShowBookmarkPanel: (v: boolean) => void;
  setShowDetailPanel: (v: boolean) => void;
  setDetailPanelData: (data: any | null) => void;
  setMeasuredFps: (fps: number) => void;

  handleZoom: (deltaY: number) => void;
  frameStep: (direction: 1 | -1) => void;
  jumpToStart: () => void;
  jumpToEnd: () => void;
  jumpToNextKeyframe: () => void;
  jumpToPrevKeyframe: () => void;
  jumpToNextBookmark: () => void;
  jumpToPrevBookmark: () => void;
  jumpToNextEvent: (events: number[]) => void;
  jumpToPrevEvent: (events: number[]) => void;
  zoomToFit: (duration: number) => void;
  zoomToSelection: () => void;
  clearSelection: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useMeshStore = create<MeshState>()(
  subscribeWithSelector((set, get) => ({
    // Navigation
    activeView: 'live',
    activeSite: 'hq-primary',
    isNavCollapsed: true,
    isLeftSidebarCollapsed: false,

    // Inventory
    devices: [
      { id: 'stream-01', label: 'LOBBY_CAM_01', status: 'online', type: 'camera', ip: '192.168.1.101', latency: 12, x: 0.25, y: 0.3, angle: 45, fov: 90 },
      { id: 'stream-02', label: 'PARKING_CAM_03', status: 'online', type: 'camera', ip: '192.168.1.102', latency: 45, x: 0.7, y: 0.2, angle: 135, fov: 110 },
      { id: 'stream-03', label: 'BACK_EXIT_02', status: 'online', type: 'camera', ip: '192.168.1.103', latency: 22, x: 0.15, y: 0.8, angle: -45, fov: 80 },
      { id: 'stream-04', label: 'SERVER_RM_01', status: 'offline', type: 'camera', ip: '192.168.1.104', x: 0.8, y: 0.7, angle: 220, fov: 90 },
      { id: 'stream-05', label: 'LOADING_DOCK', status: 'error', type: 'camera', ip: '192.168.1.105', x: 0.5, y: 0.5, angle: 90, fov: 120 },
    ],
    evidence: [],
    cases: [
      { id: 'case-01', title: 'Lobby Incident 05/09', description: 'Suspected unauthorized access in Main Lobby', createdAt: Date.now(), evidenceIds: [], status: 'active' }
    ],
    activeCaseId: 'case-01',
    detections: {},
    incidents: [
      { id: 'inc-01', timestamp: Date.now() - 300000, type: 'intrusion', severity: 'critical', label: 'Perimeter Breach: Zone 04', camId: 'stream-01' },
      { id: 'inc-02', timestamp: Date.now() - 120000, type: 'comms', severity: 'info', label: 'Operator Alpha: Sector Clear', camId: 'stream-01' },
    ],

    addIncident: (inc) => {
      const newInc = {
        ...inc,
        id: `inc-${Math.random().toString(36).substring(7)}`,
        timestamp: Date.now()
      };
      set(state => ({ incidents: [newInc, ...state.incidents].slice(0, 50) }));
    },

    // Playback
    activeTab: 'Live View',
    currentTime: 1800,
    isPlaying: false,
    playbackSpeed: 1,
    isReversing: false,
    loopMode: 'off' as const,
    frameRate: DEFAULT_FRAME_RATE,

    // Scale & View
    scale: INITIAL_SCALE,
    timeFormat: 'absolute' as TimeFormat,
    isTimelineCollapsed: false,
    isTimelineFullscreen: false,
    timelineHeight: 280,
    showMinimap: false,
    showSettings: false,
    showBookmarkPanel: false,
    showDetailPanel: false,
    detailPanelData: null,

    // Selection
    selectionRange: null,
    isSelectionMode: false,
    isDraggingPlayhead: false,
    isDraggingSelection: false,
    selectionDragEdge: null,

    // Tracks
    selectedTrackIds: [],
    trackMeta: {},
    trackOrder: [],

    // Annotations & Bookmarks
    annotations: [
      { id: 'ann-1', time: 1300, duration: 400, title: 'SUSPECT_DETECTION', color: 'amber' },
      { id: 'ann-2', time: 2500, title: 'PERIMETER_BREACH', color: 'red' },
    ],
    bookmarks: [],

    // Telemetry
    measuredFps: 0,

    // Player & Grid
    gridMode: 'hero',
    activeCameras: ['stream-01', 'stream-02'],
    focusedCamera: null,
    isPlayerSidebarCollapsed: true,
    showOSD: true,
    showBoundingBoxes: true,
    showForensicDetails: true,
    ghostTime: null,

    // ─── Setters ───────────────────────────────────────────────────────────

    setActiveView: (view) => {
      get().addAuditLog(`Tactical view transition: ${view.toUpperCase()}`);
      set({ activeView: view });
    },
    setActiveSite: (site) => set({ activeSite: site }),
    setIsNavCollapsed: (isNavCollapsed) => set({ isNavCollapsed }),
    setIsLeftSidebarCollapsed: (isLeftSidebarCollapsed) => set({ isLeftSidebarCollapsed }),

    setDevices: (devices) => set({ devices }),
    
    addEvidence: (item) => {
      get().addAuditLog(`Evidence captured: ${item.type.toUpperCase()} from source ${item.camId}`);
      set((state) => {
        const id = `ev-${Date.now()}`;
        const hash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const newItem = { ...item, id, hash };
        const updatedCases = state.cases.map(c => 
          c.id === state.activeCaseId ? { ...c, evidenceIds: [...c.evidenceIds, id] } : c
        );
        return {
          evidence: [...state.evidence, newItem],
          cases: updatedCases
        };
      });
    },

    removeEvidence: (id) => set((state) => ({
      evidence: state.evidence.filter(e => e.id !== id),
      cases: state.cases.map(c => ({ ...c, evidenceIds: c.evidenceIds.filter(eid => eid !== id) }))
    })),

    addCase: (title, description) => set((state) => ({
      cases: [...state.cases, { id: `case-${Date.now()}`, title, description, createdAt: Date.now(), evidenceIds: [], status: 'active' }]
    })),

    addEvidenceToCase: (evidenceId, caseId) => set((state) => ({
      cases: state.cases.map(c => c.id === caseId ? { ...c, evidenceIds: Array.from(new Set([...c.evidenceIds, evidenceId])) } : c)
    })),

    setActiveCase: (caseId) => set({ activeCaseId: caseId }),

    exportCaseReport: (caseId) => {
      const state = get();
      const targetCase = state.cases.find(c => c.id === caseId);
      if (!targetCase) return;

      const reportEvidence = state.evidence.filter(e => targetCase.evidenceIds.includes(e.id));
      
      const report = {
        meta: {
          reportId: `REP-${Math.random().toString(36).substring(7).toUpperCase()}`,
          generatedAt: new Date().toISOString(),
          validator: 'O_MESH_L7_SOVEREIGN_ENGINE',
          integrityStatus: 'VALID'
        },
        case: targetCase,
        evidence: reportEvidence.map(e => ({
          id: e.id,
          timestamp: e.timestamp,
          cam: e.camLabel,
          forensicHash: e.hash,
          verification: 'VERIFIED_CHAIN_OF_CUSTODY'
        }))
      };

      // In a real app, this would trigger a PDF generation or download
      console.log('Forensic Report Generated:', report);
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forensic_report_${targetCase.title.replace(/\s+/g, '_')}.json`;
      a.click();
    },

    tickDetections: (time) => {
      // Sovereign Simulation Engine: Generates deterministic detections based on playback time
      const simulation: Record<string, Detection[]> = {};
      
      // Lobby Simulation
      if (time > 100 && time < 140) {
        simulation['stream-01'] = [
          { id: 'det-01', cls: 'person', x: 0.25, y: 0.3, w: 0.08, h: 0.25, confidence: 0.97, attributes: { color: 'red', gear: ['backpack'] } },
          { id: 'det-02', cls: 'person', x: 0.6, y: 0.35, w: 0.06, h: 0.2, confidence: 0.89, attributes: { color: 'blue' } }
        ];
      } else if (time > 500 && time < 620) {
        simulation['stream-01'] = [
          { id: 'det-03', cls: 'person', x: 0.45, y: 0.5, w: 0.12, h: 0.3, confidence: 0.94, attributes: { gear: ['umbrella'] } }
        ];
      }

      // Parking Simulation
      if (time > 200 && time < 350) {
        simulation['stream-02'] = [
          { id: 'det-04', cls: 'vehicle', x: 0.15, y: 0.55, w: 0.2, h: 0.12, confidence: 0.98, attributes: { color: 'white' } },
          { id: 'det-05', cls: 'vehicle', x: 0.5, y: 0.6, w: 0.18, h: 0.1, confidence: 0.95, attributes: { color: 'black' } }
        ];
      }

      set({ detections: simulation });
      get().tickSystemStats();
    },

    tickSystemStats: () => {
      set((state) => ({
        systemStats: {
          ...state.systemStats,
          inferenceLatency: 120 + Math.random() * 10,
          storageThroughput: 840 + Math.random() * 40,
          networkJitter: 10 + Math.random() * 5,
          cpuLoad: 40 + Math.random() * 15,
          gpuLoad: 65 + Math.random() * 10,
        }
      }));
    },

    searchSemantic: (query) => {
      // Mock Semantic Matcher: In a real app, this would query a vector DB
      const q = query.toLowerCase();
      const results = [];

      // Manual mock matching for demo
      if (q.includes('person') || q.includes('red')) {
        results.push({ time: 120, camId: 'stream-01', camLabel: 'LOBBY_CAM_01', score: 0.94, match: 'Person in red gear' });
      }
      if (q.includes('blue')) {
        results.push({ time: 130, camId: 'stream-01', camLabel: 'LOBBY_CAM_01', score: 0.88, match: 'Person in blue clothing' });
      }
      if (q.includes('vehicle') || q.includes('white')) {
        results.push({ time: 250, camId: 'stream-02', camLabel: 'PARKING_CAM_03', score: 0.98, match: 'White vehicle detected' });
      }
      
      return results.sort((a, b) => b.score - a.score);
    },

    systemStats: {
      inferenceLatency: 124,
      storageThroughput: 850,
      networkJitter: 12,
      cpuLoad: 42,
      gpuLoad: 68,
      activeNodes: 5
    },

    isMagnifierActive: false,
    magnifierPos: { x: 0, y: 0 },
    magnifierCameraId: null,

    selectedDetectionId: null,
    setSelectedDetectionId: (id) => set({ selectedDetectionId: id }),

    auditLogs: [
      { id: '0', msg: 'Forensic environment initialized. Integrity verified.', ts: Date.now() }
    ],
    addAuditLog: (msg) => set((state) => ({
      auditLogs: [{ id: Math.random().toString(36).substr(2, 9), msg, ts: Date.now() }, ...state.auditLogs].slice(0, 50)
    })),

    toggleMagnifier: (active) => set((state) => {
      const newState = active !== undefined ? active : !state.isMagnifierActive;
      get().addAuditLog(newState ? 'Forensic Magnifier enabled.' : 'Forensic Magnifier disabled.');
      return { isMagnifierActive: newState };
    }),
    
    updateMagnifierPos: (x, y, camId) => set({ 
      magnifierPos: { x, y }, 
      magnifierCameraId: camId 
    }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    setCurrentTime: (time) =>
      set((state) => ({
        currentTime: typeof time === 'function' ? time(state.currentTime) : time,
      })),

    setScale: (scale) =>
      set((state) => ({
        scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, typeof scale === 'function' ? scale(state.scale) : scale)),
      })),

    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    setIsReversing: (isReversing) => set({ isReversing }),
    setLoopMode: (mode) => set({ loopMode: mode }),
    setFrameRate: (fps) => set({ frameRate: fps }),

    setGridMode: (mode) => set({ gridMode: mode }),
    setActiveCameras: (cameras) => set({ activeCameras: cameras }),
    setFocusedCamera: (camId) => set({ focusedCamera: camId }),
    setIsPlayerSidebarCollapsed: (collapsed) => set({ isPlayerSidebarCollapsed: collapsed }),
    setShowOSD: (show) => set({ showOSD: show }),
    setShowBoundingBoxes: (show) => set({ showBoundingBoxes: show }),
    setShowForensicDetails: (show) => set({ showForensicDetails: show }),
    setGhostTime: (v) => set({ ghostTime: v }),

    setSelectionRange: (range) => set({ selectionRange: range }),
    setIsSelectionMode: (isSelectionMode) => set({ isSelectionMode }),
    setIsDraggingPlayhead: (isDraggingPlayhead) => set({ isDraggingPlayhead }),
    setIsDraggingSelection: (isDraggingSelection) => set({ isDraggingSelection }),
    setSelectionDragEdge: (selectionDragEdge) => set({ selectionDragEdge }),

    toggleTrackSelection: (id) =>
      set((state) => ({
        selectedTrackIds: state.selectedTrackIds.includes(id)
          ? state.selectedTrackIds.filter((tid) => tid !== id)
          : [...state.selectedTrackIds, id],
      })),

    setTrackMeta: (id, meta) =>
      set((state) => ({
        trackMeta: {
          ...state.trackMeta,
          [id]: { ...state.trackMeta[id], ...meta },
        },
      })),

    setTrackOrder: (trackOrder) => set({ trackOrder }),

    toggleTrackMute: (id) =>
      set((state) => {
        const existing = state.trackMeta[id] ?? { id, muted: false, solo: false, hidden: false, height: DEFAULT_TRACK_HEIGHT, collapsed: false };
        return { trackMeta: { ...state.trackMeta, [id]: { ...existing, muted: !existing.muted } } };
      }),

    toggleTrackSolo: (id) =>
      set((state) => {
        const existing = state.trackMeta[id] ?? { id, muted: false, solo: false, hidden: false, height: DEFAULT_TRACK_HEIGHT, collapsed: false };
        return { trackMeta: { ...state.trackMeta, [id]: { ...existing, solo: !existing.solo } } };
      }),

    toggleTrackHidden: (id) =>
      set((state) => {
        const existing = state.trackMeta[id] ?? { id, muted: false, solo: false, hidden: false, height: DEFAULT_TRACK_HEIGHT, collapsed: false };
        return { trackMeta: { ...state.trackMeta, [id]: { ...existing, hidden: !existing.hidden } } };
      }),

    setTrackHeight: (id, height) =>
      set((state) => {
        const clamped = Math.min(MAX_TRACK_HEIGHT, Math.max(MIN_TRACK_HEIGHT, height));
        const existing = state.trackMeta[id] ?? { id, muted: false, solo: false, hidden: false, height: DEFAULT_TRACK_HEIGHT, collapsed: false };
        return { trackMeta: { ...state.trackMeta, [id]: { ...existing, height: clamped } } };
      }),

    addAnnotation: (ann) => set((state) => ({
      annotations: [...state.annotations, { ...ann, id: Math.random().toString(36).substr(2, 9) }]
    })),
    updateAnnotation: (id, updates) => set((state) => ({
      annotations: state.annotations.map(a => a.id === id ? { ...a, ...updates } : a)
    })),
    removeAnnotation: (id) => set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id)
    })),

    addBookmark: (time, label) =>
      set((state) => ({
        bookmarks: [
          ...state.bookmarks,
          {
            id: `bm-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            time,
            label: label ?? `T+${Math.floor(time / 60).toString().padStart(2, '0')}:${Math.floor(time % 60).toString().padStart(2, '0')}`,
          },
        ],
      })),

    removeBookmark: (id) =>
      set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id),
      })),

    setTimeFormat: (timeFormat) => set({ timeFormat }),
    setIsTimelineCollapsed: (isTimelineCollapsed) => set({ isTimelineCollapsed }),
    setIsTimelineFullscreen: (isTimelineFullscreen) => set({ isTimelineFullscreen }),
    setTimelineHeight: (timelineHeight) => set({ timelineHeight }),
    setShowMinimap: (showMinimap) => set({ showMinimap }),
    setShowSettings: (showSettings) => set({ showSettings }),
    setShowBookmarkPanel: (showBookmarkPanel) => set({ showBookmarkPanel }),
    setShowDetailPanel: (showDetailPanel) => set({ showDetailPanel }),
    setDetailPanelData: (detailPanelData) => set({ detailPanelData }),
    setMeasuredFps: (measuredFps) => set({ measuredFps }),

    // ─── Complex Actions ───────────────────────────────────────────────────

    handleZoom: (deltaY) => {
      const { scale } = get();
      const factor = deltaY < 0 ? 1.15 : 1 / 1.15;
      set({ scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor)) });
    },

    frameStep: (direction) => {
      const { currentTime, frameRate } = get();
      const frameDuration = 1 / frameRate;
      const next = currentTime + frameDuration * direction;
      set({ currentTime: Math.max(0, next), isPlaying: false });
    },

    jumpToStart: () => set({ currentTime: 0 }),
    jumpToStop: () => set({ isPlaying: false }),
    jumpToEnd: () => {
      set({ currentTime: TIMELINE_DURATION });
    },
    jumpToNextKeyframe: () => {
      const { currentTime } = get();
      const nextSec = Math.floor(currentTime) + 1;
      set({ currentTime: Math.min(TIMELINE_DURATION, nextSec) });
    },
    jumpToPrevKeyframe: () => {
      const { currentTime } = get();
      const prevSec = Math.ceil(currentTime) - 1;
      set({ currentTime: Math.max(0, prevSec) });
    },

    jumpToNextBookmark: () => {
      const { currentTime, bookmarks } = get();
      const sorted = [...bookmarks].sort((a, b) => a.time - b.time);
      const next = sorted.find((b) => b.time > currentTime + 0.1);
      if (next) set({ currentTime: next.time });
    },

    jumpToPrevBookmark: () => {
      const { currentTime, bookmarks } = get();
      const sorted = [...bookmarks].sort((a, b) => b.time - a.time);
      const prev = sorted.find((b) => b.time < currentTime - 0.1);
      if (prev) set({ currentTime: prev.time });
    },

    jumpToNextEvent: (events) => {
      const { currentTime } = get();
      const sorted = [...events].sort((a, b) => a - b);
      const next = sorted.find((t) => t > currentTime + 0.1);
      if (next != null) set({ currentTime: next });
    },

    jumpToPrevEvent: (events) => {
      const { currentTime } = get();
      const sorted = [...events].sort((a, b) => b - a);
      const prev = sorted.find((t) => t < currentTime - 0.1);
      if (prev != null) set({ currentTime: prev });
    },

    zoomToFit: (duration) => {
      const targetScale = (1200 / duration) * 60;
      set({ scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale)) });
    },

    zoomToSelection: () => {
      const { selectionRange } = get();
      if (!selectionRange) return;
      const duration = Math.abs(selectionRange[1] - selectionRange[0]);
      if (duration < 0.01) return;
      const targetScale = (1200 / duration) * 60;
      set({ scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, targetScale)) });
    },

    clearSelection: () => set({ selectionRange: null, isSelectionMode: false }),
  })),
);
