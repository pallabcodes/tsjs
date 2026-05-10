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
  const showForensicDetails = store.showForensicDetails;
  const setScale = store.setScale;
  const setCurrentTime = store.setCurrentTime;

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
    emerald: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
    blue: 'bg-zinc-400/20 border-zinc-400/40 text-zinc-400',
    red: 'bg-red-500/20 border-red-500/40 text-red-500',
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
      <div className="absolute left-0 top-0 bottom-0 w-48 bg-zinc-950 border-r border-white/5 z-20 flex items-center px-2 gap-2">
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
            {trackMeta.muted ? <VolumeX size={10} className="text-red-500" /> : <Volume2 size={10} className="text-zinc-500" />}
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
            <EyeOff size={10} className="text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Selection highlight */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 z-30" />
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
              color === 'red' ? "bg-red-500/60" : color === 'emerald' ? "bg-indigo-500/40" : "bg-zinc-400/40"
            )} />
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-transform group-hover/event:scale-150",
              color === 'red' ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" :
              color === 'emerald' ? "bg-indigo-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" :
              "bg-zinc-400 shadow-[0_0_6px_rgba(59,130,246,0.6)]"
            )} />
          </div>
        ))}

        {/* Forensic GOP (I/P Frame) Visualization */}
        {showForensicDetails && scale > 10000 && type === 'stream' && spans?.map(([start, duration], i) => {
          const frameRate = useMeshStore.getState().frameRate;
          const frameInterval = 1 / frameRate;
          const frameTicks = [];
          for (let t = start; t < start + duration; t += frameInterval) {
            frameTicks.push(t);
          }
          return (
            <div key={`gop-${i}`} className="absolute top-0 bottom-0 pointer-events-none opacity-40">
              {frameTicks.map((t, idx) => {
                const x = (t / 60) * scale;
                const isKeyframe = Math.floor(t) === t; // Simplified: I-frame every 1s
                return (
                  <div
                    key={idx}
                    className={cn(
                      "absolute top-0 bottom-0 w-px",
                      isKeyframe ? "bg-indigo-500 w-[1.5px]" : "bg-zinc-700"
                    )}
                    style={{ left: x }}
                  />
                );
              })}
            </div>
          );
        })}
        {trackAnnotations.map((ann) => {
          const x = (ann.time / 60) * scale;
          const width = ann.duration ? (ann.duration / 60) * scale : 6;
          
          return (
            <div
              key={ann.id}
              className={cn(
                "absolute bottom-1.5 z-20 transition-all cursor-zoom-in",
                ann.duration ? "h-4 top-2 opacity-30 rounded-sm border border-white/20" : "w-1.5 h-1.5 rounded-full"
              )}
              onDoubleClick={() => {
                if (ann.duration) {
                  const targetScale = Math.min(30000, (60 / ann.duration) * 800);
                  setScale(targetScale);
                  setCurrentTime(ann.time + ann.duration / 2);
                }
              }}
              style={{ 
                left: x, 
                width: ann.duration ? width : undefined,
                backgroundColor: ann.color === 'emerald' ? '#10b981' : ann.color === 'red' ? '#ef4444' : ann.color === 'amber' ? '#fbbf24' : '#94a3b8'
              }}
            >
              {!ann.duration && <div className="w-1.5 h-1.5 rounded-full bg-inherit shadow-[0_0_4px_rgba(251,191,36,0.6)]" />}
              {ann.duration && width > 40 && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] font-black text-white whitespace-nowrap uppercase tracking-widest drop-shadow-md">
                  {ann.title}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Forensic Integrity Ribbon (Chain of Custody) with Pulse Alerts */}
      {showForensicDetails && type === 'stream' && (
        <div className="absolute top-0 left-48 right-0 h-px z-[40] flex">
           <div className="h-full bg-emerald-500" style={{ flex: '0 0 65%' }} />
           <div className="h-full bg-red-500 animate-pulse-red shadow-[0_0_8px_rgba(239,68,68,0.5)]" style={{ flex: '0 0 3%' }} />
           <div className="h-full bg-emerald-500" style={{ flex: '0 0 32%' }} />
        </div>
      )}

      {/* Forensic Telemetry, Motion & Audio Ribbons */}
      {showForensicDetails && type === 'stream' && (
        <div className="absolute bottom-0 left-48 right-0 h-[8px] border-t border-zinc-800/30 overflow-hidden pointer-events-none bg-zinc-950/40 flex flex-col justify-end">
          {/* Audio Micro-Waveform (Simulated Peaks) */}
          <div 
            className="h-[2px] w-full opacity-50 mb-[1px] animate-signal-flow"
            style={{
              background: `repeating-linear-gradient(90deg, 
                transparent 0px, 
                transparent 2px, 
                rgba(168, 85, 247, 0.6) 2px, 
                rgba(168, 85, 247, 0.6) 3px,
                transparent 3px,
                transparent 5px,
                rgba(168, 85, 247, 0.8) 5px,
                rgba(168, 85, 247, 0.8) 7px
              )`,
              backgroundSize: '100px 100%'
            }}
          />
          {/* Motion Density Layer (Activity Spikes) */}
          <div 
            className="h-[2px] w-full opacity-40 mb-[1px]"
            style={{
              background: `repeating-linear-gradient(90deg, 
                transparent 0px, 
                transparent 40px, 
                #fbbf24 40px, 
                #fbbf24 42px,
                transparent 42px,
                transparent 120px,
                #fbbf24 120px,
                #fbbf24 125px
              )`
            }}
          />
          {/* GOP Architecture Layer (FFmpeg-grade I/P/B visualization) */}
          <div 
            className="h-[2px] w-full opacity-30 mb-[1px]"
            style={{
              background: `repeating-linear-gradient(90deg, 
                #ffffff 0px, 
                #ffffff 2px,
                transparent 2px,
                transparent 30px,
                rgba(255,255,255,0.4) 30px,
                rgba(255,255,255,0.4) 31px,
                transparent 31px,
                transparent 60px
              )`
            }}
          />
          {/* Stream Health / Frame Timing Layer */}
          <div 
            className="h-[2px] w-full opacity-60 animate-signal-flow"
            style={{
              background: `repeating-linear-gradient(90deg, 
                rgba(99, 102, 241, 0.3) 0px, 
                rgba(99, 102, 241, 0.3) 10px,
                transparent 10px,
                transparent 12px
              )`,
              backgroundSize: '100px 100%'
            }}
          />
        </div>
      )}


      {/* Tooltip */}
      <AnimatePresence>
        {hoveredSpan && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-2xl z-[200] min-w-[200px]"
          >
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
              <div className={cn(
                "w-2 h-2 rounded-full",
                color === 'emerald' ? 'bg-indigo-500' : color === 'blue' ? 'bg-zinc-400' : 'bg-red-500'
              )} />
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
                <span className="mono-tabular text-[10px] font-bold text-indigo-400">{formatTime(hoveredSpan.duration)}</span>
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
          isResizing ? "bg-indigo-400/40" : "hover:bg-white/10"
        )}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};
