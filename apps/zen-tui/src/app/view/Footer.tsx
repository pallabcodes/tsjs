import { Box, Text, Show } from '@zen-tui/solid';
import { footerMode } from '../store.js';
import { Theme } from '../theme.js';

/**
 * PassiveFooter: Navigation Mode Visuals
 */
export function PassiveFooter() {
  return (
    <Box height={1} flexDirection="row" width="100%" justifyContent="space-between" bg={Theme.Colors.Background}>
       <Box flexDirection="row">
          <Text fg={Theme.Colors.Primary} value=" READY" />
       </Box>
       <Box width={40} alignItems="flex-end">
          <Text fg={Theme.Colors.Border} value=" [SOVEREIGN_L5_PRODUCTION] " />
          <Text fg={Theme.Colors.Primary} value="OK" />
       </Box>
    </Box>
  );
}

/**
 * ActiveFooter: Command Mode Visuals
 */
export function ActiveFooter() {
  return (
    <Box height={1} flexDirection="row" width="100%" justifyContent="space-between" bg={Theme.Colors.Background}>
       <Box flexDirection="row">
          <Box height={1} paddingRight={1}>
            <Text color="yellow" value=" [ : ] " />
          </Box>
          <Box height={1} paddingRight={2}>
            <Text color="brightWhite" value=" COMMAND MODE" />
          </Box>
          <Box height={1} paddingRight={2}>
            <Text color="gray" value="q" />
            <Text color="gray" value=" QUIT" />
          </Box>
       </Box>
       <Box width={40} alignItems="flex-end">
          <Text fg={Theme.Colors.Border} value=" [SOVEREIGN_L5_PRODUCTION] " />
          <Text fg={Theme.Colors.Primary} value="OK" />
       </Box>
    </Box>
  );
}

/**
 * Footer: Absolute Reactive Branch-Swapper
 */
export function Footer() {
  return (
    <Box height={1} flexDirection="row">
       <Show when={() => footerMode() === 'passive'} fallback={<ActiveFooter />}>
          <PassiveFooter />
       </Show>
    </Box>
  );
}
