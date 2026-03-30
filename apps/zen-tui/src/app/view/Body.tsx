/** @jsx h */
import { Box, Text, h } from '@zen-tui/solid';
import { VerticalDivider } from './Header.js';

/**
 * Body: Sovereign Dashboard V140
 * Restored to Flexbox dynamically resizing architecture (removing static absolute Panels)
 */
export function Body() {
  return (
    <Box flexGrow={1} flexDirection="row" padding={{ top: 1, left: 1, right: 1 }}>
       <Explorer />
       <VerticalDivider />
       <RevisionGraph />
       <VerticalDivider />
       <SystemMetrics />
    </Box>
  );
}

function Explorer() {
  return (
    <Box width={26} flexDirection="column" padding={{ right: 2 }}>
       <Box flexDirection="row" height={1}>
           <Text fg="#22c55e" value="● " />
           <Text fg="#94a3b8" value="INPUT_OK  [MODE: passive]" />
       </Box>
       <Box height={1} />
       <Box flexDirection="row" height={1}>
           <Text fg="#3b82f6" bold={true} value=".. EXPLORER" />
       </Box>
       <Text fg="#475569" value="[src/main]" />
       <Box height={1} />
       <Text fg="#eab308" value="▼ app/" />
       <Box flexDirection="row" height={1}>
          <Text fg="#94a3b8" value="  config.mjs   " /><Text fg="#eab308" bold={true} value="M" />
       </Box>
       <Box flexDirection="row" height={1}>
          <Text fg="#94a3b8" value="  README.md    " /><Text fg="#22c55e" bold={true} value="A" />
       </Box>
    </Box>
  );
}

function RevisionGraph() {
  return (
    <Box flexGrow={1} flexDirection="column" padding={{ left: 2, right: 2 }}>
       <Text fg="#3b82f6" bold={true} value=" ╼ REVISION GRAPH" />
       <Box height={1} />
       
       <Box height={1} flexDirection="row">
          <Text fg="#fbbf24" value=" ● " /><Text fg="#60a5fa" value="│ ╽ " />
          <Text fg="#e2e8f0" value="[a8c2] Refactor engine loops " />
          <Text fg="#475569" value="... 2m" />
       </Box>
       <Box height={1} flexDirection="row">
          <Text fg="#60a5fa" value="   │ ╿ " /><Text fg="#a855f7" value="│ " />
          <Text fg="#94a3b8" value="[b129] Update signals " />
          <Text fg="#475569" value="...... 1h" />
       </Box>
       <Box height={1} flexDirection="row">
          <Text fg="#60a5fa" value="   ┝━┛ " /><Text fg="#a855f7" value="│ " />
          <Text fg="#fbbf24" value="[f920] Merge stable " />
          <Text fg="#475569" value="........ 4h" />
       </Box>
       <Box height={1} flexDirection="row">
          <Text fg="#60a5fa" value="   │   " /><Text fg="#a855f7" value="│ " /><Text fg="#22c55e" value="╽ " />
          <Text fg="#94a3b8" value="[e107] Final layout pass " />
          <Text fg="#475569" value="... 8h" />
       </Box>
       <Box height={1} flexDirection="row">
          <Text fg="#60a5fa" value="   ╽   " /><Text fg="#a855f7" value="╿ " /><Text fg="#22c55e" value="│ " />
          <Text fg="#94a3b8" value="[c41d] Initial TUI engine" />
       </Box>
    </Box>
  );
}

function SystemMetrics() {
  return (
    <Box width={32} flexDirection="column" padding={{ left: 2 }}>
       <Text fg="#a855f7" bold={true} value=" ╼ METRICS" />
       <Box height={1} />
       <Box flexDirection="row">
          <Text fg="#eab308" bold={true} value="Builds:    " />
          <Text fg="#e2e8f0" value="4" />
       </Box>
       <Box flexDirection="row">
          <Text fg="#22c55e" bold={true} value="Coverage:  " />
          <Text fg="#e2e8f0" value="94%" />
       </Box>
       <Box height={1} />
       <Text fg="#475569" value={"━".repeat(24)} />
       <Box height={1} />
       <Text fg="#94a3b8" value="[Diff] app.tsx" />
       <Text fg="#f87171" value="- height={50}" />
       <Text fg="#22c55e" value="+ height={24}" />
    </Box>
  );
}
