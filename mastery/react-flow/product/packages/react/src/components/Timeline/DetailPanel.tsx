import { useMeshStore, formatTime, cn } from '@ostream/core';
import { X } from 'lucide-react';

export const DetailPanel = () => {
  const { showDetailPanel, setShowDetailPanel, detailPanelData } = useMeshStore();

  if (!showDetailPanel || !detailPanelData) return null;

  const { trackLabel, type, color, start, duration } = detailPanelData;
  const end = start + duration;

  const colorMap: Record<string, string> = {
    emerald: 'text-indigo-400 border-indigo-500/40',
    blue: 'text-zinc-400 border-zinc-400/40',
    red: 'text-red-500 border-red-500/40',
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-64 bg-zinc-900 border-l border-white/10 z-[150] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", `bg-vms-${color === 'emerald' ? 'emerald-600' : color === 'blue' ? 'blue-500' : 'red-500'}`)} />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Span Detail</span>
        </div>
        <button
          onClick={() => setShowDetailPanel(false)}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10"
        >
          <X size={12} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Track info */}
        <div className="space-y-1">
          <span className="text-[7px] uppercase opacity-30 tracking-widest">Track</span>
          <div className={cn("text-xs font-bold", colorMap[color])}>{trackLabel}</div>
          <span className="text-[8px] opacity-40 uppercase">{type}</span>
        </div>

        <div className="h-px bg-white/5" />

        {/* Time data */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[7px] uppercase opacity-40">Start</span>
            <span className="mono-tabular text-[10px] font-bold text-white">{formatTime(start, true)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[7px] uppercase opacity-40">End</span>
            <span className="mono-tabular text-[10px] font-bold text-white">{formatTime(end, true)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[7px] uppercase opacity-40">Duration</span>
            <span className="mono-tabular text-[10px] font-bold text-indigo-400">{formatTime(duration, true)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[7px] uppercase opacity-40">Frames</span>
            <span className="mono-tabular text-[10px] font-bold text-white/60">
              {Math.round(duration * useMeshStore.getState().frameRate)}
            </span>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              useMeshStore.getState().setSelectionRange([start, start + duration]);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-400/10 text-indigo-400 text-[8px] font-bold rounded border border-indigo-400/20 hover:bg-indigo-400/20 transition-colors"
          >
            Select Range
          </button>
          <button
            onClick={() => {
              useMeshStore.getState().setCurrentTime(start);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 text-white text-[8px] font-bold rounded border border-white/10 hover:bg-white/10 transition-colors"
          >
            Seek to Start
          </button>
        </div>
      </div>
    </div>
  );
};
