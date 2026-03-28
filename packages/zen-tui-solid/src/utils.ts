/**
 * @zen-tui/solid: Core Utilities & Types
 */

/**
 * Standard TUI text truncation with ellipsis.
 */
export function truncate(text: string, maxWidth: number): string {
  if (maxWidth <= 0) return "";
  if (text.length <= maxWidth) return text;
  return text.slice(0, maxWidth - 1) + "…";
}

/**
 * Common TUI Domain Types
 */
export interface TreeNode {
  name: string;
  path: string;
  indent: number;
  isDir?: boolean;
  status?: string;
  isOpen?: boolean;
}
