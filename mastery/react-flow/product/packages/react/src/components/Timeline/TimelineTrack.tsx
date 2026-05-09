import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeshStore, formatTime, cn, DEFAULT_TRACK_HEIGHT } from '@ostream/core';
import { Video, Activity, Zap, Volume2, VolumeX, EyeOff, Star, GripVertical } from 'lucide-react';

interface TrackProps {
  id: string;
  label: string;
  type: 'stream' | 'anomaly' | 'telemetry';
  group?: string;
  spans?: [number, number][]; // [start, duration]
  events?: number[]; // [timestamp]
  color: 'emerald' | 'blue' | 'red';
  index: number;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDragEnd?: () => void;
}

export const TimelineTrack = ({
  id, label, type, spans, events, color, index,
  onDragStart, onDragOver, onDragEnd
}: TrackProps) => {
  const store = useMeshStore();
  const scale = store.scale;
  const selectedTrackIds = store.selectedTrackIds;
  const toggleTrackSelection = store.toggleTrackSelection;
  const trackMeta = store.trackMeta[id] ?? { id, muted: false, solo: false, hidden: false, height: DEFAULT_TRACK_HEIGHT, collapsed: false };
  const toggleTrackMute = store.toggleTrackMute;
  const toggleTrackSolo = store.toggleTrackSolo;
  const toggleTrackHidden = store.toggleTrackHidden;
  const setTrackHeight = store.setTrackHeight;
  const setShowDetailPanel = store.setShowDetailPanel;
  const setDetailPanelData = store.setDetailPanelData;
  const annotations = store.annotations;

  const [hoveredSpan, setHoveredSpan] = useState<any>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const isSelected = selectedTrackIds.includes(id);
  const height = trackMeta.height;

  // Track annotations at this track's level
  const trackAnnotations = annotations.filter(
    a => spans?.some(([start, dur]) => a.time >= start && a.time <= start + dur) ||
         events?.some(e => Math.abs(e - a.time) < 5)
  );

  const getIcon = () => {
    switch (type) {
      case 'stream': return <Video size={12} />;
      case 'anomaly': return <Zap size={12} />;
      case 'telemetry': return <Activity size={12} />;
    }
  };

  const colorClasses = {
    emerald: 'bg-vms-emerald-600/20 border-vms-emerald-600/40 text-vms-emerald-400',
    blue: 'bg-vms-blue-500/20 border-vms-blue-500/40 text-vms-blue-500',
    red: 'bg-vms-red-500/20 border-vms-red-500/40 text-vms-red-500',
  };

  const handleSpanClick = (span: { start: number; duration: number }) => {
    setDetailPanelData({ trackId: id, trackLabel: label, type, color, ...span });
    setShowDetailPanel(true);
  };

  // Height resize via drag
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = height;

    const onMove = (me: MouseEvent) => {
      const delta = me.clientY - startY;
      setTrackHeight(id, startHeight + delta);
    };
    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [height, id, setTrackHeight]);

  if (trackMeta.hidden) return null;

  return (
    <div
      className={cn(
        "border-b border-white/5 relative group transition-colors",
        isSelected ? "bg-white/5" : "hover:bg-white/[0.02]",
        trackMeta.muted && "opacity-40"
      )}
      style={{ height }}
      draggable
      onDragStart={() => onDragStart?.(index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(index); }}
      onDragEnd={() => onDragEnd?.()}
    >
      {/* Label Sidebar */}
      <div className="absolute left-0 top-0 bottom-0 w-48 bg-vms-surface border-r border-white/5 z-20 flex items-center px-2 gap-2">
        {/* Drag handle */}
        <div className="cursor-grab opacity-0 group-hover:opacity-30 transition-opacity">
          <GripVertical size={12} />
        </div>

        {/* Icon */}
        <div className={cn("p-1 rounded", colorClasses[color])}>
          {getIcon()}
        </div>

        {/* Label + type */}
        <div className="flex flex-col truncate flex-1 min-w-0">
          <span className="text-[9px] font-bold text-white truncate leading-tight">{label}</span>
          <span className="label-caps text-[7px] opacity-30">{type}</span>
        </div>

        {/* Track controls - visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); toggleTrackMute(id); }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10"
            aria-label={trackMeta.muted ? "Unmute track" : "Mute track"}
            title={trackMeta.muted ? "Unmute" : "Mute"}
          >
            {trackMeta.muted ? <VolumeX size={10} className="text-vms-red-500" /> : <Volume2 size={10} className="text-vms-text-secondary" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleTrackSolo(id); }}
            className={cn("w-5 h-5 flex items-center justify-center rounded hover:bg-white/10", trackMeta.solo && "text-amber-400")}
            aria-label={trackMeta.solo ? "Unsolo track" : "Solo track"}
            title={trackMeta.solo ? "Unsolo" : "Solo"}
          >
            <Star size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleTrackHidden(id); }}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10"
            aria-label="Hide track"
            title="Hide track"
          >
            <EyeOff size={10} className="text-vms-text-secondary" />
          </button>
        </div>
      </div>

      {/* Selection highlight */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-vms-accent z-30" />
      )}

      {/* Track Content */}
      <div
        className="ml-48 relative h-full"
        onClick={(e) => {
          if (e.detail === 1) toggleTrackSelection(id);
        }}
      >
        {/* Render Spans */}
        {spans?.map(([start, duration], i) => (
          <motion.div
            key={`span-${i}`}
            className={cn(
              "absolute top-2 bottom-2 rounded-sm border cursor-pointer z-10 overflow-hidden",
              colorClasses[color]
            )}
            style={{
              left: (start / 60) * scale,
              width: (duration / 60) * scale
            }}
            whileHover={{ scaleY: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
            onHoverStart={() => setHoveredSpan({ start, duration, index: i })}
            onHoverEnd={() => setHoveredSpan(null)}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleSpanClick({ start, duration });
            }}
          >
            {/* Heatmap gradient */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    currentColor 12%,
                    transparent 25%,
                    currentColor 40%,
                    currentColor 55%,
                    transparent 68%,
                    currentColor 82%,
                    transparent 100%
                  )`,
                  backgroundSize: '24px 100%'
                }}
              />
            </div>
            {/* Span label when wide enough */}
            {(duration / 60) * scale > 60 && (
              <span className="absolute left-1 top-0.5 text-[7px] font-bold opacity-60 pointer-events-none truncate max-w-[80%]">
                {formatTime(start)} +{Math.round(duration)}s
              </span>
            )}
          </motion.div>
        ))}

        {/* Render Event Markers */}
        {events?.map((ts, i) => (
          <div
            key={`event-${i}`}
            className="absolute top-0 bottom-0 w-px z-10 cursor-pointer group/event"
            style={{ left: (ts / 60) * scale }}
            onClick={(e) => {
              e.stopPropagation();
              useMeshStore.getState().setCurrentTime(ts);
            }}
          >
            <div className={cn(
              "absolute top-0 bottom-0 w-px",
              color === 'red' ? "bg-vms-red-500/60" : color === 'emerald' ? "bg-vms-emerald-600/40" : "bg-vms-blue-500/40"
            )} />
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-transform group-hover/event:scale-150",
              color === 'red' ? "bg-vms-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" :
              color === 'emerald' ? "bg-vms-emerald-600 shadow-[0_0_6px_rgba(16,185,129,0.6)]" :
              "bg-vms-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]"
            )} />
          </div>
        ))}

        {/* Annotation dots on track */}
        {trackAnnotations.map((ann) => (
          <div
            key={ann.id}
            className="absolute bottom-1 z-20"
            style={{ left: (ann.time / 60) * scale, transform: 'translateX(-50%)' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
          </div>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSpan && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-vms-surface-elevated border border-white/10 p-3 rounded-lg shadow-2xl z-[200] min-w-[200px]"
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
              <div className={cn("w-2 h-2 rounded-full", `bg-vms-${color === 'emerald' ? 'emerald-600' : color === 'blue' ? 'blue-500' : 'red-500'}`)} />
              <span className="text-[9px] font-bold text-white">{label}</span>
              <span className="text-[7px] opacity-40 ml-auto">{type}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[7px] opacity-40 uppercase">Start</span>
                <span className="mono-tabular text-[10px] font-bold text-white">{formatTime(hoveredSpan.start)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] opacity-40 uppercase">Duration</span>
                <span className="mono-tabular text-[10px] font-bold text-vms-emerald-400">{formatTime(hoveredSpan.duration)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[7px] opacity-40 uppercase">End</span>
                <span className="mono-tabular text-[10px] font-bold text-white/60">{formatTime(hoveredSpan.start + hoveredSpan.duration)}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/5 text-[7px] opacity-30 text-center">Click for details</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Height resize handle */}
      <div
        ref={resizeRef}
        className={cn(
          "absolute left-0 right-0 bottom-0 h-1 cursor-row-resize z-30 transition-colors",
          isResizing ? "bg-vms-accent/40" : "hover:bg-white/10"
        )}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};
