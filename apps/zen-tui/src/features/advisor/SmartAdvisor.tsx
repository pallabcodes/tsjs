/**
 * Zen-TUI: Smart Advisor (AI-Native Pane)
 * 
 * Winning edge over GitKraken/OpenTUI.
 */

export default function SmartAdvisor() {
  return (
    <box flexDirection="column" padding={1} bg="#0D1117">
      <box border="bottom" borderColor="#238636" height={1}>
        <text bold fg="#238636"> ✧ SMART ADVISOR </text>
      </box>
      <box flexDirection="column" padding={1} gap={1}>
        <text fg="#D29922">! CONFLICT RISK</text>
        <text fg="#B0BEC5"> `renderer.ts` has diverted from origin/main. </text>
        
        <text fg="#238636">✔ SUGGESTION</text>
        <text fg="#B0BEC5"> Rebase onto `main` to resolve cleanly. </text>
      </box>
      <box flexGrow={1} />
      <box>
         <text fg="#546E7A" italic> [Alt+A] Apply Suggestion </text>
      </box>
    </box>
  );
}
