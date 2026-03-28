/** @jsx h */
import { Box, Text } from "@zen-tui/solid";

/**
 * ZenPill: High-fidelity status indicator.
 */
export const ZenPill = (props: { label: string; fg?: string; bg?: string }) => {
  return (
    <Box
      bg={props.bg || "#374151"}
      padding={{ left: 1, right: 1 }}
      border={true}
      borderColor={props.fg || "#9ca3af"}
    >
      <Text fg={props.fg || "#ffffff"} bold={true}>
        {props.label}
      </Text>
    </Box>
  );
};
