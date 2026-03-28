/** @jsx h */
/**
 * @zen-tui/solid: Sovereign CommandInput
 * 
 * Interactive command-line interface for the Sovereign TUI.
 * Supports distinct styling for prompts, commands, and options.
 */

import { Box, Text } from "../index.js";

export interface CommandInputProps {
  prompt?: string;
  command?: string;
  args?: string;
  focused?: boolean;
}

/**
 * Sovereign CommandInput: Premium CLI input area.
 */
export function CommandInput(props: CommandInputProps) {
  const THEME = {
    promptFg: "#2dd4bf", // Teal
    commandFg: "#e2e8f0", // Off-white
    argsFg: "#94a3b8",    // Slate
    cursorFg: "#ffffff",
  };

  return (
    <Box flexDirection="row" height={1} padding={{ left: 1, right: 1 }}>
      {/* Prompt */}
      <Text bold={true} fg={THEME.promptFg}>
        {` ${props.prompt || "❯"} `}
      </Text>

      {/* Input Content */}
      <Box flexDirection="row">
        <Text fg={THEME.commandFg} bold={true}>
          {props.command || "git"}
        </Text>
        <Text fg={THEME.argsFg}>
          {` ${props.args || ""}`}
        </Text>
      </Box>

      {/* Cursor */}
      <Show when={props.focused}>
        <Text fg={THEME.cursorFg} bold={true}>
          {" ▎"}
        </Text>
      </Show>
    </Box>
  );
}
import { Show } from "solid-js";
