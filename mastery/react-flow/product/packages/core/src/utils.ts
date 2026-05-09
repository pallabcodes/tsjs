import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number, showMs = false) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  const base = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return showMs ? `${base}.${ms.toString().padStart(3, '0')}` : base;
};

export const formatTimeRelative = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  if (m > 0) return `${m}m ${s}s`;
  if (s > 0) return `${s}.${ms.toString().padStart(3, '0')}s`;
  return `${ms}ms`;
};

/** Export selection data in specified format */
export const exportSelectionData = (
  data: { tracks: any[]; range: [number, number] },
  format: 'json' | 'csv' | 'clipboard'
): string => {
  const { tracks, range } = data;
  const [start, end] = [Math.min(...range), Math.max(...range)];

  const filtered = tracks.map(track => ({
    id: track.id,
    label: track.label,
    type: track.type,
    spans: (track.spans ?? []).filter(
      ([s, d]: [number, number]) => s + d > start && s < end
    ),
    events: (track.events ?? []).filter((ts: number) => ts >= start && ts <= end),
  }));

  if (format === 'json') {
    return JSON.stringify({ range: { start, end, duration: end - start }, tracks: filtered }, null, 2);
  }

  if (format === 'csv') {
    const lines = ['track_id,track_label,type,item_type,start,end_or_timestamp'];
    filtered.forEach(t => {
      t.spans.forEach(([s, d]: [number, number]) => {
        lines.push(`${t.id},${t.label},${t.type},span,${s},${s + d}`);
      });
      t.events.forEach((ts: number) => {
        lines.push(`${t.id},${t.label},${t.type},event,${ts},`);
      });
    });
    return lines.join('\n');
  }

  // clipboard = human-readable
  const dur = formatTime(end - start, true);
  const header = `Forensic Selection: ${formatTime(start)} → ${formatTime(end)} (${dur})`;
  const body = filtered.map(t => {
    const items = [
      ...t.spans.map(([s, d]: [number, number]) => `  SPAN ${formatTime(s)} +${formatTimeRelative(d)}`),
      ...t.events.map((ts: number) => `  EVENT ${formatTime(ts)}`),
    ];
    return `${t.label} (${t.type}):\n${items.join('\n') || '  (no data in range)'}`;
  }).join('\n\n');
  return `${header}\n${'─'.repeat(60)}\n${body}`;
};
