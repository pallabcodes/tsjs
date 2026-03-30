/** @jsx h */
import { Box, Text, h } from '@zen-tui/solid';

/**
 * Footer: Sovereign Command Bar (V140)
 */
export function Footer() {
  return (
    <Box height={1} bg="#0f172a" flexDirection="row" padding={{ left: 1, right: 1 }}>
       <Box width={10}><Text fg="#3b82f6" bold={true} value=" READY" /></Box>
       <Box flexGrow={1} flexDirection="row">
          <Command key="q" label="QUIT" />
          <Command key="┛" label="COMMIT" />
          <Command key="⎋" label="CANCEL" />
          <Command key="S" label="SETTINGS" />
       </Box>
       <Box width={30} alignItems="flex-end">
          <Text fg="#475569" value=" [SOVEREIGN_SYSTEM_L5_STABLE]" />
       </Box>
    </Box>
  );
}

const Command = (props: any) => (
  <Box padding={{ right: 2 }} flexDirection="row">
     <Text fg="#94a3b8" value={props.key} />
     <Text fg="#64748b" value={` ${props.label}`} />
  </Box>
);
