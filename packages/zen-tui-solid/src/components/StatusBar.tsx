import type { ZenInputEvent } from '@zen-tui/core';
export type { ZenInputEvent };
import { Box, Text, type ZenProps } from "../index.js";

/**
 * StatusBar: Premium, multi-segment status reporting tool.
 * Matches mockup with F-key shortcuts and branch context.
 */
export interface StatusBarProps extends ZenProps {
  y?: number;
  width?: number;
  branch: string;
  status: string;
  position: string;
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
    <Box bg="#1e293b" border={false} {...props}>
      {/* Function Keys Cluster (Matches Mockup) */}
      <Box flexDirection="row" padding={{ left: 1 }}>
        {F_KEYS.map((f, i) => (
          <Box flexDirection="row" width={11}>
            <Text fg="#94a3b8">{f.key}</Text>
            <Text fg="#94a3b8">:</Text>
            <Text fg="#f1f5f9" bold={true}>{` ${f.label}`}</Text>
          </Box>
        ))}
        <Box flexDirection="row" width={13}>
          <Text fg="#94a3b8">enter:</Text>
          <Text fg="#f1f5f9" bold={true}> diff</Text>
        </Box>
        <Box flexDirection="row" width={14}>
          <Text fg="#94a3b8">ctrl+c:</Text>
          <Text fg="#f1f5f9" bold={true}> quit</Text>
        </Box>
      </Box>

      <Box flexGrow={1} />

      {/* Persistence Context / Activity */}
      <Box flexDirection="row" padding={{ right: 2 }}>
        <Text fg="#22c55e" bold={true}>{props.branch}</Text>
        <Box width={2} />
        <Text fg="#94a3b8">{props.status}</Text>
        <Box width={2} />
        <Text fg="#f1f5f9" bold={true}>{props.position}</Text>
      </Box>
    </Box>
  );
}
