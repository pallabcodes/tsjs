import { useMeshStore, TIMELINE_DURATION, formatTime, cn } from '@ostream/core';

export const TimelineRuler = () => {
  const scale = useMeshStore(state => state.scale);
  const bookmarks = useMeshStore(state => state.bookmarks);
  const annotations = useMeshStore(state => state.annotations);
  const setCurrentTime = useMeshStore(state => state.setCurrentTime);
  const totalWidth = (TIMELINE_DURATION / 60) * scale;

  // Dynamic LOD tick intervals based on zoom level
  let interval = 60;
  if (scale > 1000) interval = 1;
  else if (scale > 500) interval = 5;
  else if (scale > 200) interval = 10;
  else if (scale > 100) interval = 30;

  // Sub-second for deep zoom
  if (scale > 3000) interval = 0.5;
  if (scale > 6000) interval = 0.1;

  const ticks: number[] = [];
  for (let t = 0; t <= TIMELINE_DURATION; t += interval) {
    ticks.push(t);
  }

  return (
    <div
      className="h-9 bg-zinc-950 border-b border-zinc-800/20 relative sticky top-0 z-40"
      style={{ width: totalWidth + 400 }}
    >
      {/* SVG Tick marks */}
      <svg width="100%" height="100%" className="overflow-visible pointer-events-none">
        {ticks.map((time, i) => {
          const x = (time / 60) * scale;
          const isMajor = time % 60 === 0 || (interval < 1 && (time * 10) % 10 === 0);
          const isMinor = !isMajor && time % 1 === 0;

          return (
            <g key={i}>
              <line
                x1={x} y1={isMajor ? 12 : isMinor ? 20 : 28}
                x2={x} y2={36}
                stroke={isMajor ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)'}
                strokeWidth={isMajor ? 1.5 : 1}
              />
              {isMajor && (
                <text
                  x={x + 4} y={10}
                  fill="rgba(255,255,255,0.5)"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  className="mono-tabular font-bold"
                >
                  {formatTime(time)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Bookmark markers on ruler */}
      {bookmarks.map((bm) => {
        const x = (bm.time / 60) * scale;
        return (
          <div
            key={bm.id}
            className="absolute top-0 z-30 cursor-pointer group"
            style={{ left: x, transform: 'translateX(-50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentTime(bm.time);
            }}
          >
            {/* Flag marker */}
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-amber-400" />
            <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-px h-[29px] bg-amber-400/40" />
            {/* Tooltip on hover */}
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-zinc-900 border border-white/10 rounded px-1.5 py-0.5 shadow-lg z-50">
              <span className="text-[8px] font-bold text-amber-400 mono-tabular">{bm.label}</span>
            </div>
          </div>
        );
      })}

      {/* Annotation markers on ruler */}
      {annotations.map((ann) => {
        const x = (ann.time / 60) * scale;
        const colors: Record<string, string> = {
          emerald: 'bg-indigo-500 border-indigo-500',
          red: 'bg-red-500 border-red-500',
          blue: 'bg-zinc-400 border-zinc-400',
          amber: 'bg-amber-400 border-amber-400',
        };
        return (
          <div
            key={ann.id}
            className="absolute bottom-0 z-30 cursor-pointer group"
            style={{ left: x, transform: 'translateX(-50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentTime(ann.time);
            }}
          >
            <div className={cn('w-2 h-2 rounded-full', colors[ann.color])} />
            <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-zinc-900 border border-white/10 rounded px-1.5 py-0.5 shadow-lg z-50">
              <span className="text-[8px] font-bold text-white mono-tabular">{ann.title}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
