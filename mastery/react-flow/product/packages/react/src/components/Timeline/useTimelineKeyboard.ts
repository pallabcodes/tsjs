import { useEffect, useCallback } from 'react';
import { useMeshStore, TIMELINE_DURATION } from '@ostream/core';
import { getAllEvents } from './mockData';

export const useTimelineKeyboard = () => {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const {
        isPlaying, setIsPlaying, currentTime, setCurrentTime,
        scale, setScale, isReversing, setIsReversing,
        frameStep, jumpToStart, jumpToEnd,
        addBookmark, addAnnotation,
        clearSelection, selectionRange,
        loopMode, setLoopMode,
        showBookmarkPanel, setShowBookmarkPanel,
        jumpToNextBookmark, jumpToPrevBookmark,
        jumpToNextEvent, jumpToPrevEvent,
      } = useMeshStore.getState();

      switch (e.code) {
        // ─── Playback ────────────────────────────────────────────────
        case 'Space':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          if (isReversing) setIsReversing(false);
          break;

        // J/K/L — Industry standard (DaVinci/Premiere)
        case 'KeyJ':
          e.preventDefault();
          setIsReversing(true);
          setIsPlaying(true);
          break;
        case 'KeyK':
          e.preventDefault();
          setIsPlaying(false);
          setIsReversing(false);
          break;
        case 'KeyL':
          e.preventDefault();
          setIsReversing(false);
          setIsPlaying(true);
          break;

        // ─── Frame Step ──────────────────────────────────────────────
        case 'Period': // . = frame forward
          e.preventDefault();
          frameStep(1);
          break;
        case 'Comma': // , = frame backward
          e.preventDefault();
          frameStep(-1);
          break;

        // ─── Scrub ───────────────────────────────────────────────────
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentTime(Math.max(0, currentTime - (e.shiftKey ? 10 : 1)));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentTime(Math.min(TIMELINE_DURATION, currentTime + (e.shiftKey ? 10 : 1)));
          break;

        // ─── Jump ────────────────────────────────────────────────────
        case 'Home':
          e.preventDefault();
          jumpToStart();
          break;
        case 'End':
          e.preventDefault();
          jumpToEnd();
          break;
        case 'KeyR':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            jumpToStart();
          }
          break;

        // ─── Zoom ────────────────────────────────────────────────────
        case 'Equal': // +
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setScale(Math.min(12000, scale * 1.25));
          }
          break;
        case 'Minus': // -
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            setScale(Math.max(20, scale / 1.25));
          }
          break;
        case 'Digit0':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            useMeshStore.getState().zoomToFit(TIMELINE_DURATION);
          }
          break;

        // ─── Bookmarks & Annotations ─────────────────────────────────
        case 'KeyB':
          e.preventDefault();
          addBookmark(currentTime);
          break;
        case 'KeyM':
          e.preventDefault();
          addAnnotation({ time: currentTime, title: `Note @ ${currentTime.toFixed(1)}s`, color: 'amber' });
          break;

        // ─── Event Navigation ────────────────────────────────────────
        case 'KeyN':
          e.preventDefault();
          jumpToNextEvent(getAllEvents());
          break;
        case 'KeyP':
          e.preventDefault();
          jumpToPrevEvent(getAllEvents());
          break;
        case 'BracketRight': // ] = next bookmark OR nudge
          if (e.altKey) {
            e.preventDefault();
            const { selectedTrackIds, nudgeTrack } = useMeshStore.getState();
            selectedTrackIds.forEach(id => nudgeTrack(id, e.shiftKey ? 1 : 0.1));
          } else {
            e.preventDefault();
            jumpToNextBookmark();
          }
          break;
        case 'BracketLeft': // [ = prev bookmark OR nudge
          if (e.altKey) {
            e.preventDefault();
            const { selectedTrackIds, nudgeTrack } = useMeshStore.getState();
            selectedTrackIds.forEach(id => nudgeTrack(id, e.shiftKey ? -1 : -0.1));
          } else {
            e.preventDefault();
            jumpToPrevBookmark();
          }
          break;

        // ─── Selection ───────────────────────────────────────────────
        case 'Escape':
          e.preventDefault();
          clearSelection();
          break;

        // ─── Loop ────────────────────────────────────────────────────
        case 'KeyQ':
          e.preventDefault();
          if (loopMode === 'off') setLoopMode(selectionRange ? 'selection' : 'full');
          else if (loopMode === 'full') setLoopMode(selectionRange ? 'selection' : 'off');
          else setLoopMode('off');
          break;

        // ─── Panels ──────────────────────────────────────────────────
        case 'F2':
          e.preventDefault();
          setShowBookmarkPanel(!showBookmarkPanel);
          break;
      }
    },
    [] // We use getState() so no deps needed
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
};
