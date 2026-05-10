import { useState, useRef } from 'react';
import {
  Play, Pause, RotateCcw, ZoomIn, ZoomOut, Settings, Maximize,
  Search, SkipBack, SkipForward, ChevronFirst, ChevronLast,
  Repeat, Repeat1, ArrowLeftRight, Rewind, Clock, Minimize,
  ChevronDown, PanelBottomClose, PanelBottomOpen,
  ChevronsLeft, ChevronsRight, Fingerprint
} from 'lucide-react';
import { useMeshStore, formatTime, cn, TIMELINE_DURATION } from '@ostream/core';

export const TimelineControls = () => {
  const state = useMeshStore();
  const {
    currentTime, isPlaying, setIsPlaying, setCurrentTime,
    scale, setScale, playbackSpeed, setPlaybackSpeed,
    isReversing, setIsReversing,
    loopMode, setLoopMode,
    frameStep, jumpToStart, jumpToEnd, jumpToNextKeyframe, jumpToPrevKeyframe,
    timeFormat, setTimeFormat,
    isTimelineFullscreen, setIsTimelineFullscreen,
    isTimelineCollapsed, setIsTimelineCollapsed,
    showSettings, setShowSettings, showMinimap, setShowMinimap,
    selectionRange, zoomToFit, zoomToSelection,
    showForensicDetails, setShowForensicDetails,
  } = state;

  const [showGoToTime, setShowGoToTime] = useState(false);
  const [goToValue, setGoToValue] = useState('');
  const goToRef = useRef<HTMLInputElement>(null);

  const handleGoToTime = () => {
    const parts = goToValue.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    else if (parts.length === 1) seconds = parts[0];
    if (!isNaN(seconds) && seconds >= 0 && seconds <= TIMELINE_DURATION) {
      setCurrentTime(seconds);
    }
    setShowGoToTime(false);
    setGoToValue('');
  };

  const zoomPercent = Math.round((scale / 240) * 100);

  const LoopIcon = loopMode === 'selection' ? Repeat1 : Repeat;

  return (
    <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-3 z-50 select-none">
      {/* ─── Left: Playback Controls ─── */}
      <div className="flex items-center gap-0.5">
        {/* Jump to start */}
        <button
          onClick={jumpToStart}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-zinc-500"
          aria-label="Jump to start"
          title="Jump to start (Home)"
        >
          <ChevronFirst size={14} />
        </button>

        {/* Jump to Prev I-Frame */}
        {showForensicDetails && (
          <button
            onClick={jumpToPrevKeyframe}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-indigo-500/60 hover:text-indigo-400"
            title="Jump to Prev I-Frame (Keyframe)"
          >
            <ChevronsLeft size={14} />
          </button>
        )}

        {/* Frame step back */}
        <button
          onClick={() => frameStep(-1)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-zinc-500"
          aria-label="Frame step backward"
          title="Previous frame (,)"
        >
          <SkipBack size={12} />
        </button>

        {/* Reverse */}
        <button
          onClick={() => {
            setIsReversing(true);
            setIsPlaying(true);
          }}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors",
            isReversing && isPlaying ? "text-indigo-400" : "text-zinc-500"
          )}
          aria-label="Reverse playback"
          title="Reverse (J)"
        >
          <Rewind size={13} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => {
            if (isReversing) setIsReversing(false);
            setIsPlaying(!isPlaying);
          }}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-white"
          aria-label={isPlaying ? "Pause" : "Play"}
          title={isPlaying ? "Pause (K / Space)" : "Play (L / Space)"}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>

        {/* Frame step forward */}
        {showForensicDetails && (
          <button
            onClick={jumpToNextKeyframe}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-indigo-500/60 hover:text-indigo-400"
            title="Jump to Next I-Frame (Keyframe)"
          >
            <ChevronsRight size={14} />
          </button>
        )}
        <button
          onClick={() => frameStep(1)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-zinc-500"
          aria-label="Frame step forward"
          title="Next frame (.)"
        >
          <SkipForward size={12} />
        </button>

        {/* Jump to end */}
        <button
          onClick={jumpToEnd}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-zinc-500"
          aria-label="Jump to end"
          title="Jump to end (End)"
        >
          <ChevronLast size={14} />
        </button>

        {/* Reset */}
        <button
          onClick={jumpToStart}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors text-zinc-500 ml-1"
          aria-label="Reset to start"
          title="Reset (R)"
        >
          <RotateCcw size={12} />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 mx-1.5" />

        {/* Time Readout */}
        <button
          onClick={() => setShowGoToTime(!showGoToTime)}
          className="flex items-center gap-2 px-2 py-0.5 bg-zinc-950 rounded border border-zinc-800/20 hover:border-indigo-400/30 transition-colors relative"
          title="Click to go to time (type HH:MM:SS)"
          aria-label="Current time / Go to time"
        >
          {isReversing && isPlaying && (
            <span className="text-[8px] font-bold text-indigo-400">◀</span>
          )}
          <span className="mono-tabular text-sm font-bold text-white leading-none">
            {formatTime(currentTime)}
          </span>
          <span className="text-[8px] font-bold opacity-25 text-white mono-tabular uppercase tracking-wider">
            {timeFormat === 'absolute' ? 'UTC-7' : 'REL'}
          </span>
        </button>

        {/* Go-to-time popover */}
        {showGoToTime && (
          <div className="absolute top-11 left-48 z-[200] bg-zinc-900 border border-white/10 rounded-lg shadow-2xl p-3 flex gap-2 items-center">
            <Clock size={12} className="text-zinc-500" />
            <input
              ref={goToRef}
              autoFocus
              value={goToValue}
              onChange={(e) => setGoToValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGoToTime();
                if (e.key === 'Escape') setShowGoToTime(false);
              }}
              placeholder="HH:MM:SS"
              className="bg-zinc-950 border border-zinc-800/30 rounded px-2 py-1 text-xs mono-tabular text-white w-24 focus:outline-none focus:border-indigo-400/50"
            />
            <button
              onClick={handleGoToTime}
              className="px-2 py-1 bg-indigo-400/20 text-indigo-400 text-[9px] font-bold rounded hover:bg-indigo-400/30"
            >
              GO
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 mx-1.5" />

        {/* Speed Toggles */}
        <div className="flex items-center bg-zinc-950 rounded border border-zinc-800/20 h-7 overflow-hidden">
          {[0.25, 0.5, 1, 1.5, 2, 4].map(speed => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                "px-1.5 h-full text-[9px] font-bold transition-all border-r border-zinc-800/10 last:border-r-0",
                playbackSpeed === speed ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
              )}
              aria-label={`Set playback speed to ${speed}x`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Loop toggle */}
        <button
          onClick={() => {
            if (loopMode === 'off') setLoopMode(selectionRange ? 'selection' : 'full');
            else if (loopMode === 'full') setLoopMode(selectionRange ? 'selection' : 'off');
            else setLoopMode('off');
          }}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors ml-1",
            loopMode !== 'off' ? "text-indigo-400" : "text-zinc-500"
          )}
          aria-label={`Loop: ${loopMode}`}
          title={`Loop: ${loopMode} (Q)`}
        >
          <LoopIcon size={13} />
        </button>
      </div>

      {/* ─── Right: View Controls ─── */}
      <div className="flex items-center gap-1.5">
        {/* Zoom level */}
        <span className="mono-tabular text-[9px] font-bold text-zinc-500 opacity-60 mr-1">{zoomPercent}%</span>

        {/* Zoom Engine */}
        <div className="flex items-center bg-zinc-950 rounded border border-zinc-800/20 h-7 overflow-hidden">
          <button
            onClick={() => setScale(Math.max(20, scale / 1.25))}
            className="w-7 h-full flex items-center justify-center hover:bg-white/5 transition-colors border-r border-zinc-800/10 group"
            aria-label="Zoom out"
          >
            <ZoomOut size={13} className="group-active:scale-90 transition-transform" />
          </button>

          <div className="px-1.5 flex items-center justify-center h-full bg-white/[0.02]">
            <div className="relative">
              <Search size={11} className="opacity-40" />
              <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
            </div>
          </div>

          <button
            onClick={() => setScale(Math.min(12000, scale * 1.25))}
            className="w-7 h-full flex items-center justify-center hover:bg-white/5 transition-colors border-l border-zinc-800/10 group"
            aria-label="Zoom in"
          >
            <ZoomIn size={13} className="group-active:scale-110 transition-transform" />
          </button>
        </div>

        {/* Zoom to fit */}
        <button
          onClick={() => zoomToFit(TIMELINE_DURATION)}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 text-zinc-500"
          aria-label="Zoom to fit"
          title="Zoom to fit (Cmd+0)"
        >
          <ArrowLeftRight size={13} />
        </button>

        {/* Zoom to selection */}
        {selectionRange && (
          <button
            onClick={zoomToSelection}
            className="px-2 h-7 flex items-center justify-center rounded hover:bg-white/5 text-indigo-400 text-[8px] font-bold border border-indigo-400/20"
            aria-label="Zoom to selection"
          >
            FIT SEL
          </button>
        )}

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 mx-0.5" />

        {/* Time format toggle */}
        <button
          onClick={() => setTimeFormat(timeFormat === 'absolute' ? 'relative' : 'absolute')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 text-zinc-500"
          aria-label={`Time format: ${timeFormat}`}
          title={`Time format: ${timeFormat}`}
        >
          <Clock size={13} />
        </button>

        {/* Minimap toggle */}
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors",
            showMinimap ? "text-indigo-400" : "text-zinc-500"
          )}
          aria-label="Toggle minimap"
          title="Toggle minimap"
        >
          <ChevronDown size={13} />
        </button>

        {/* Tactical Overlay Toggle */}
        <button
          onClick={() => setShowForensicDetails(!showForensicDetails)}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded transition-colors mr-0.5",
            showForensicDetails ? "bg-indigo-500/15 text-indigo-400" : "text-zinc-500 hover:bg-white/5"
          )}
          title={showForensicDetails ? "Disable Forensic Overlay" : "Enable Forensic Overlay"}
        >
          <Fingerprint size={14} />
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors",
            showSettings ? "text-indigo-400" : "text-zinc-500"
          )}
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={14} />
        </button>

        {/* Fullscreen */}
        {!isTimelineCollapsed && (
          <button
            onClick={() => setIsTimelineFullscreen(!isTimelineFullscreen)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 text-zinc-500"
            aria-label={isTimelineFullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={isTimelineFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isTimelineFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        )}

        {/* Collapse Timeline */}
        <button
          onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded hover:bg-white/5 transition-colors ml-1 border-l border-white/10 pl-1",
            isTimelineCollapsed ? "text-indigo-400" : "text-zinc-500"
          )}
          aria-label={isTimelineCollapsed ? "Expand Timeline" : "Collapse Timeline"}
          title={isTimelineCollapsed ? "Expand Timeline" : "Collapse Timeline"}
        >
          {isTimelineCollapsed ? <PanelBottomOpen size={14} /> : <PanelBottomClose size={14} />}
        </button>
      </div>
    </div>
  );
};
