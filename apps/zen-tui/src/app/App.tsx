/** @jsx h */
import { 
  Box, 
  Text, 
  h, 
  createSignal,
  onMount,
  onCleanup
} from '@zen-tui/solid';

/**
 * Sovereign TUI: 'Sovereign Pro' (Interactions Pass)
 * 
 * focuses on a truly context-aware footer that reacts to terminal 
 * input signals (mocked via keyboard event logic).
 */
export default function App() {
  const [footerMode, setFooterMode] = createSignal('passive'); 

  // Simulation of terminal key listener (Ingenious interaction)
  onMount(() => {
     const handleKey = (e: any) => {
        if (e.key === ':') setFooterMode('active');
        if (e.key === 'Escape') setFooterMode('passive');
     };
     process.stdin.on('data', (data) => {
        const str = data.toString();
        if (str === ':') setFooterMode('active');
        if (str === '\u001b') setFooterMode('passive'); // ESC
     });
  });

  const LINE_COLOR = "#334155"; 
  const BORDER_STR = "━".repeat(240);

  const VerticalDivider = () => (
    <Box width={3} flexDirection="column" alignItems="center">
       <Box flexGrow={1} width={1} bg={LINE_COLOR} />
    </Box>
  );

  return (
    <Box flexDirection="column" flexGrow={1} bg="#020617" padding={{ left: 1, right: 1 }}>
      
      {/* 1. HEADER */}
      <Box height={1} flexDirection="row">
         <Box width={30}>
            <Text fg="#2563eb" bold={true} value="▙ SOVEREIGN v1.4.2 [MAIN]" />
         </Box>
         <Box flexGrow={1} alignItems="center">
            <Text fg="#475569" value="USER: picon@Muramasa" />
         </Box>
         <Box width={30} alignItems="flex-end">
            <Text fg="#64748b" value="2026-03-28 13:18 UTC" />
         </Box>
      </Box>
      <Box height={1}><Text fg={LINE_COLOR} value={BORDER_STR} /></Box>

      {/* 2. BODY */}
      <Box flexDirection="row" flexGrow={1} padding={{ top: 1 }}>
         
         {/* EXPLORER */}
         <Box width={22} flexDirection="column">
            <Text fg="#3b82f6" bold={true} value=" ╼ FILE EXPLORER" />
            <Text fg="#475569" value=" [src/main]" />
            <Box height={1} />
            <Text fg="#64748b" value="  ▼ app/" />
            <Text fg="#fbbf24" value="    config.yaml   M" />
            <Text fg="#22c55e" value="    README.md     A" />
            <Text fg="#64748b" value="  ▶ build.log" />
         </Box>

         <VerticalDivider />

         {/* REVISION GRAPH (RESTORING ALL 6 LINES FOR 100% PARITY) */}
         <Box flexGrow={1} flexDirection="column" padding={{ left: 1, right: 1 }}>
            <Box height={1} bg="#2563eb" padding={{ left: 1 }}>
               <Text fg="#ffffff" bold={true} value="● REVISION GRAPH" />
            </Box>
            <Box height={1} />
            <Box height={1} flexDirection="row">
               <Text fg="#fbbf24" value=" ● " /><Text fg="#60a5fa" value="│ ╽ " />
               <Text fg="#e2e8f0" value="[a8c2] Refactor engine loops " />
               <Text fg="#475569" value="... 2m ago" />
            </Box>
            <Box height={1} flexDirection="row">
               <Text fg="#60a5fa" value="   │ ╿ " /><Text fg="#a855f7" value="│ " />
               <Text fg="#94a3b8" value="[b129] Update signals " />
               <Text fg="#475569" value="...... 1h ago" />
            </Box>
            <Box height={1} flexDirection="row">
               <Text fg="#60a5fa" value="   ┝━┛ " /><Text fg="#a855f7" value="│ " />
               <Text fg="#fbbf24" value="[f920] Merge branch 'stable' " />
               <Text fg="#475569" value="... 4h ago" />
            </Box>
            <Box height={1} flexDirection="row">
               <Text fg="#60a5fa" value="   │   " /><Text fg="#a855f7" value="│ " /><Text fg="#22c55e" value="╽ " />
               <Text fg="#94a3b8" value="[e107] Final layout pass " />
               <Text fg="#475569" value=".... 8h ago" />
            </Box>
            <Box height={1} flexDirection="row">
               <Text fg="#60a5fa" value="   ╽   " /><Text fg="#a855f7" value="╿ " /><Text fg="#22c55e" value="│ " />
               <Text fg="#94a3b8" value="[c41d] Initial TUI architecture" />
            </Box>
            {/* RESTORED MISSING LINE */}
            <Box height={1} flexDirection="row">
               <Text fg="#475569" value="   ╿   ┍━┛ " /><Text fg="#22c55e" value="│ " />
               <Text fg="#94a3b8" value="[d201] Add primitive types" />
            </Box>
         </Box>

         <VerticalDivider />

         {/* SYSTEM METRICS */}
         <Box width={26} flexDirection="column" padding={{ left: 1 }}>
            <Text fg="#a855f7" bold={true} value=" ╼ SYSTEM METRICS" />
            <Box height={1} />
            <Text fg="#fbbf24" value=" Builds:    4" />
            <Text fg="#22c55e" value=" Coverage:  94%" />
            <Box height={1}><Text fg={LINE_COLOR} value={"━".repeat(24)} /></Box>
            <Text fg="#94a3b8" value=" [Diff] app.ts" />
            <Text fg="#f87171" value=" - height={H}" />
            <Text fg="#22c55e" value=" + flexGrow={1}" />
         </Box>

      </Box>

      {/* 3. INGENIOUS FOOTER (State-Aware & Interaction Bound) */}
      <Box height={1}><Text fg={LINE_COLOR} value={BORDER_STR} /></Box>
      <Box height={1} flexDirection="row" padding={{ bottom: 1 }}>
         {footerMode() === 'passive' ? (
           <Box flexGrow={1} flexDirection="row">
              <Text fg="#22c55e" value=" » SYSTEM_OPTIMAL" />
              <Box flexGrow={1} />
              <Text fg="#475569" value="Muramasa > zen-tui > " />
              <Text fg="#fbbf24" value="App.tsx" />
              <Text fg="#64748b" value=" [ (:) CMD ]" />
           </Box>
         ) : (
           <Box flexGrow={1} flexDirection="row" bg="#1e293b">
              <Text fg="#fbbf24" bold={true} value=' : ' />
              <Text fg="#e2e8f0" value='commit -m "restore missing graph line" ' />
              <Text fg="#ffffff" value="█" /> 
              <Box flexGrow={1} />
              <Text fg="#94a3b8" value="[ESC to Exit]" />
           </Box>
         )}
      </Box>

    </Box>
  );
}
