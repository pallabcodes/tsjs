/** @jsx h */
import { 
  Box, 
  Text, 
  h, 
  W, H 
} from '@zen-tui/solid';

/**
 * Sovereign TUI: 'Mono Edition' (Zero-Constraint Fail-safe)
 * 
 * This version discards all Panels and complex Box layouts to ensure
 * 100% visibility in any terminal. It uses raw Text for absolute stability.
 */
export default function App() {
  return (
    <Box flexDirection="column" flexGrow={1} bg="#020617" padding={1}>
      
      {/* 1. HEADER */}
      <Text fg="#2563eb" bold={true} value=" ▟ Sovereign TUI" />
      <Text fg="#475569" value=" ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" />
      
      <Box height={1} />

      {/* 2. BODY (The 3-Section Logic, Simplified) */}
      <Box flexDirection="row" height={15}>
         {/* EXPLORER */}
         <Box width={20} flexDirection="column">
            <Text fg="#94a3b8" bold={true} value="[ EXPLORER ]" />
            <Text fg="#64748b" value=" > src" />
            <Text fg="#3b82f6" value="   app.ts" />
            <Text fg="#64748b" value=" > test" />
         </Box>

         <Box width={2} />

         {/* GRAPH */}
         <Box flexGrow={1} flexDirection="column">
            <Text fg="#fbbf24" bold={true} value="[ REVISION GRAPH ]" />
            <Text fg="#60a5fa" value=" ● │ ╽ [a8c2] Refactor engine" />
            <Text fg="#a855f7" value="   │ ╿ [b129] Update signals" />
            <Text fg="#f87171" value="   ┝━┛ [f920] Merge branch" />
         </Box>

         <Box width={2} />

         {/* INSPECTOR */}
         <Box width={25} flexDirection="column">
            <Text fg="#94a3b8" bold={true} value="[ DETAILS ]" />
            <Text fg="#fbbf24" value=" hash: e10703" />
            <Text fg="#f87171" value=" - height={H}" />
            <Text fg="#22c55e" value=" + flexGrow={1}" />
         </Box>
      </Box>

      <Box height={1} />
      <Text fg="#475569" value=" ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" />
      <Text fg="#22c55e" value=" » STATUS: SYSTEM_OPTIMAL // KEYNOTE_READY" />

    </Box>
  );
}
