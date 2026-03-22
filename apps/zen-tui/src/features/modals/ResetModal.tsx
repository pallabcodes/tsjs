/**
 * Zen-TUI — Reset Modal (Demo-Ready)
 */

import { C } from "../../app/App.js";

export default function ResetModal() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg}>
      <box flexGrow={1} bg={C.bg} />
      
      <box flexDirection="row" width="100%" bg={C.bg}>
        <box flexGrow={1} bg={C.bg} />
        
        {/* Modal */}
        <box width={60} height={14} bg={C.activeBg} flexDirection="column" padding={2} border borderColor={C.red}>
           <text bold fg={C.red}>HARD RESET</text>
           <box height={1} bg={C.activeBg} />
           <box flexDirection="row" width="100%" height={1} bg={C.activeBg}>
              <box height={1} flexGrow={1} bg={C.red} />
           </box>
           <box height={1} bg={C.activeBg} />
           
           <box flexDirection="row" bg={C.activeBg}>
              <text fg={C.text}>Reset </text>
              <text bold fg={C.green}>main </text>
              <text fg={C.text}>to commit </text>
              <text bold fg={C.yellow}>a3f7c21</text>
           </box>
           <box height={1} bg={C.activeBg} />
           <text fg={C.subtext}>All uncommitted changes will be lost.</text>
           <text fg={C.dim}>This cannot be undone.</text>
           
           <box height={2} bg={C.activeBg} />
           <box flexDirection="row" width="100%" bg={C.activeBg}>
              <box flexGrow={1} bg={C.activeBg} />
              <text fg={C.dim}>[Esc] Cancel  </text>
              <text bold fg={C.red}>[Enter] Confirm Reset</text>
           </box>
        </box>
        
        <box flexGrow={1} bg={C.bg} />
      </box>
      
      <box flexGrow={1} bg={C.bg} />
    </box>
  );
}
