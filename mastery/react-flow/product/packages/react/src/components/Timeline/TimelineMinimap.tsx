import { useMeshStore, TIMELINE_DURATION, cn } from '@ostream/core';
import { FORENSIC_MOCK_DATA } from './mockData';

export const TimelineMinimap = () => {
  const { currentTime, setCurrentTime, selectionRange, scale, bookmarks } = useMeshStore();


  // Viewport window position
  const viewportWidthPx = (window.innerWidth - 192) || 1000; // approximate visible area minus sidebar
  const viewportSeconds = (viewportWidthPx / scale) * 60;
  const viewportStart = Math.max(0, currentTime - viewportSeconds / 2);
  const viewportEnd = Math.min(TIMELINE_DURATION, viewportStart + viewportSeconds);

  return (
    <div className="h-8 bg-vms-bg border-b border-vms-border-dim/30 flex items-center px-3 gap-3">
      <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest w-10">MAP</span>
      <div
        className="flex-1 max-w-[400px] h-5 bg-vms-surface rounded border border-white/5 relative overflow-hidden cursor-crosshair"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const time = (x / rect.width) * TIMELINE_DURATION;
          setCurrentTime(Math.max(0, Math.min(TIMELINE_DURATION, time)));
        }}
      >
        {/* Track spans (tiny) */}
        {FORENSIC_MOCK_DATA.map((track) =>
          track.spans?.map(([start, dur], i) => (
            <div
              key={`${track.id}-${i}`}
              className={cn(
                "absolute h-1 rounded-full top-1/2 -translate-y-1/2",
                track.color === 'emerald' ? 'bg-vms-emerald-600/50' :
                track.color === 'blue' ? 'bg-vms-blue-500/50' : 'bg-vms-red-500/50'
              )}
              style={{
                left: `${(start / TIMELINE_DURATION) * 100}%`,
                width: `${(dur / TIMELINE_DURATION) * 100}%`,
              }}
            />
          ))
        )}

        {/* Bookmark markers */}
        {bookmarks.map((bm) => (
          <div
            key={bm.id}
            className="absolute top-0 bottom-0 w-px bg-amber-400/60"
            style={{ left: `${(bm.time / TIMELINE_DURATION) * 100}%` }}
          />
        ))}

        {/* Selection range */}
        {selectionRange && (
          <div
            className="absolute top-0 bottom-0 bg-vms-blue-500/20 border-x border-vms-blue-500/50"
            style={{
              left: `${(Math.min(...selectionRange) / TIMELINE_DURATION) * 100}%`,
              width: `${(Math.abs(selectionRange[1] - selectionRange[0]) / TIMELINE_DURATION) * 100}%`,
            }}
          />
        )}

        {/* Viewport window */}
        <div
          className="absolute top-0 bottom-0 border border-white/30 bg-white/5 rounded-sm"
          style={{
            left: `${(viewportStart / TIMELINE_DURATION) * 100}%`,
            width: `${((viewportEnd - viewportStart) / TIMELINE_DURATION) * 100}%`,
          }}
        />

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-px bg-vms-emerald-600 shadow-[0_0_4px_var(--vms-emerald-600)]"
          style={{ left: `${(currentTime / TIMELINE_DURATION) * 100}%` }}
        />
      </div>
    </div>
  );
};
