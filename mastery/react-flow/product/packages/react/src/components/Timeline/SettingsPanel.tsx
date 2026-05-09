import { useMeshStore, cn } from '@ostream/core';
import { X, Monitor } from 'lucide-react';

export const SettingsPanel = () => {
  const {
    showSettings, setShowSettings,
    frameRate, setFrameRate,
    timeFormat, setTimeFormat,
    showMinimap, setShowMinimap,
    loopMode, setLoopMode,
  } = useMeshStore();

  if (!showSettings) return null;

  return (
    <div className="absolute right-10 top-11 z-[200] w-56 bg-vms-surface-elevated border border-white/10 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Monitor size={11} className="text-vms-accent" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Settings</span>
        </div>
        <button onClick={() => setShowSettings(false)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10">
          <X size={11} />
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Frame Rate */}
        <div className="space-y-1">
          <label className="text-[7px] uppercase opacity-40 tracking-widest block">Frame Rate</label>
          <div className="flex gap-1">
            {[24, 30, 60, 120].map(fps => (
              <button
                key={fps}
                onClick={() => setFrameRate(fps)}
                className={cn(
                  "flex-1 py-1 text-[9px] font-bold rounded border transition-all",
                  frameRate === fps
                    ? "bg-vms-accent/20 text-vms-accent border-vms-accent/30"
                    : "bg-vms-bg text-white/40 border-white/5 hover:text-white"
                )}
              >
                {fps}
              </button>
            ))}
          </div>
        </div>

        {/* Time Format */}
        <div className="space-y-1">
          <label className="text-[7px] uppercase opacity-40 tracking-widest block">Time Display</label>
          <div className="flex gap-1">
            {(['absolute', 'relative'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setTimeFormat(fmt)}
                className={cn(
                  "flex-1 py-1 text-[9px] font-bold rounded border transition-all capitalize",
                  timeFormat === fmt
                    ? "bg-vms-accent/20 text-vms-accent border-vms-accent/30"
                    : "bg-vms-bg text-white/40 border-white/5 hover:text-white"
                )}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Loop Mode */}
        <div className="space-y-1">
          <label className="text-[7px] uppercase opacity-40 tracking-widest block">Loop Mode</label>
          <div className="flex gap-1">
            {(['off', 'full', 'selection'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setLoopMode(mode)}
                className={cn(
                  "flex-1 py-1 text-[9px] font-bold rounded border transition-all capitalize",
                  loopMode === mode
                    ? "bg-vms-accent/20 text-vms-accent border-vms-accent/30"
                    : "bg-vms-bg text-white/40 border-white/5 hover:text-white"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Minimap toggle */}
        <div className="flex items-center justify-between">
          <label className="text-[8px] font-bold text-white/60 uppercase">Minimap</label>
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={cn(
              "w-8 h-4 rounded-full relative transition-colors",
              showMinimap ? "bg-vms-accent" : "bg-white/10"
            )}
          >
            <div className={cn(
              "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform",
              showMinimap ? "left-[18px]" : "left-0.5"
            )} />
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts reference */}
      <div className="border-t border-white/5 p-3">
        <span className="text-[7px] uppercase opacity-30 tracking-widest block mb-2">Shortcuts</span>
        <div className="grid grid-cols-2 gap-y-1 text-[7px] opacity-40">
          <span>Space</span><span>Play/Pause</span>
          <span>J / K / L</span><span>Rev / Stop / Fwd</span>
          <span>, / .</span><span>Frame step</span>
          <span>Home / End</span><span>Jump start/end</span>
          <span>B / M</span><span>Bookmark / Note</span>
          <span>N / P</span><span>Next/Prev event</span>
          <span>[ / ]</span><span>Prev/Next bookmark</span>
          <span>Q</span><span>Toggle loop</span>
          <span>Esc</span><span>Clear selection</span>
        </div>
      </div>
    </div>
  );
};
