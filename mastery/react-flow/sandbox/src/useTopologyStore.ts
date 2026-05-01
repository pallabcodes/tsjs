import { create } from 'zustand';
import type { Viewport, Point } from '@core/inv02-viewport/src/index';

interface TopologyState {
  viewport: Viewport;
  selectedId: string | null;
  hoveredId: string | null;
  isBlueprint: boolean;
  isSummaryView: boolean;
  activeFilter: string;
  inspectedId: string | null;
  
  // WAL (Write-Ahead Log) Metadata
  mutationCount: number;
  lastFlushTime: number;

  // Actions
  setViewport: (v: Viewport) => void;
  setSelectedId: (id: string | null) => void;
  setHoveredId: (id: string | null) => void;
  setIsBlueprint: (val: boolean) => void;
  setIsSummaryView: (val: boolean) => void;
  setActiveFilter: (f: string) => void;
  setInspectedId: (id: string | null) => void;
  
  // Surgical Snap
  recordMutation: () => void;
  flushPersistence: (layout: Record<string, Point>) => void;
}

export const MAX_NODES = 1000;
export const BOUNDARY = { width: 10000, height: 10000 };
export const WORLD_CENTER = { x: 5000, y: 5000 };
export const getInitialZoom = () => {
  if (typeof window === 'undefined') return 0.35;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.min(w / 4000, h / 3500, 0.38);
};

export const useTopologyStore = create<TopologyState>((set, get) => ({
  viewport: {
    x: typeof window !== 'undefined' ? window.innerWidth / 2 - WORLD_CENTER.x * getInitialZoom() : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 - WORLD_CENTER.y * getInitialZoom() : 0,
    zoom: getInitialZoom()
  },
  selectedId: null,
  hoveredId: null,
  isBlueprint: localStorage.getItem('cntp-blueprint') === 'true',
  isSummaryView: localStorage.getItem('cntp-summary') === 'true',
  activeFilter: localStorage.getItem('cntp-filter') || 'ALL',
  inspectedId: null,
  
  mutationCount: 0,
  lastFlushTime: Date.now(),

  setViewport: (v) => set({ viewport: v }),
  setSelectedId: (id) => set({ selectedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),
  setInspectedId: (id) => set({ inspectedId: id }),
  
  setIsBlueprint: (val) => {
    localStorage.setItem('cntp-blueprint', String(val));
    set({ isBlueprint: val });
  },
  
  setIsSummaryView: (val) => {
    localStorage.setItem('cntp-summary', String(val));
    set({ isSummaryView: val });
  },
  
  setActiveFilter: (f) => {
    localStorage.setItem('cntp-filter', f);
    set({ activeFilter: f });
  },

  recordMutation: () => set((state) => ({ mutationCount: state.mutationCount + 1 })),

  flushPersistence: (layout) => {
    const now = Date.now();
    // L7 Optimization: Only hit the disk if there are pending mutations
    if (get().mutationCount > 0 || now - get().lastFlushTime > 30000) {
      localStorage.setItem('cntp-topology-layout', JSON.stringify(layout));
      set({ mutationCount: 0, lastFlushTime: now });
    }
  }
}));
