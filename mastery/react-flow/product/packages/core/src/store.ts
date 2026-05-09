import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { INITIAL_SCALE, DEFAULT_FRAME_RATE, DEFAULT_TRACK_HEIGHT, MIN_TRACK_HEIGHT, MAX_TRACK_HEIGHT, MIN_SCALE, MAX_SCALE, TIMELINE_DURATION } from './constants';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Annotation {
  id: string;
  time: number;
  title: string;
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

export type AppView = 'live' | 'map' | 'search' | 'locker' | 'settings';

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
}

// ─── State ───────────────────────────────────────────────────────────────────

interface MeshState {
  // Navigation
  activeView: AppView;
  isNavCollapsed: boolean;
  isLeftSidebarCollapsed: boolean;

  // Inventory
  devices: Device[];
  evidence: EvidenceItem[];

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

  // ─── Actions ─────────────────────────────────────────────────────────────

  setActiveView: (view: AppView) => void;
  setIsNavCollapsed: (v: boolean) => void;
  setIsLeftSidebarCollapsed: (v: boolean) => void;

  setDevices: (devices: Device[]) => void;
  addEvidence: (item: Omit<EvidenceItem, 'id'>) => void;
  removeEvidence: (id: string) => void;

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
    annotations: [],
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

    // ─── Setters ───────────────────────────────────────────────────────────

    setActiveView: (view) => set({ activeView: view }),
    setIsNavCollapsed: (isNavCollapsed) => set({ isNavCollapsed }),
    setIsLeftSidebarCollapsed: (isLeftSidebarCollapsed) => set({ isLeftSidebarCollapsed }),

    setDevices: (devices) => set({ devices }),
    addEvidence: (item) => set((state) => ({
      evidence: [...state.evidence, { ...item, id: `ev-${Date.now()}` }]
    })),
    removeEvidence: (id) => set((state) => ({
      evidence: state.evidence.filter(e => e.id !== id)
    })),

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

    addAnnotation: (annotation) =>
      set((state) => ({
        annotations: [
          ...state.annotations,
          { ...annotation, id: `ann-${Date.now()}-${Math.random().toString(36).slice(2)}` },
        ],
      })),

    removeAnnotation: (id) =>
      set((state) => ({
        annotations: state.annotations.filter((a) => a.id !== id),
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
