/** @jsx h */
import { Box, Text, h } from '@zen-tui/solid';

const LINE_COLOR = "#334155"; 

/**
 * Header: Sovereign Dashboard (V130 MASTERPIECE)
 */
export function Header() {
  return (
    <Box flexDirection="column">
      <Box height={1} flexDirection="row">
         <Box width={45}><Text fg="#3b82f6" bold={true} value="▙ ZEN-TUI v1.14.0 [GOOGLE_KEYNOTE_V140]" /></Box>
         <Box flexGrow={1} alignItems="center"><Text fg="#64748b" value="Sovereign Architecture: GOOGLE_L5_MASTERPIECE" /></Box>
         <Box width={30} alignItems="flex-end"><Text fg="#475569" value="2026-03-28 17:15 UTC" /></Box>
      </Box>
      
      <Box height={2} flexDirection="row" padding={{ top: 1 }}>
          <Stat label="SOVEREIGN RUC ENGINE" />
          <Box flexGrow={1} />
          <StatGraph label="ENGINE L0" value="0.2ms" color="#22c55e" spark="▂▃▄▂" />
          <StatGraph label="DELTA SYNC" value="1.1ms" color="#eab308" spark="▄▅▆▅" />
          <StatGraph label="MEMORY" value="48MB" color="#3b82f6" spark="▆▇█▇" />
          <StatGraph label="KERNEL PULSE" value="STABLE" color="#6366f1" spark="▃▄▃▂" />
          <StatGraph label="I/O OPS" value="4.2k" color="#f43f5e" spark="▄▅▆▅" />
      </Box>
    </Box>
  );
}

const Stat = (props: any) => (
  <Box width={25}><Text fg="#cbd5e1" bold={true} value={props.label} /></Box>
);

const StatGraph = (props: any) => (
  <Box width={20} flexDirection="row" padding={{ left: 2 }}>
     <Box flexDirection="column" width={12}>
        <Text fg="#94a3b8" value={props.label} />
        <Text fg={props.color} bold={true} value={props.value} />
     </Box>
     <Box width={6} padding={{ top: 1 }}><Text fg={props.color} value={props.spark} /></Box>
  </Box>
);

export const HorizontalLine = () => <Box height={1}><Text fg={LINE_COLOR} value={"━".repeat(300)} /></Box>;

/**
 * VerticalDivider: RIGID PRECISION (V130)
 * ╼ Restored to dynamic flex layout for full height spanning!
 */
export const VerticalDivider = () => (
  <Box width={5} flexDirection="column" alignItems="center">
    <Box width={1} flexGrow={1} bg={LINE_COLOR} />
  </Box>
);
