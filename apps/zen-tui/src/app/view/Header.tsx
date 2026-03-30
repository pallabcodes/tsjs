/** @jsx h */
import { Box, Text } from '@zen-tui/solid';
import { Theme } from '../theme.js';

export function Header() {
  return (
    <Box flexDirection="column" bg={Theme.Colors.Background}>
      {/* Purposeful Context Bar - Premium Seamless Background */}
      <Box height={1} flexDirection="row" padding={{ left: Theme.Spacing.Small, right: Theme.Spacing.Small }}>
         <Box width={30}><Text fg={Theme.Colors.Primary} bold={true} value="▙ ZEN-TUI PRO" /></Box>
         <Box flexGrow={1} alignItems="center">
             <Text fg={Theme.Colors.TextMain} bold={true} value="REPOSITORY: " />
             <Text fg="#60a5fa" value="github.com/pallabcodes/tsjs" />
         </Box>
         <Box width={30} alignItems="flex-end">
            <Text fg={Theme.Colors.TextDim} value="Active Branch: " />
            <Text fg={Theme.Colors.Success} bold={true} value="main" />
         </Box>
      </Box>
      <Box height={1} padding={{ left: Theme.Spacing.Small, right: Theme.Spacing.Small }}><Text fg={Theme.Colors.Border} value={"━".repeat(240)} /></Box>
      
      {/* Smart Fit System Metrics & Engine Stats */}
      <Box height={2} flexDirection="row" padding={{ top: Theme.Spacing.Small, left: Theme.Spacing.Small, right: Theme.Spacing.Small }}>
          <Box width={40} flexDirection="row">
              <Text fg={Theme.Colors.TextStrong} bold={true} value="SOVEREIGN ENGINE  " />
              <Text fg={Theme.Colors.Border} value="│ " />
              <Text fg={Theme.Colors.TextMuted} value="Tick: " />
              <Text fg={Theme.Colors.Success} bold={true} value="0.2ms ▂▃▄▂" />
          </Box>
          
          <Box flexGrow={1} flexDirection="row">
              <Text fg={Theme.Colors.TextMuted} value="CPU: " />
              <Text fg={Theme.Colors.Success} value="███░░░░░ " />
              <Text fg={Theme.Colors.TextMain} value="12%  " />
              <Text fg={Theme.Colors.Border} value="│  " />
              
              <Text fg={Theme.Colors.TextMuted} value="RAM: " />
              <Text fg={Theme.Colors.Primary} value="██████░░ " />
              <Text fg={Theme.Colors.TextMain} value="48MB  " />
              <Text fg={Theme.Colors.Border} value="│  " />

              <Text fg={Theme.Colors.TextMuted} value="NET: " />
              <Text fg={Theme.Colors.Highlight} value="2.4MB/s" />
          </Box>

          <Box width={34} flexDirection="row" alignItems="flex-end">
              <Text fg={Theme.Colors.TextMuted} value="Bundle  " />
              <Text fg={Theme.Colors.Success} value="Core: 42kb " />
              <Text fg={Theme.Colors.Border} value="│ " />
              <Text fg={Theme.Colors.Warning} value="CSS: 14kb" />
          </Box>
      </Box>
    </Box>
  );
}

export const HorizontalLine = () => <Box height={1}><Text fg={Theme.Colors.Border} value={"━".repeat(300)} /></Box>;

/**
 * VerticalDivider: RIGID PRECISION (V130)
 * ╼ Slimmed down to width=3 for better horizontal density correctly.
 */
export const VerticalDivider = () => (
  <Box width={3} flexDirection="column" alignItems="center">
    <Box width={1} flexGrow={1} bg={Theme.Colors.Border} />
  </Box>
);
