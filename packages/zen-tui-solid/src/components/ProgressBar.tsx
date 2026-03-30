/** @jsx h */
/**
 * @zen-tui/solid: Sovereign ProgressBar
 * 
 * High-fidelity horizontal progress indicator with 
 * professional styling and Unicode visualization.
 */

import { createMemo } from "solid-js";
import { Box, Text } from '../index.js';

export interface ProgressBarProps {
  value: number; // 0.0 - 1.0
  width: number;
  label?: string;
  showPercent?: boolean;
}

/**
 * Sovereign ProgressBar: Premium progress visualization.
 */
export function ProgressBar(props: ProgressBarProps) {
  const val = createMemo(() => Math.max(0, Math.min(1, props.value)));
  
  const THEME = {
    fill: "#10b981", // Emerald
    empty: "#334155", // Slate
    labelFg: "#94a3b8",
    percentFg: "#e2e8f0",
  };

  const CHARS = {
    fill: "▰",
    empty: "▱",
  };

  const barWidth = createMemo(() => {
    const labelLen = props.label ? props.label.length + 1 : 0;
    const percentLen = props.showPercent !== false ? 5 : 0;
    return Math.max(1, props.width - labelLen - percentLen);
  });

  const filledCount = createMemo(() => Math.round(barWidth() * val()));
  const emptyCount = createMemo(() => barWidth() - filledCount());

  return (
    <Box flexDirection="row" height={1}>
      {/* Label */}
      <Show when={props.label}>
        <Text fg={THEME.labelFg}>{`${props.label} `}</Text>
      </Show>

      {/* Bar */}
      <Box flexDirection="row">
        <Text fg={THEME.fill}>{CHARS.fill.repeat(filledCount())}</Text>
        <Text fg={THEME.empty}>{CHARS.empty.repeat(emptyCount())}</Text>
      </Box>

      {/* Percentage */}
      <Show when={props.showPercent !== false}>
        <Text fg={THEME.percentFg}>{` ${Math.round(val() * 100)}%`}</Text>
      </Show>
    </Box>
  );
}
import { Show } from "solid-js";
