/**
 * Zen-TUI — Workflow Overlays (Commercial Grade UI)
 * 
 * Provides secondary modal layers for complex Git operations (Commit, Rebase, etc.)
 */

import { Show, For, memo } from "../../engine/reconciler.ts";
import { C } from "../../app/App.tsx";
import { HDivider, SelDot, fit } from "../views/StandardView.tsx";

// ─── WORKFLOW COMPONENTS ───

function CommitView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.blue}>COMMIT CHANGES</text>
      <HDivider />
      <box height={1} />
      <text fg={C.text}>Message:</text>
      <box height={3} width="100%" bg={C.activeBg} paddingX={1}>
        <text fg={C.text}>feat: implemented sovereign reactivity engine</text>
      </box>
      <box height={1} />
      <text fg={C.dim}>[Ctrl+Enter] to commit  [Esc] to cancel</text>
    </box>
  );
}

function RebaseView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.orange}>INTERACTIVE REBASE</text>
      <HDivider />
      <box height={1} />
      <For each={[
        { op: "pick", hash: "a3f7c21", msg: "feat: add sovereign layout" },
        { op: "edit", hash: "8d4e1b9", msg: "fix: viewport fill bleed" },
        { op: "pick", hash: "c92fa03", msg: "refactor: StandardView" },
      ]}>
        {(item: any) => (
          <box flexDirection="row" width="100%" height={1}>
            <text fg={C.blue}>{item.op} </text>
            <text fg={C.yellow}>{item.hash} </text>
            <text fg={C.text}>{item.msg}</text>
          </box>
        )}
      </For>
    </box>
  );
}

function CherryPickView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.cyan}>CHERRY PICK</text>
      <HDivider />
      <box height={1} />
      <text fg={C.text}>Pick commit </text><text fg={C.yellow}>f3e1d0a</text><text fg={C.text}> onto main?</text>
      <box height={1} />
      <text fg={C.dim}>[Enter] confirm  [Esc] cancel</text>
    </box>
  );
}

function MergeView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.green}>MERGE BRANCH</text>
      <HDivider />
      <box height={1} />
      <text fg={C.text}>Merge </text><text fg={C.blue}>feat/reactivity</text><text fg={C.text}> into </text><text fg={C.green}>main</text>
      <box height={1} />
      <text fg={C.dim}>[Enter] confirm  [Esc] cancel</text>
    </box>
  );
}

function ResetView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.red}>GIT RESET</text>
      <HDivider />
      <box height={1} />
      <text fg={C.text}>Reset current branch to </text><text fg={C.yellow}>HEAD~1</text>
      <box height={1} />
      <box flexDirection="row">
        <text fg={C.dim}>[1] </text><text fg={C.green}>Soft  </text>
        <text fg={C.dim}>[2] </text><text fg={C.yellow}>Mixed  </text>
        <text fg={C.dim}>[3] </text><text fg={C.red}>Hard</text>
      </box>
    </box>
  );
}

function AmendView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.yellow}>AMEND COMMIT</text>
      <HDivider />
      <box height={1} />
      <text fg={C.text}>Amending </text><text fg={C.blue}>7a2b9c1</text>
      <box height={1} />
      <text fg={C.dim}>Update message and stage changes...</text>
    </box>
  );
}

function SubmoduleView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.blue}>SUBMODULES</text>
      <HDivider />
      <box height={1} />
      <text fg={C.text}>lib/engine: </text><text fg={C.green}>Up to date</text>
      <text fg={C.text}>lib/layout: </text><text fg={C.yellow}>Update available (+4 commits)</text>
    </box>
  );
}

function StashView() {
  return (
    <box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <text bold fg={C.cyan}>STASH OPERATONS</text>
      <HDivider />
      <box height={1} />
      <text fg={C.text}>Save current changes to stash?</text>
      <box height={1} />
      <text fg={C.dim}>[s] save  [p] pop latest  [l] list</text>
    </box>
  );
}

// ─── ROUTER ───

export default function WorkflowOverlay(props: { mode: () => any }) {
  return (
    <>
      {memo(() => {
        const m = props.mode();
        
        if (m === "commit") return <CommitView />;
        if (m === "rebase") return <RebaseView />;
        if (m === "cherry") return <CherryPickView />;
        if (m === "merge")  return <MergeView />;
        if (m === "reset")  return <ResetView />;
        if (m === "amend")  return <AmendView />;
        if (m === "submod") return <SubmoduleView />;
        if (m === "stash")  return <StashView />;
        
        return null;
      })()}
    </>
  );
}
