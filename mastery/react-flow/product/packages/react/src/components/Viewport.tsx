import { useMeshStore, cn, formatTime } from '@ostream/core';
import { CameraFeed } from './CameraFeed';
import {
  Square, LayoutGrid, Grid3X3, Maximize,
  PanelRightClose, PanelRightOpen,
  PanelLeftClose, PanelLeftOpen,
  ScanLine, ScanFace, Eye, EyeOff,
} from 'lucide-react';
import { FORENSIC_MOCK_DATA } from './Timeline/mockData';

// ─── Mock Detection Data (shared with CameraFeed for sidebar display) ────────
// In production these would come from the same inference pipeline.
interface Detection {
  timeStart: number;
  timeEnd: number;
  cls: string;
  confidence: number;
}

const MOCK_DETECTIONS: Record<string, Detection[]> = {
  'LOBBY_CAM_01': [
    { timeStart: 100, timeEnd: 140, cls: 'person', confidence: 0.97 },
    { timeStart: 100, timeEnd: 140, cls: 'person', confidence: 0.89 },
    { timeStart: 500, timeEnd: 620, cls: 'person', confidence: 0.94 },
    { timeStart: 1200, timeEnd: 1350, cls: 'bag', confidence: 0.72 },
    { timeStart: 1500, timeEnd: 1550, cls: 'person', confidence: 0.96 },
    { timeStart: 2400, timeEnd: 2500, cls: 'person', confidence: 0.91 },
  ],
  'PARKING_CAM_03': [
    { timeStart: 200, timeEnd: 350, cls: 'vehicle', confidence: 0.98 },
    { timeStart: 200, timeEnd: 350, cls: 'vehicle', confidence: 0.95 },
    { timeStart: 800, timeEnd: 950, cls: 'person', confidence: 0.88 },
    { timeStart: 1500, timeEnd: 1650, cls: 'vehicle', confidence: 0.93 },
    { timeStart: 2800, timeEnd: 2900, cls: 'person', confidence: 0.85 },
  ],
};

const CLS_COLORS: Record<string, string> = {
  person: 'text-blue-400',
  vehicle: 'text-amber-400',
  bag: 'text-red-400',
};

const CLS_BG: Record<string, string> = {
  person: 'bg-blue-500/10 border-blue-500/20',
  vehicle: 'bg-amber-500/10 border-amber-500/20',
  bag: 'bg-red-500/10 border-red-500/20',
};

// ─── Component ──────────────────────────────────────────────────────────────────

