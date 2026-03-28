/** @jsx h */
import { Box, Text } from "@zen-tui/solid";

/**
 * ZenButton: High-fidelity focusable button.
 */
export const ZenButton = (props: { label: string; focused?: boolean }) => {
  return (
    <Box
      bg={props.focused ? "#5b9df9" : "#1e1e24"}
      padding={{ left: 2, right: 2 }}
      border={true}
      borderColor={props.focused ? "#ffffff" : "#3f3f46"}
    >
      <Text fg={props.focused ? "#000000" : "#ffffff"} bold={props.focused}>
        {props.label}
      </Text>
    </Box>
  );
};
