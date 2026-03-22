/**
 * Zen-TUI — Workflow Overlays (Commercial Grade UI)
 * 
 * Provides secondary modal layers for complex Git operations (Commit, Rebase, etc.)
 */

import { Show, For, memo, Zen } from "@zen-tui/solid";
import { C } from "../../app/App.tsx";
import { HDivider, SelDot, fit } from "../views/StandardView.tsx";

// ─── WORKFLOW COMPONENTS ───

function CommitView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.blue}>COMMIT CHANGES</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.Text fg={C.text}>Message:</Zen.Text>
      <Zen.Box height={3} width="100%" bg={C.activeBg} paddingX={1}>
        <Zen.Text fg={C.text}>feat: implemented sovereign reactivity engine</Zen.Text>
      </Zen.Box>
      <Zen.Box height={1} />
      <Zen.Text fg={C.dim}>[Ctrl+Enter] to commit  [Esc] to cancel</Zen.Text>
    </Zen.Box>
  );
}

function RebaseView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.orange}>INTERACTIVE REBASE</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.For each={[
        { op: "pick", hash: "a3f7c21", msg: "feat: add sovereign layout" },
        { op: "edit", hash: "8d4e1b9", msg: "fix: viewport fill bleed" },
        { op: "pick", hash: "c92fa03", msg: "refactor: StandardView" },
      ]}>
        {(item: any) => (
          <Zen.Box flexDirection="row" width="100%" height={1}>
            <Zen.Text fg={C.blue}>{item.op} </Zen.Text>
            <Zen.Text fg={C.yellow}>{item.hash} </Zen.Text>
            <Zen.Text fg={C.text}>{item.msg}</Zen.Text>
          </Zen.Box>
        )}
      </Zen.For>
    </Zen.Box>
  );
}

function CherryPickView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.cyan}>CHERRY PICK</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.Text fg={C.text}>Pick commit </Zen.Text><Zen.Text fg={C.yellow}>f3e1d0a</Zen.Text><Zen.Text fg={C.text}> onto main?</Zen.Text>
      <Zen.Box height={1} />
      <Zen.Text fg={C.dim}>[Enter] confirm  [Esc] cancel</Zen.Text>
    </Zen.Box>
  );
}

function MergeView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.green}>MERGE BRANCH</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.Text fg={C.text}>Merge </Zen.Text><Zen.Text fg={C.blue}>feat/reactivity</Zen.Text><Zen.Text fg={C.text}> into </Zen.Text><Zen.Text fg={C.green}>main</Zen.Text>
      <Zen.Box height={1} />
      <Zen.Text fg={C.dim}>[Enter] confirm  [Esc] cancel</Zen.Text>
    </Zen.Box>
  );
}

function ResetView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.red}>GIT RESET</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.Text fg={C.text}>Reset current branch to </Zen.Text><Zen.Text fg={C.yellow}>HEAD~1</Zen.Text>
      <Zen.Box height={1} />
      <Zen.Box flexDirection="row">
        <Zen.Text fg={C.dim}>[1] </Zen.Text><Zen.Text fg={C.green}>Soft  </Zen.Text>
        <Zen.Text fg={C.dim}>[2] </Zen.Text><Zen.Text fg={C.yellow}>Mixed  </Zen.Text>
        <Zen.Text fg={C.dim}>[3] </Zen.Text><Zen.Text fg={C.red}>Hard</Zen.Text>
      </Zen.Box>
    </Zen.Box>
  );
}

function AmendView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.yellow}>AMEND COMMIT</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.Text fg={C.text}>Amending </Zen.Text><Zen.Text fg={C.blue}>7a2b9c1</Zen.Text>
      <Zen.Box height={1} />
      <Zen.Text fg={C.dim}>Update message and stage changes...</Zen.Text>
    </Zen.Box>
  );
}

function SubmoduleView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.blue}>SUBMODULES</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.Text fg={C.text}>lib/engine: </Zen.Text><Zen.Text fg={C.green}>Up to date</Zen.Text>
      <Zen.Text fg={C.text}>lib/layout: </Zen.Text><Zen.Text fg={C.yellow}>Update available (+4 commits)</Zen.Text>
    </Zen.Box>
  );
}

function StashView() {
  return (
    <Zen.Box flexDirection="column" width="100%" height="100%" bg={C.bg} padding={1}>
      <Zen.Text bold fg={C.cyan}>STASH OPERATONS</Zen.Text>
      <HDivider />
      <Zen.Box height={1} />
      <Zen.Text fg={C.text}>Save current changes to stash?</Zen.Text>
      <Zen.Box height={1} />
      <Zen.Text fg={C.dim}>[s] save  [p] pop latest  [l] list</Zen.Text>
    </Zen.Box>
  );
}

// ─── ROUTER ───

export default function WorkflowOverlay(props: { mode: () => any }) {
  return (
    <Zen.Router initialPath={props.mode() || "/"}>
      <Zen.Route path="commit"><CommitView /></Zen.Route>
      <Zen.Route path="rebase"><RebaseView /></Zen.Route>
      <Zen.Route path="cherry"><CherryPickView /></Zen.Route>
      <Zen.Route path="merge"><MergeView /></Zen.Route>
      <Zen.Route path="reset"><ResetView /></Zen.Route>
      <Zen.Route path="amend"><AmendView /></Zen.Route>
      <Zen.Route path="submod"><SubmoduleView /></Zen.Route>
      <Zen.Route path="stash"><StashView /></Zen.Route>
    </Zen.Router>
  );
}
