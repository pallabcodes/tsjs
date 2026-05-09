import { useMeshStore, formatTime, cn, TIMELINE_DURATION } from '@ostream/core';
import { exportSelectionData } from '@ostream/core';
import { FORENSIC_MOCK_DATA } from './mockData';
import { Copy, FileJson, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';

export const TimelineStatusBar = () => {
  const {
    selectionRange, measuredFps, playbackSpeed,
    isPlaying, isReversing, loopMode, scale, frameRate,
    bookmarks, annotations, showBookmarkPanel, setShowBookmarkPanel,
  } = useMeshStore();

  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const trackCount = FORENSIC_MOCK_DATA.length;
  const zoomPercent = Math.round((scale / 240) * 100);

  const handleExport = (format: 'json' | 'csv' | 'clipboard') => {
    if (!selectionRange) return;
    const result = exportSelectionData(
      { tracks: FORENSIC_MOCK_DATA, range: selectionRange },
      format
    );

    if (format === 'clipboard') {
      navigator.clipboard.writeText(result).then(() => {
        setExportFeedback('Copied!');
        setTimeout(() => setExportFeedback(null), 1500);
      });
    } else {
      const blob = new Blob([result], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forensic_export_${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      setExportFeedback(`Saved .${format}`);
      setTimeout(() => setExportFeedback(null), 1500);
    }
  };

  return (
    <div className="flex h-6 items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 select-none">
      {/* Left: Status indicators */}
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            isPlaying ? "bg-indigo-500 animate-pulse" : "bg-white/20"
          )} />
          <span className={cn(
            "label-caps font-black text-[7px] tracking-[0.15em]",
            isPlaying ? "text-indigo-500" : "text-white/30"
          )}>
            {isPlaying ? (isReversing ? 'REVERSE' : 'PLAYING') : 'PAUSED'}
          </span>
        </div>

        {/* FPS */}
        <div className="flex items-center gap-1.5">
          <span className="text-[7px] opacity-30 uppercase">FPS</span>
          <span className="mono-tabular font-bold text-white text-[9px]">
            {measuredFps > 0 ? measuredFps.toFixed(1) : '—'}
          </span>
        </div>

        {/* Speed */}
        {playbackSpeed !== 1 && (
          <span className="text-[8px] font-bold text-indigo-400 mono-tabular">{playbackSpeed}x</span>
        )}

        {/* Loop */}
        {loopMode !== 'off' && (
          <span className="text-[7px] font-bold text-indigo-400 uppercase">LOOP:{loopMode}</span>
        )}

        {/* Frame rate */}
        <span className="text-[7px] opacity-20">{frameRate}fps</span>

        {/* Track count */}
        <span className="text-[7px] opacity-20">{trackCount} tracks</span>

        {/* Bookmarks / Annotations count */}
        {bookmarks.length > 0 && (
          <button
            onClick={() => setShowBookmarkPanel(!showBookmarkPanel)}
            className="text-[7px] text-amber-400/60 hover:text-amber-400 transition-colors"
          >
            {bookmarks.length} bookmarks
          </button>
        )}
        {annotations.length > 0 && (
          <span className="text-[7px] opacity-30">{annotations.length} notes</span>
        )}

        {/* Zoom */}
        <span className="text-[7px] opacity-20 mono-tabular">{zoomPercent}%</span>

        {/* Duration */}
        <span className="text-[7px] opacity-20 mono-tabular">{formatTime(TIMELINE_DURATION)}</span>
      </div>

      {/* Right: Selection info + Export */}
      <div className="flex items-center gap-3">
        {exportFeedback && (
          <span className="text-[8px] font-bold text-indigo-400 animate-pulse">{exportFeedback}</span>
        )}

        {selectionRange && (
          <div className="flex items-center gap-2 rounded border border-zinc-400/20 bg-zinc-400/10 px-2 py-0.5">
            <span className="text-[7px] text-zinc-400 uppercase font-bold">Sel</span>
            <span className="mono-tabular font-bold text-white text-[9px]">
              {formatTime(Math.min(...selectionRange))} → {formatTime(Math.max(...selectionRange))}
            </span>
            <span className="mono-tabular text-[8px] text-zinc-400">
              ({formatTime(Math.abs(selectionRange[1] - selectionRange[0]))})
            </span>

            {/* Export buttons */}
            <div className="flex items-center gap-0.5 ml-1 border-l border-zinc-400/20 pl-1.5">
              <button
                onClick={() => handleExport('clipboard')}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400"
                title="Copy to clipboard"
              >
                <Copy size={10} />
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400"
                title="Export JSON"
              >
                <FileJson size={10} />
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-zinc-400"
                title="Export CSV"
              >
                <FileSpreadsheet size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
