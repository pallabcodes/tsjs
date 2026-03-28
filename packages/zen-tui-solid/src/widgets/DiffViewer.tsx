/** @jsx h */
import { Box, Text, h } from "../index.js";
import { truncate } from "../utils.js";

/**
 * DiffLine: Type-safe diff representation.
 */
interface DiffLine {
  type: "+" | "-" | " " | "header";
  content: string;
  lineNum?: number;
}

/**
 * CommitContext: Detailed header context from the mockup.
 */
interface CommitContext {
  hash: string;
  author: string;
  date: string;
  message: string;
}

/**
 * DiffViewer: Synchronized code diff visualization with commit context.
 * Matches mockup design for 'Commit Details & Diff' panel.
 */
interface DiffViewerProps {
  filename: string;
  lines: DiffLine[];
  context?: CommitContext;
  width?: number;
}

export function DiffViewer(props: DiffViewerProps) {
  const COLORS: Record<string, string> = {
    "+":      "#10b981", // Green
    "-":      "#ef4444", // Red
    " ":      "#94a3b8", // Slate
    "header": "#22d3ee", // Cyan-ish hunk header
  };

  const w = props.width || 60;

  return (
    <Box flexDirection="column" gap={0}>
      {/* Commit Context Header (Matches Mockup) */}
      {props.context && (
        <Box flexDirection="column" padding={{ bottom: 1 }}>
          <Text fg="#cbd5e1">{`Commit:  ${props.context.hash}`}</Text>
          <Text fg="#cbd5e1">{`Author:  ${props.context.author}`}</Text>
          <Text fg="#cbd5e1">{`Date:    ${props.context.date}`}</Text>
          <Text fg="#cbd5e1">{`Message: ${truncate(props.context.message, w - 10)}`}</Text>
          <Box height={1} />
        </Box>
      )}

      {/* Filename Header */}
      <Box padding={{ bottom: 1 }}>
        <Text fg="#9ca3af" italic={true}>{props.filename}</Text>
      </Box>

      {/* Color-coded Diff Body */}
      {props.lines.map((line) => {
        const ln = String(line.lineNum || "").padStart(3);
        const marker = line.type === "+" ? "+" : line.type === "-" ? "-" : " ";
        const prefix = line.type === "header" ? "" : `${ln} ${marker} `;
        
        return (
          <Box flexDirection="row" bg={line.type === "+" ? "#065f4633" : line.type === "-" ? "#991b1b33" : undefined}>
            <Text fg={COLORS[line.type]}>{`${prefix}${line.content}`}</Text>
          </Box>
        );
      })}
    </Box>
  );
}
