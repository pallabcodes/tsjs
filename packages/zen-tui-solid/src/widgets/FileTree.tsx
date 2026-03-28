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

  const w = props.width || 30;

  return (
    <Box flexDirection="column" gap={0}>
      {props.files.map((file, idx) => {
        const isSelected = props.focused && idx === 0; 
        const indent = "  ".repeat(file.indent || 0);
        const icon = file.isDir ? (file.isOpen ? "▼ " : "▶ ") : "  ";
        const fileIcon = file.isDir ? "📁" : (file.name.endsWith(".js") ? "🟨" : "📄");
        
        return (
          <Box 
            flexDirection="row" 
            bg={isSelected ? "#1e293b" : undefined}
            padding={{ left: 1, right: 1 }}
          >
            <Text fg={isSelected ? "#60a5fa" : "#94a3b8"}>
              {`${indent}${icon}${fileIcon} `}
            </Text>
            
            <Text 
              fg={isSelected ? "#f1f5f9" : (file.isDir ? "#e2e8f0" : "#cbd5e1")}
              bold={file.isDir}
            >
              {truncate(file.name, w - indent.length - 10)}
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
