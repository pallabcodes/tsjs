/** @jsx h */
import { Show } from "solid-js";
import { Box, Text, h } from "../index.js";
import { truncate, type TreeNode } from "../utils.js";

/**
 * FileTree: Professional file explorer with Git status visualization.
 * Matches mockup with specific icon behavior and colors.
 */
interface FileTreeProps {
  files: TreeNode[];
  selectedIdx?: number;
  width?: number;
  focused?: boolean;
  onSelect?: (node: TreeNode, index: number) => void;
}

export function FileTree(props: FileTreeProps) {
  const STATUS_ICONS: Record<string, string> = {
    "A":  "A", 
    "M":  "M", 
    "D":  "D", 
    "R":  "R", 
    "U":  "?", 
    "??": "?",
    "":   " ",
  };

  const STATUS_COLORS: Record<string, string> = {
    "A":  "#10b981", // Emerald
    "M":  "#fbbf24", // Amber (matches mockup 'M')
    "D":  "#ef4444", // Red
    "R":  "#a855f7", // Purple
    "U":  "#94a3b8", // Slate
    "??": "#94a3b8",
  };

  const getFileIcon = (name: string, isDir: boolean) => {
    if (isDir) return { icon: "DIR ", color: "#60a5fa" };
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return { icon: "TS  ", color: "#3b82f6" };
    if (name.endsWith(".js") || name.endsWith(".jsx")) return { icon: "JS  ", color: "#fde047" };
    if (name.endsWith(".md")) return { icon: "MD  ", color: "#a855f7" };
    if (name.endsWith(".json")) return { icon: "JSON", color: "#fbbf24" };
    return { icon: "FILE", color: "#94a3b8" };
  };

  const w = props.width || 30;

  return (
    <Box flexDirection="column" gap={0}>
      {props.files.map((file, idx) => {
        const isSelected = props.focused && idx === (props.selectedIdx ?? 0); 
        const indent = "  ".repeat(file.indent || 0);
        const { icon, color } = getFileIcon(file.name, !!file.isDir);
        const dirIndicator = file.isDir ? (file.isOpen ? "▼ " : "▶ ") : "  ";
        
        return (
          <Box 
            flexDirection="row" 
            bg={isSelected ? "#1e293b" : undefined}
            padding={{ left: 1, right: 1 }}
          >
            <Text fg={isSelected ? "#60a5fa" : "#334155"}>
              {`${indent}${dirIndicator}`}
            </Text>
            
            <Box width={6} flexDirection="row">
               <Text fg={isSelected ? "#60a5fa" : color} bold={true}>
                 {icon}
               </Text>
            </Box>

            <Text 
              fg={isSelected ? "#f1f5f9" : (file.isDir ? "#e2e8f0" : "#cbd5e1")}
              bold={isSelected || file.isDir}
            >
              {truncate(file.name, w - indent.length - 8)}
            </Text>

            <Box flexGrow={1} />

            <Show when={!!file.status}>
              <Text fg={STATUS_COLORS[file.status!] || "#94a3b8"} bold={true}>
                {` ${STATUS_ICONS[file.status!] || " "} `}
              </Text>
            </Show>
          </Box>
        );
      })}
    </Box>
  );
}
