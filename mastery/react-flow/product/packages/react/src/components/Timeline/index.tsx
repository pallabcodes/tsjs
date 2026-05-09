import { useRef, useEffect, useCallback, useState } from 'react'
import { useMeshStore, TIMELINE_DURATION, formatTime, cn } from '@ostream/core'
import { TimelineControls } from './TimelineControls.tsx'
import { TimelineRuler } from './TimelineRuler.tsx'
import { TimelineTrack } from './TimelineTrack.tsx'
import { TimelineMinimap } from './TimelineMinimap.tsx'
import { TimelineStatusBar } from './TimelineStatusBar.tsx'
import { BookmarkPanel } from './BookmarkPanel.tsx'
import { DetailPanel } from './DetailPanel.tsx'
import { SettingsPanel } from './SettingsPanel.tsx'
import { useTimelineKeyboard } from './useTimelineKeyboard.ts'
import { FORENSIC_MOCK_DATA, type TrackData } from './mockData.ts'

export const Timeline = () => {
  const state = useMeshStore()
  const {
    currentTime, setCurrentTime, isPlaying, setIsPlaying,
    scale, handleZoom, playbackSpeed, isReversing, setIsReversing,
    selectionRange, setSelectionRange,
    loopMode, isTimelineCollapsed, isTimelineFullscreen,
    timelineHeight, setTimelineHeight,
    showMinimap,
    setMeasuredFps, trackMeta, isDraggingPlayhead, setIsDraggingPlayhead,
  } = state

  const scrollRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fpsFrames = useRef<number[]>([])
  const [trackOrder, setLocalTrackOrder] = useState<string[]>(FORENSIC_MOCK_DATA.map(t => t.id))
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // ─── Keyboard ──────────────────────────────────────────────────────────
  useTimelineKeyboard()

  // ─── Playback Engine (60fps RAF) ───────────────────────────────────────
  // Fixed: uses playbackSpeed, supports reverse, supports loop
  useEffect(() => {
    if (!isPlaying) return
    let lastTime = performance.now()
    let animId: number

    const tick = (now: number) => {
      const rawDelta = (now - lastTime) / 1000
      lastTime = now
      const delta = rawDelta * playbackSpeed * (isReversing ? -1 : 1)

      // FPS measurement
      fpsFrames.current.push(now)
      const cutoff = now - 1000
      fpsFrames.current = fpsFrames.current.filter(t => t > cutoff)
      setMeasuredFps(fpsFrames.current.length)

      setCurrentTime((prev) => {
        let next = prev + delta

        // Loop logic
        if (loopMode === 'full') {
          if (next >= TIMELINE_DURATION) next = 0
          if (next < 0) next = TIMELINE_DURATION
        } else if (loopMode === 'selection' && selectionRange) {
          const [a, b] = selectionRange
          const loopStart = Math.min(a, b)
          const loopEnd = Math.max(a, b)
          if (next >= loopEnd) next = loopStart
          if (next < loopStart) next = loopEnd
        } else {
          // No loop
          if (next >= TIMELINE_DURATION) {
            setIsPlaying(false)
            return TIMELINE_DURATION
          }
          if (next < 0) {
            setIsPlaying(false)
            setIsReversing(false)
            return 0
          }
        }

        return next
      })

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [isPlaying, playbackSpeed, isReversing, loopMode, selectionRange, setCurrentTime, setIsPlaying, setIsReversing, setMeasuredFps])

  // ─── Sync Sovereign Detections ─────────────────────────────────────────
  useEffect(() => {
    state.tickDetections(currentTime);
  }, [currentTime]);

  // ─── Auto-scroll follow playhead (works during playback) ───────────────
  useEffect(() => {
    if (!scrollRef.current) return
    const x = (currentTime / 60) * scale
    const container = scrollRef.current
    const viewLeft = container.scrollLeft
    const viewRight = viewLeft + container.clientWidth

    // Keep playhead in view with 15% margin
    const margin = container.clientWidth * 0.15
    if (x > viewRight - margin) {
      container.scrollTo({ left: x - margin, behavior: isPlaying ? 'auto' : 'smooth' })
    } else if (x < viewLeft + margin) {
      container.scrollTo({ left: Math.max(0, x - container.clientWidth + margin), behavior: isPlaying ? 'auto' : 'smooth' })
    }
  }, [currentTime, scale, isPlaying])

  // ─── Scroll wheel → zoom ──────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      handleZoom(e.deltaY)
    }
  }, [handleZoom])

  // ─── Mouse interactions ────────────────────────────────────────────────
  const getTimeFromX = useCallback((clientX: number) => {
    if (!scrollRef.current) return 0
    const rect = scrollRef.current.getBoundingClientRect()
    const x = clientX - rect.left + scrollRef.current.scrollLeft
    return Math.max(0, Math.min(TIMELINE_DURATION, (x / scale) * 60))
  }, [scale])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    const time = getTimeFromX(e.clientX)

    if (e.shiftKey) {
      // Selection mode
      setSelectionRange([time, time])

      const onMove = (me: MouseEvent) => {
        const t = getTimeFromX(me.clientX)
        setSelectionRange([time, t])
      }
      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    } else {
      // Seek + drag scrub
      setCurrentTime(time)
      setIsDraggingPlayhead(true)

      const onMove = (me: MouseEvent) => {
        const t = getTimeFromX(me.clientX)
        setCurrentTime(t)
      }
      const onUp = () => {
        setIsDraggingPlayhead(false)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }
  }, [getTimeFromX, setCurrentTime, setSelectionRange, setIsDraggingPlayhead])

  // ─── Selection resize handles ──────────────────────────────────────────
  const handleSelectionEdgeDrag = useCallback((edge: 'start' | 'end', e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selectionRange) return

    const onMove = (me: MouseEvent) => {
      const t = getTimeFromX(me.clientX)
      if (edge === 'start') {
        setSelectionRange([t, selectionRange[1]])
      } else {
        setSelectionRange([selectionRange[0], t])
      }
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [selectionRange, getTimeFromX, setSelectionRange])

  // ─── Timeline resize handle ────────────────────────────────────────────
  const handleTimelineResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = timelineHeight

    const onMove = (me: MouseEvent) => {
      const delta = startY - me.clientY // dragging up increases height
      setTimelineHeight(Math.max(150, Math.min(800, startHeight + delta)))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [timelineHeight, setTimelineHeight])

  // ─── Track reordering ─────────────────────────────────────────────────
  const orderedTracks = trackOrder
    .map(id => FORENSIC_MOCK_DATA.find(t => t.id === id))
    .filter((t): t is TrackData => t != null)

  // Any solo tracks?
  const hasSolo = Object.values(trackMeta).some(m => m.solo)

  if (isTimelineCollapsed) {
    return (
      <footer className="relative z-[100] border-t border-zinc-800 bg-zinc-950 shadow-2xl">
        <TimelineControls />
      </footer>
    )
  }

  return (
    <footer
      ref={containerRef}
      className={cn(
        "relative z-[100] flex flex-col border-t border-zinc-800 bg-zinc-950 shadow-2xl",
        isTimelineFullscreen && "fixed inset-0 z-[999]"
      )}
      style={isTimelineFullscreen ? undefined : { height: timelineHeight }}
      role="region"
      aria-label="Forensic Timeline Instrument"
    >
      {/* Resize handle (top edge) */}
      {!isTimelineFullscreen && (
        <div
          className="absolute top-0 left-0 right-0 h-1 cursor-row-resize z-[101] hover:bg-indigo-400/20 transition-colors"
          onMouseDown={handleTimelineResize}
        />
      )}

      {/* Control Zone */}
      <TimelineControls />

      {/* Settings Panel (absolute overlay) */}
      <SettingsPanel />

      {/* Minimap */}
      {showMinimap && <TimelineMinimap />}

      {/* Workspace Zone (Ruler + Tracks) */}
      <div
        ref={scrollRef}
        className="no-scrollbar relative flex-1 overflow-x-auto overflow-y-auto bg-[#030303]"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <div className="relative" style={{ width: (TIMELINE_DURATION / 60) * scale + 400, minHeight: '100%' }}>
          {/* Ruler Zone */}
          <TimelineRuler />

          {/* Track Zone */}
          <div className="flex flex-col">
            {orderedTracks.map((track, i) => {
              const meta = trackMeta[track.id]
              // If any track is solo'd, hide non-solo tracks
              if (hasSolo && meta && !meta.solo) return null

              return (
                <TimelineTrack
                  key={track.id}
                  {...track}
                  index={i}
                  onDragStart={() => {}}
                  onDragOver={(idx) => setDragOverIndex(idx)}
                  onDragEnd={() => {
                    if (dragOverIndex !== null && dragOverIndex !== trackOrder.indexOf(orderedTracks[dragOverIndex]?.id)) {
                      // Reorder
                      const newOrder = [...trackOrder]
                      const draggedId = orderedTracks[dragOverIndex]?.id
                      if (draggedId) {
                        const from = newOrder.indexOf(draggedId)
                        const [item] = newOrder.splice(from, 1)
                        newOrder.splice(dragOverIndex, 0, item)
                        setLocalTrackOrder(newOrder)
                      }
                    }
                    setDragOverIndex(null)
                  }}
                />
              )
            })}
          </div>

          {/* Playhead Layer */}
          <div
            className={cn(
              "absolute bottom-0 top-0 z-50 pointer-events-none",
              isDraggingPlayhead ? "w-[3px]" : "w-[2px]"
            )}
            style={{
              transform: `translateX(${(currentTime / 60) * scale}px)`,
              boxShadow: `0 0 ${isDraggingPlayhead ? 20 : 12}px #6366f1`,
              backgroundColor: '#6366f1',
              transition: isDraggingPlayhead ? 'none' : 'transform 0.06s linear',
            }}
          >
            {/* Playhead handle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-5 bg-indigo-500 rounded-b-sm pointer-events-auto cursor-col-resize" />
          </div>

          {/* Selection Overlay with resize handles */}
          {selectionRange && (() => {
            const left = (Math.min(selectionRange[0], selectionRange[1]) / 60) * scale
            const width = (Math.abs(selectionRange[1] - selectionRange[0]) / 60) * scale

            return (
              <div
                className="absolute bottom-0 top-0 z-20 border-x border-zinc-400 bg-zinc-400/8 pointer-events-none"
                style={{ left, width }}
              >
                {/* Left resize handle */}
                <div
                  className="absolute top-0 bottom-0 -left-1 w-2 cursor-col-resize pointer-events-auto hover:bg-zinc-400/30 transition-colors z-30"
                  onMouseDown={(e) => handleSelectionEdgeDrag('start', e)}
                />
                {/* Right resize handle */}
                <div
                  className="absolute top-0 bottom-0 -right-1 w-2 cursor-col-resize pointer-events-auto hover:bg-zinc-400/30 transition-colors z-30"
                  onMouseDown={(e) => handleSelectionEdgeDrag('end', e)}
                />
                {/* Selection duration label */}
                {width > 40 && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-zinc-400/80 px-1.5 py-0.5 rounded text-[7px] font-bold text-white mono-tabular whitespace-nowrap pointer-events-none">
                    {formatTime(Math.abs(selectionRange[1] - selectionRange[0]), true)}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Panels (absolute overlays within timeline) */}
      <div className="relative">
        <BookmarkPanel />
        <DetailPanel />
      </div>

      {/* Status Bar */}
      <TimelineStatusBar />
    </footer>
  )
}
