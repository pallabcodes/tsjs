import { useMeshStore, formatTime } from '@ostream/core';
import { Bookmark, X, Trash2, ChevronRight } from 'lucide-react';

export const BookmarkPanel = () => {
  const { bookmarks, removeBookmark, setCurrentTime, showBookmarkPanel, setShowBookmarkPanel } = useMeshStore();

  if (!showBookmarkPanel) return null;

  const sorted = [...bookmarks].sort((a, b) => a.time - b.time);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-56 bg-vms-surface-elevated border-l border-white/10 z-[150] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bookmark size={12} className="text-amber-400" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Bookmarks</span>
          <span className="text-[8px] font-bold text-white/30 mono-tabular">{bookmarks.length}</span>
        </div>
        <button
          onClick={() => setShowBookmarkPanel(false)}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10"
        >
          <X size={12} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-full opacity-20 flex-col gap-2 p-4">
            <Bookmark size={20} />
            <span className="text-[8px] uppercase tracking-widest">Press B to add</span>
          </div>
        ) : (
          sorted.map((bm) => (
            <div
              key={bm.id}
              className="flex items-center gap-2 px-3 py-2 border-b border-white/5 hover:bg-white/5 cursor-pointer group transition-colors"
              onClick={() => setCurrentTime(bm.time)}
            >
              <div className="w-1 h-6 rounded-full bg-amber-400/60" />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-white truncate block">{bm.label}</span>
                <span className="text-[8px] mono-tabular text-white/30">{formatTime(bm.time)}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBookmark(bm.id);
                }}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={10} className="text-vms-red-500" />
              </button>
              <ChevronRight size={10} className="opacity-20" />
            </div>
          ))
        )}
      </div>

      {/* Footer shortcut hint */}
      <div className="px-3 py-1.5 border-t border-white/5 text-[7px] opacity-20 text-center uppercase tracking-widest">
        [ ] Navigate · B Add · F2 Toggle
      </div>
    </div>
  );
};
