/** @jsx h */
import type { ZenInputEvent } from '@zen-tui/core';
export type { ZenInputEvent };
import { Box, Text, h } from "../index.js";

/**
 * StatusBar: Premium, multi-segment status reporting tool.
 * Matches mockup with F-key shortcuts and branch context.
 */
export interface StatusBarProps {
  y: number;
  width: number;
  branch: string;
  status: string;
  position?: string;
}

export function StatusBar(props: StatusBarProps) {
  const F_KEYS = [
    { key: "f1", label: "help" },
    { key: "f2", label: "status" },
    { key: "f3", label: "graph" },
    { key: "f4", label: "branches" },
    { key: "f5", label: "logs" },
  ];

  return (
    <Box 
      fixedPosition={{ x: 0, y: props.y, w: props.width, h: 1 }} 
      flexDirection="row" 
      bg="#1e293b" 
      padding={{ left: 1, right: 1 }}
    >
      {/* Function Keys Cluster (Matches Mockup) */}
      <Box flexDirection="row" gap={2}>
        {F_KEYS.map((f) => (
          <Box flexDirection="row">
            <Text fg="#94a3b8">{`${f.key}: `}</Text>
            <Text fg="#f1f5f9">{f.label}</Text>
          </Box>
        ))}
        <Box flexDirection="row">
          <Text fg="#94a3b8">enter: </Text>
          <Text fg="#f1f5f9">diff</Text>
        </Box>
        <Box flexDirection="row">
          <Text fg="#94a3b8">ctrl+c: </Text>
          <Text fg="#f1f5f9">quit</Text>
        </Box>
      </Box>

      <Box flexGrow={1} />

      {/* Domain Context Cluster */}
      <Box flexDirection="row" gap={2}>
        <Text fg="#2dd4bf" bold={true}>{props.branch}</Text>
        <Text fg="#94a3b8">{props.status}</Text>
        <Text fg="#fbbf24">{props.position || "0/0"}</Text>
      </Box>

    </Box>
  );
}
