import { Box, Text } from '@zen-tui/solid';
import { useZenState } from '../store/ZenStore.js';
import { Theme } from '../theme.js';

export function Footer() {
  return (
    <Box height={1} flexDirection="row">
       {useZenState.mode() === 'passive' ? <PassiveFooter /> : <ActiveFooter />}
    </Box>
  );
}

function PassiveFooter() {
  return (
    <Box flexGrow={1} bg={Theme.Colors.Panel} flexDirection="row" padding={{ left: Theme.Spacing.Small, right: Theme.Spacing.Small }}>
       <Box width={10}><Text fg={Theme.Colors.Success} bold={true} value=" READY" /></Box>
       <Box flexGrow={1} flexDirection="row">
          <Command key=":" label="COMMAND MODE" />
          <Command key="q" label="QUIT" />
       </Box>
       <Box width={40} alignItems="flex-end">
          <Text fg={Theme.Colors.Border} value=" [SOVEREIGN_L5_PRODUCTION] " />
          <Text fg={Theme.Colors.Primary} value="OK" />
       </Box>
    </Box>
  );
}

function ActiveFooter() {
  return (
    <Box flexGrow={1} bg={Theme.Colors.PanelActive} flexDirection="row" padding={{ left: Theme.Spacing.Small, right: Theme.Spacing.Small }}>
       <Box width={5}><Text fg={Theme.Colors.Warning} bold={true} value=" (:) " /></Box>
       <Box flexGrow={1}>
          <Text fg={Theme.Colors.TextStrong} bold={true} value="commit -m 'Implement highly requested premium features' █" />
       </Box>
       <Box width={20} alignItems="flex-end">
          <Text fg={Theme.Colors.TextMuted} value="[ESC to Exit]" />
       </Box>
    </Box>
  );
}

const Command = (props: any) => (
  <Box padding={{ right: Theme.Spacing.Medium }} flexDirection="row">
     <Text fg={Theme.Colors.TextMuted} value={props.key} />
     <Text fg={Theme.Colors.TextDim} value={` ${props.label}`} />
  </Box>
);
