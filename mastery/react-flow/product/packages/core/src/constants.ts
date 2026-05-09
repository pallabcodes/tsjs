export const TIMELINE_DURATION = 3600; // 1 hour in seconds
export const INITIAL_SCALE = 240; // pixels per minute
export const MIN_SCALE = 20;
export const MAX_SCALE = 12000;
export const DEFAULT_FRAME_RATE = 30; // configurable per-project
export const DEFAULT_TRACK_HEIGHT = 56; // px
export const MIN_TRACK_HEIGHT = 28;
export const MAX_TRACK_HEIGHT = 120;
export const LABEL_SIDEBAR_WIDTH = 192; // 48 * 4 = w-48

export const NAV_ITEMS = ['Live View', 'Forensics', 'Topology', 'Health'] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
