import { Box, Text } from "../index.js";
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
      {/* Commit Context Header (Metadata Card) */}
      {props.context && (
        <Box 
          flexDirection="column" 
          padding={{ top: 1, bottom: 1, left: 1, right: 1 }}
          margin={{ bottom: 1 }}
          bg="#0f172a"
          border={true}
          borderColor="#1e293b"
        >
          <Box flexDirection="row">
            <Text fg="#22d3ee" bold={true} width={10}>COMMIT</Text>
            <Text fg="#cbd5e1" value={props.context.hash} />
          </Box>
          <Box flexDirection="row">
            <Text fg="#22d3ee" bold={true} width={10}>AUTHOR</Text>
            <Text fg="#cbd5e1" value={props.context.author} />
          </Box>
          <Box flexDirection="row">
            <Text fg="#22d3ee" bold={true} width={10}>DATE</Text>
            <Text fg="#cbd5e1" value={props.context.date} />
          </Box>
          <Box flexDirection="row">
             <Text fg="#22d3ee" bold={true} width={10}>MSG</Text>
             <Text fg="#f8fafc" bold={true} value={truncate(props.context.message, w - 15, "...")} />
          </Box>
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
