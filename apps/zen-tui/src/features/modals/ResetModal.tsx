/**
 * Zen-TUI — Reset Modal (Demo-Ready)
 * 
 *  My feedback: same fixes / improvement should apply here as WorkflowOverlay.concept.tsx
 */

import { C } from "../../app/App.js";

export default function ResetModal() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg}>
      <Zen.Box flexGrow={1} bg={C.bg} />

      <Zen.Box flexDirection="row" width="100%" bg={C.bg}>
        <Zen.Box flexGrow={1} bg={C.bg} />

        {/* Modal */}
        <Zen.Box width={60} height={14} bg={C.activeBg} flexDirection="column" padding={2} border borderColor={C.red}>
          <Zen.Text bold fg={C.red}>HARD RESET</Zen.Text>
          <Zen.Box height={1} bg={C.activeBg} />
          <Zen.Box flexDirection="row" width="100%" height={1} bg={C.activeBg}>
            <Zen.Box height={1} flexGrow={1} bg={C.red} />
          </Zen.Box>
          <Zen.Box height={1} bg={C.activeBg} />

          <Zen.Box flexDirection="row" bg={C.activeBg}>
            <Zen.Text fg={C.text}>Reset </Zen.Text>
            <Zen.Text bold fg={C.green}>main </Zen.Text>
            <Zen.Text fg={C.text}>to commit </Zen.Text>
            <Zen.Text bold fg={C.yellow}>a3f7c21</Zen.Text>
          </Zen.Box>
          <Zen.Box height={1} bg={C.activeBg} />
          <Zen.Text fg={C.subtext}>All uncommitted changes will be lost.</Zen.Text>
          <Zen.Text fg={C.dim}>This cannot be undone.</Zen.Text>

          <Zen.Box height={2} bg={C.activeBg} />
          <Zen.Box flexDirection="row" width="100%" bg={C.activeBg}>
            <Zen.Box flexGrow={1} bg={C.activeBg} />
            <Zen.Text fg={C.dim}>[Esc] Cancel  </Zen.Text>
            <Zen.Text bold fg={C.red}>[Enter] Confirm Reset</Zen.Text>
          </Zen.Box>
        </Zen.Box>

        <Zen.Box flexGrow={1} bg={C.bg} />
      </Zen.Box>

      <Zen.Box flexGrow={1} bg={C.bg} />
    </Zen.Box>
  );
}
