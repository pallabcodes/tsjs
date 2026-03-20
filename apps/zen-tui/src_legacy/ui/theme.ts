// Theme system for zen-tui
// 3 premium theme presets with full color tokens

export type ThemeName = "midnight" | "nord" | "dracula";

export interface ThemeColors {
  bg: string;
  bgPanel: string;
  bgSelected: string;
  bgHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  accentBlue: string;
  accentGreen: string;
  accentRed: string;
  accentOrange: string;
  accentPurple: string;
  accentCyan: string;
  accentPink: string;
  branchCurrent: string;
  branchRemote: string;
  commitHash: string;
  tagColor: string;
  diffAdd: string;
  diffAddBg: string;
  diffDel: string;
  diffDelBg: string;
  diffCtx: string;
  staged: string;
  unstaged: string;
  untracked: string;
  border: string;
  borderFocus: string;
  lanes: string[];
}

const MIDNIGHT: ThemeColors = {
  bg: "#0d1117", bgPanel: "#161b22", bgSelected: "#1f2937", bgHover: "#21262d",
  textPrimary: "#e6edf3", textSecondary: "#8b949e", textMuted: "#484f58", textInverse: "#0d1117",
  accentBlue: "#58a6ff", accentGreen: "#3fb950", accentRed: "#f85149", accentOrange: "#d29922",
  accentPurple: "#bc8cff", accentCyan: "#39d2c0", accentPink: "#f778ba",
  branchCurrent: "#3fb950", branchRemote: "#58a6ff", commitHash: "#d29922", tagColor: "#bc8cff",
  diffAdd: "#3fb950", diffAddBg: "#0d2818", diffDel: "#f85149", diffDelBg: "#3d1117", diffCtx: "#8b949e",
  staged: "#3fb950", unstaged: "#d29922", untracked: "#8b949e",
  border: "#30363d", borderFocus: "#58a6ff",
  lanes: ["#58a6ff", "#3fb950", "#f85149", "#d29922", "#bc8cff", "#39d2c0", "#f778ba"],
};

const NORD: ThemeColors = {
  bg: "#2e3440", bgPanel: "#3b4252", bgSelected: "#434c5e", bgHover: "#4c566a",
  textPrimary: "#eceff4", textSecondary: "#d8dee9", textMuted: "#4c566a", textInverse: "#2e3440",
  accentBlue: "#88c0d0", accentGreen: "#a3be8c", accentRed: "#bf616a", accentOrange: "#d08770",
  accentPurple: "#b48ead", accentCyan: "#8fbcbb", accentPink: "#b48ead",
  branchCurrent: "#a3be8c", branchRemote: "#88c0d0", commitHash: "#ebcb8b", tagColor: "#b48ead",
  diffAdd: "#a3be8c", diffAddBg: "#2e3440", diffDel: "#bf616a", diffDelBg: "#2e3440", diffCtx: "#d8dee9",
  staged: "#a3be8c", unstaged: "#ebcb8b", untracked: "#4c566a",
  border: "#4c566a", borderFocus: "#88c0d0",
  lanes: ["#88c0d0", "#a3be8c", "#bf616a", "#d08770", "#b48ead", "#8fbcbb", "#ebcb8b"],
};

const DRACULA: ThemeColors = {
  bg: "#282a36", bgPanel: "#44475a", bgSelected: "#6272a4", bgHover: "#44475a",
  textPrimary: "#f8f8f2", textSecondary: "#bd93f9", textMuted: "#6272a4", textInverse: "#282a36",
  accentBlue: "#8be9fd", accentGreen: "#50fa7b", accentRed: "#ff5555", accentOrange: "#ffb86c",
  accentPurple: "#bd93f9", accentCyan: "#8be9fd", accentPink: "#ff79c6",
  branchCurrent: "#50fa7b", branchRemote: "#8be9fd", commitHash: "#f1fa8c", tagColor: "#bd93f9",
  diffAdd: "#50fa7b", diffAddBg: "#282a36", diffDel: "#ff5555", diffDelBg: "#282a36", diffCtx: "#6272a4",
  staged: "#50fa7b", unstaged: "#ffb86c", untracked: "#6272a4",
  border: "#6272a4", borderFocus: "#bd93f9",
  lanes: ["#8be9fd", "#50fa7b", "#ff5555", "#ffb86c", "#bd93f9", "#ff79c6", "#f1fa8c"],
};

const THEMES: Record<ThemeName, ThemeColors> = { midnight: MIDNIGHT, nord: MIDNIGHT, dracula: MIDNIGHT };
export const THEME_NAMES: ThemeName[] = ["midnight"];

let activeTheme: ThemeName = "midnight";
export function setActiveTheme(name: ThemeName) { activeTheme = "midnight"; }
export function getActiveTheme(): ThemeName { return "midnight"; }
export function getTheme(name?: ThemeName): ThemeColors { return MIDNIGHT; }

// Re-export mutable reference for convenience (components call getTheme())
export const theme = MIDNIGHT; // Default fallback for static imports

// Box-drawing characters
export const box = {
  topLeft: "╭", topRight: "╮", bottomLeft: "╰", bottomRight: "╯",
  horizontal: "─", vertical: "│", teeRight: "├", teeLeft: "┤",
  teeDown: "┬", teeUp: "┴", cross: "┼",
} as const;

// Git graph chars
export const graph = {
  commit: "●", line: "│", branch: "├", merge: "╮", fork: "╰", dash: "─",
} as const;

// Status icons
export const icons = {
  branch: "", tag: "", staged: "✓", unstaged: "●", untracked: "?",
  stash: "⊡", ahead: "↑", behind: "↓", notification: "⚡", arrow: "→",
  check: "✔", cross: "✘", dot: "•", ellipsis: "…", lock: "🔒", warning: "⚠",
  fire: "🔥", gear: "⚙", sparkle: "✦", diamond: "◆", circle: "◉",
} as const;