export const Viewport = () => {
  const {
    gridMode, setGridMode,
    activeCameras, setActiveCameras,
    focusedCamera, setFocusedCamera,
    currentTime, setCurrentTime,
    frameRate,
    isPlayerSidebarCollapsed, setIsPlayerSidebarCollapsed,
    isLeftSidebarCollapsed, setIsLeftSidebarCollapsed,
    showOSD, setShowOSD,
    showBoundingBoxes, setShowBoundingBoxes,
  } = useMeshStore();

  // ─── Derived data ─────────────────────────────────────────────────────────

  // Resolve focused camera label
  const focusedCamId = focusedCamera ?? activeCameras[0];
  const focusedLabel = FORENSIC_MOCK_DATA.find(t => t.id === focusedCamId)?.label ?? 'FEED_01';

  // Events from all tracks near currentTime (for the event log)
  const recentEvents = FORENSIC_MOCK_DATA
    .flatMap(track => track.events?.map(ts => ({
      type: track.type,
      label: track.label,
      ts,
      id: track.id,
    })) ?? [])
    .filter(event => event.ts <= currentTime + 30 && event.ts >= currentTime - 120)
    .sort((a, b) => b.ts - a.ts);

  // Active detections on the focused camera
  const focusedDetections = (MOCK_DETECTIONS[focusedLabel] ?? []).filter(
    d => currentTime >= d.timeStart && currentTime <= d.timeEnd
  );

  // All detections for the focused camera (for the log)
  const allDetectionsForFocused = (MOCK_DETECTIONS[focusedLabel] ?? [])
    .map((d, i) => ({ ...d, idx: i }))
    .sort((a, b) => {
      // Sort: active first, then by proximity
      const aActive = currentTime >= a.timeStart && currentTime <= a.timeEnd;
      const bActive = currentTime >= b.timeStart && currentTime <= b.timeEnd;
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return Math.abs(currentTime - a.timeStart) - Math.abs(currentTime - b.timeStart);
    });

  // ─── Grid helpers ─────────────────────────────────────────────────────────

  const handleGridChange = (mode: typeof gridMode) => {
    setGridMode(mode);
    const count = mode === '1x1' ? 1 : mode === '2x2' ? 4 : mode === '3x3' ? 9 : 4;
    const streamIds = FORENSIC_MOCK_DATA.filter(t => t.type === 'stream').map(t => t.id);
    const newCameras = [...activeCameras];

    while (newCameras.length < count && newCameras.length < streamIds.length) {
      const next = streamIds.find(id => !newCameras.includes(id));
      if (next) newCameras.push(next);
      else break;
    }

    setActiveCameras(newCameras.slice(0, count));
  };

  const renderGrid = () => {
    const makeFeed = (id: string, i: number, active: boolean) => (
      <CameraFeed
        key={`${id}-${i}`}
        id={id}
        label={FORENSIC_MOCK_DATA.find(t => t.id === id)?.label ?? `FEED_0${i + 1}`}
        isActive={active}
        onClick={() => setFocusedCamera(id)}
      />
    );

    if (gridMode === '1x1') {
      return (
        <div className="w-full h-full">
          {makeFeed(activeCameras[0], 0, true)}
        </div>
      );
    }

    if (gridMode === '2x2') {
      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px bg-white/[0.06]">
          {[0, 1, 2, 3].map((i) => {
            const id = activeCameras[i];
            if (!id) return <div key={`empty-${i}`} className="min-h-0 bg-[#050505] flex items-center justify-center"><span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No Signal</span></div>;
            return (
              <div key={`${id}-${i}`} className="min-h-0">
                {makeFeed(id, i, focusedCamId === id)}
              </div>
            );
          })}
        </div>
      );
    }

    if (gridMode === '3x3') {
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-px bg-white/[0.06]">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const id = activeCameras[i];
            if (!id) return <div key={`empty-${i}`} className="min-h-0 bg-[#050505] flex items-center justify-center"><span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No Signal</span></div>;
            return (
              <div key={`${id}-${i}`} className="min-h-0">
                {makeFeed(id, i, focusedCamId === id)}
              </div>
            );
          })}
        </div>
      );
    }

    if (gridMode === 'hero') {
      return (
        <div className="w-full h-full grid grid-cols-5 grid-rows-3 gap-px bg-white/[0.04]">
          <div className="col-span-4 row-span-3 min-h-0 bg-[#050505]">
            {activeCameras[0] ? makeFeed(activeCameras[0], 0, true) : <div className="w-full h-full flex items-center justify-center"><span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">No Signal</span></div>}
          </div>
          <div className="col-span-1 row-span-3 flex flex-col gap-px bg-white/[0.04] min-h-0">
            {[1, 2, 3].map((i) => {
              const id = activeCameras[i];
              if (!id) return <div key={`empty-${i}`} className="flex-1 min-h-0 bg-[#050505] flex items-center justify-center border-l border-white/[0.02]"><span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Empty Slot</span></div>;
              return (
                <div key={`${id}-${i}`} className="flex-1 min-h-0 border-l border-white/[0.02]">
                  <CameraFeed
                    id={id}
                    label={FORENSIC_MOCK_DATA.find(t => t.id === id)?.label ?? `FEED_0${i + 1}`}
                    isActive={false}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newCams = [...activeCameras];
                      newCams[0] = id;
                      newCams[i] = activeCameras[0];
                      setActiveCameras(newCams);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  // ─── Toolbar button helper ────────────────────────────────────────────────

  const ToolbarBtn = ({
    active, onClick, title, children,
  }: { active: boolean; onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={cn(
        "w-7 h-7 flex items-center justify-center transition-colors",
        active
          ? "bg-vms-accent/15 text-vms-accent"
          : "text-white/35 hover:bg-white/[0.06] hover:text-white/70"
      )}
      title={title}
    >
      {children}
    </button>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#020202]">
      {/* ─── Player Toolbar ──────────────────────────────────────────────── */}
      <div className="h-9 border-b border-white/[0.06] bg-[#0a0a0a] flex items-center justify-between px-3 z-10 flex-shrink-0">
        {/* Left: Title + focused camera */}
        <div className="flex items-center gap-3">
          <ToolbarBtn 
            active={!isLeftSidebarCollapsed}
            onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            title={isLeftSidebarCollapsed ? "Show Device Tree" : "Hide Device Tree"}
          >
            {isLeftSidebarCollapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
          </ToolbarBtn>
          <div className="w-px h-4 bg-white/[0.08]" />
          <span className="text-[9px] font-semibold text-white/40 tracking-widest uppercase font-mono">
            Evidence Review
          </span>
          <div className="w-px h-4 bg-white/[0.08]" />
          <span className="text-[10px] font-mono text-white/70">
            {focusedLabel}
          </span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center">
          {/* Display toggles */}
          <div className="flex items-center gap-px mr-3">
            <ToolbarBtn
              active={showBoundingBoxes}
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              title={showBoundingBoxes ? "Hide Detections" : "Show Detections"}
            >
              {showBoundingBoxes ? <ScanFace size={12} /> : <ScanLine size={12} />}
            </ToolbarBtn>
            <ToolbarBtn
              active={showOSD}
              onClick={() => setShowOSD(!showOSD)}
              title={showOSD ? "Hide OSD" : "Show OSD"}
            >
              {showOSD ? <Eye size={12} /> : <EyeOff size={12} />}
            </ToolbarBtn>
          </div>

          <div className="w-px h-4 bg-white/[0.08] mr-3" />

          {/* Grid layout */}
          <div className="flex items-center gap-px mr-3">
            <ToolbarBtn active={gridMode === '1x1'} onClick={() => handleGridChange('1x1')} title="Single Feed">
              <Square size={11} />
            </ToolbarBtn>
            <ToolbarBtn active={gridMode === 'hero'} onClick={() => handleGridChange('hero')} title="Hero + Sidebar">
              <Maximize size={11} />
            </ToolbarBtn>
            <ToolbarBtn active={gridMode === '2x2'} onClick={() => handleGridChange('2x2')} title="2×2 Grid">
              <LayoutGrid size={11} />
            </ToolbarBtn>
            <ToolbarBtn active={gridMode === '3x3'} onClick={() => handleGridChange('3x3')} title="3×3 Grid">
              <Grid3X3 size={11} />
            </ToolbarBtn>
          </div>

          <div className="w-px h-4 bg-white/[0.08] mr-3" />

          {/* Sidebar toggle */}
          <ToolbarBtn
            active={!isPlayerSidebarCollapsed}
            onClick={() => setIsPlayerSidebarCollapsed(!isPlayerSidebarCollapsed)}
            title={isPlayerSidebarCollapsed ? "Show Analysis Panel" : "Hide Analysis Panel"}
          >
            {isPlayerSidebarCollapsed ? <PanelRightOpen size={12} /> : <PanelRightClose size={12} />}
          </ToolbarBtn>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 overflow-hidden relative">
          {renderGrid()}
        </div>

        {/* ─── Analysis Sidebar ──────────────────────────────────────────── */}
        {!isPlayerSidebarCollapsed && (
          <div className="w-72 flex-shrink-0 border-l border-white/[0.06] bg-[#0a0a0a] flex flex-col overflow-hidden">

            {/* Section 1: Focused Camera Info */}
            <div className="p-3 border-b border-white/[0.06]">
              <div className="text-[8px] font-mono text-white/30 tracking-widest uppercase mb-2">
                Focused Source
              </div>
              <div className="text-[11px] font-mono text-white/80 font-semibold">
                {focusedLabel}
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="text-[9px] font-mono text-white/30">Frame</div>
                <div className="text-[9px] font-mono text-white/60 text-right">
                  {String(Math.floor(currentTime * frameRate)).padStart(6, '0')}
                </div>
                <div className="text-[9px] font-mono text-white/30">Timecode</div>
                <div className="text-[9px] font-mono text-white/60 text-right">
                  {formatTime(currentTime)}
                </div>
                <div className="text-[9px] font-mono text-white/30">FPS</div>
                <div className="text-[9px] font-mono text-white/60 text-right">{frameRate}</div>
                <div className="text-[9px] font-mono text-white/30">Grid</div>
                <div className="text-[9px] font-mono text-white/60 text-right uppercase">{gridMode}</div>
              </div>
            </div>

            {/* Section 2: Active Detections */}
            <div className="p-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase">
                  Detections
                </span>
                <span className="text-[9px] font-mono text-vms-accent">
                  {focusedDetections.length} active
                </span>
              </div>
              {allDetectionsForFocused.length === 0 ? (
                <div className="text-[9px] font-mono text-white/20 py-2">
                  No detections for this source
                </div>
              ) : (
                <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar">
                  {allDetectionsForFocused.map((det, i) => {
                    const isActive = currentTime >= det.timeStart && currentTime <= det.timeEnd;
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentTime(det.timeStart)}
                        className={cn(
                          "w-full text-left px-2 py-1 border transition-colors flex items-center justify-between",
                          isActive
                            ? CLS_BG[det.cls] ?? 'bg-blue-500/10 border-blue-500/20'
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[9px] font-mono font-semibold",
                            isActive ? (CLS_COLORS[det.cls] ?? 'text-blue-400') : 'text-white/40'
                          )}>
                            {det.cls}
                          </span>
                          <span className="text-[9px] font-mono text-white/30">
                            {det.confidence.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-white/25">
                          {formatTime(det.timeStart)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 3: Event Log */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <span className="text-[8px] font-mono text-white/30 tracking-widest uppercase">
                  Event Log
                </span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-0.5">
                {recentEvents.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest">
                      No events in range
                    </span>
                  </div>
                ) : (
                  recentEvents.map((event, i) => {
                    const delta = currentTime - event.ts;
                    const isNow = Math.abs(delta) < 3;
                    return (
                      <button
                        key={`${event.id}-${event.ts}-${i}`}
                        onClick={() => setCurrentTime(event.ts)}
                        className={cn(
                          "w-full text-left px-2 py-1.5 border transition-colors flex items-center justify-between",
                          isNow
                            ? event.type === 'anomaly'
                              ? "bg-red-500/10 border-red-500/20"
                              : "bg-vms-accent/10 border-vms-accent/20"
                            : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]",
                          Math.abs(delta) > 60 && "opacity-40"
                        )}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className={cn(
                            "text-[9px] font-mono font-semibold",
                            event.type === 'anomaly' ? "text-red-400" : "text-vms-accent"
                          )}>
                            {event.type === 'anomaly' ? 'ANOMALY' : 'EVENT'}
                          </span>
                          <span className="text-[8px] font-mono text-white/40">
                            {event.label}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[8px] font-mono text-white/40">
                            {formatTime(event.ts)}
                          </span>
                          <span className="text-[8px] font-mono text-white/20">
                            {delta > 0 ? `-${Math.floor(delta)}s ago` : `in ${Math.floor(Math.abs(delta))}s`}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
