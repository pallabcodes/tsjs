import { Zen } from '@zen-tui/solid';
/**
 * Zen-TUI — Standard Views (Commercial Grade UI)
 * 
 * Provides the main dashboard layout for Git operations. Focused on rich typography
 * with subtle, dim metadata to replicate a modern web application feel.
 * 
 * My feedback: same fixes / improvement should apply here as WorkflowOverlay.concept.tsx
 */

import { Show, For, memo } from "@zen-tui/solid";
import { C } from "../../app/App.tsx";

// ─── MOCK DATA ───

const LOGS = [
  { hash: "7a2b9c1", msg: "feat: implemented sovereign input dispatcher", author: "picon", time: "2m ago" },
  { hash: "f3e1d0a", msg: "fix: reactivity engine stabilization", author: "picon", time: "15m ago" },
  { hash: "b5c7d8e", msg: "refactor: unified reconciler SPI", author: "picon", time: "1h ago" },
  { hash: "a1b2c3d", msg: "chore: initial bootstrap", author: "picon", time: "1d ago" },
  { hash: "e5f6g7h", msg: "feat: added taffy layout support", author: "picon", time: "2d ago" },
  { hash: "i8j9k0l", msg: "fix: bundle size optimization", author: "picon", time: "3d ago" },
  { hash: "m1n2o3p", msg: "docs: updated architecture guide", author: "picon", time: "4d ago" },
  { hash: "q4r5s6t", msg: "test: added e2e integration tests", author: "picon", time: "5d ago" },
  { hash: "u7v8w9x", msg: "feat: experimental web-tui bridge", author: "picon", time: "1w ago" },
];

const FILES = [
  { status: "M", path: "apps/zen-tui/src/app/App.tsx", lines: "+12 -4" },
  { status: "A", path: "apps/zen-tui/src/engine/input.ts", lines: "+85" },
  { status: "D", path: "apps/zen-tui/src/old/reconciler.js", lines: "-210" },
  { status: "M", path: "package.json", lines: "+2 -2" },
];

const BRANCHES = [
  { name: "main", active: true, remote: "origin/main", commit: "7a2b9c1" },
  { name: "feat/reactivity", active: false, remote: "origin/feat/reactivity", commit: "f3e1d0a" },
  { name: "fix/input-race", active: false, remote: null, commit: "9c8d7e6" },
  { name: "refactor/engine", active: false, remote: "origin/refactor/engine", commit: "b5c7d8e" },
  { name: "dev", active: false, remote: "origin/dev", commit: "a1b2c3d" },
];

const STASHES = [
  { id: 0, msg: "WIP on main: fix: typing race condition", time: "1h ago" },
  { id: 1, msg: "temp: before rebase", time: "3h ago" },
  { id: 2, msg: "stash: experimental layout", time: "1d ago" },
];

// ─── SHARED ───

export function fit(s: string, len: number): string {
  if (s.length <= len) return s;
  return s.substring(0, len - 3) + "...";
}

export const HDivider = () => (
  <Zen.Box flexDirection="row" width="100%" height={1} bg={C.border}>
    <Zen.Box height={1} flexGrow={1} bg={C.border} />
  </Zen.Box>
);

export const SelDot = (p: { active: boolean, color: string }) => (
  <Zen.Text fg={p.active ? p.color : C.bg}>▌ </Zen.Text>
);

// ─── COMMIT LOG (Tab 0) ───

function CommitLogView(props: { sel: number }) {
  return (
    <Zen.Box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      {/* Left List */}
      <Zen.Box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <Zen.Box height={1} width="100%" bg={C.bg} paddingX={1}>
          <Zen.Text fg={C.dim}>  LOG (main)</Zen.Text>
        </Zen.Box>
        <HDivider />
        <Zen.Box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <Zen.For each={LOGS}>
            {(log: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <Zen.Box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={C.blue} />
                  <Zen.Text fg={C.dim}>{log.hash} </Zen.Text>
                  <Zen.Text bold={active} fg={active ? C.text : C.subtext}>{fit(log.msg, 40)}</Zen.Text>
                  <Zen.Box flexGrow={1} bg={bg} />
                  <Zen.Text fg={C.dim}>{fit(log.time, 10)}</Zen.Text>
                </Zen.Box>
              );
            }}
          </Zen.For>
        </Zen.Box>
      </Zen.Box>

      {/* Right Detail */}
      <Zen.Box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={LOGS[props.sel]}>
          {(item: () => any) => (
            <>
              <Zen.Text bold fg={C.text}>COMMIT DETAIL</Zen.Text>
              <Zen.Box height={1} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Hash:   </Zen.Text><Zen.Text fg={C.blue}>{item().hash}</Zen.Text></Zen.Box>
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Author: </Zen.Text><Zen.Text fg={C.green}>{item().author}</Zen.Text></Zen.Box>
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Date:   </Zen.Text><Zen.Text fg={C.subtext}>{item().time}</Zen.Text></Zen.Box>
              <Zen.Box height={1} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Text bold fg={C.text}>{item().msg}</Zen.Text>
              <Zen.Box height={2} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Text fg={C.dim} italic>No code changes available in mock mode.</Zen.Text>
            </>
          )}
        </Show>
      </Zen.Box>
    </Zen.Box>
  );
}

// ─── FILE STATUS (Tab 1) ───

function FileStatusView(props: { sel: number }) {
  return (
    <Zen.Box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      <Zen.Box width="50%" flexDirection="column" height="100%" bg={C.bg}>
        <Zen.Box height={1} width="100%" bg={C.bg} paddingX={1}>
          <Zen.Text fg={C.dim}>  UNSTAGED CHANGES</Zen.Text>
        </Zen.Box>
        <HDivider />
        <Zen.Box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <Zen.For each={FILES}>
            {(file: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <Zen.Box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={file.status === 'M' ? C.yellow : C.green} />
                  <Zen.Text fg={file.status === 'M' ? C.yellow : C.green}>{file.status} </Zen.Text>
                  <Zen.Text bold={active} fg={active ? C.text : C.subtext}>{fit(file.path, 40)}</Zen.Text>
                  <Zen.Box flexGrow={1} bg={bg} />
                  <Zen.Text fg={C.dim}>{file.lines}</Zen.Text>
                </Zen.Box>
              );
            }}
          </Zen.For>
        </Zen.Box>
      </Zen.Box>

      <Zen.Box width="50%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={FILES[props.sel]}>
          {(item: () => any) => (
            <>
              <Zen.Text bold fg={C.text}>DIFF PREVIEW</Zen.Text>
              <Zen.Box height={1} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Text fg={C.dim}>--- a/{item().path}</Zen.Text>
              <Zen.Text fg={C.dim}>+++ b/{item().path}</Zen.Text>
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Text fg={C.green}>+ // Sovereign displacement logic</Zen.Text>
              <Zen.Text fg={C.green}>+ export function dispatch(e: Event) {'{'}</Zen.Text>
              <Zen.Text fg={C.green}>+   console.log("REACTIVE DISPATCH", e);</Zen.Text>
              <Zen.Text fg={C.green}>+ {'}'}</Zen.Text>
              <Zen.Text fg={C.red}>- console.log("STATIC INPUT");</Zen.Text>
              <Zen.Box height={2} bg={C.bg} />
              <Zen.Text fg={C.dim} italic>... more changes ...</Zen.Text>
            </>
          )}
        </Show>
      </Zen.Box>
    </Zen.Box>
  );
}

// ─── BRANCHES (Tab 2) ───

function BranchesView(props: { sel: number }) {
  return (
    <Zen.Box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      <Zen.Box width="50%" flexDirection="column" height="100%" bg={C.bg}>
        <Zen.Box height={1} width="100%" bg={C.bg} paddingX={1}>
          <Zen.Text fg={C.dim}>  BRANCHES</Zen.Text>
        </Zen.Box>
        <HDivider />
        <Zen.Box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <Zen.For each={BRANCHES}>
            {(b: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <Zen.Box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={C.green} />
                  <Zen.Text bold={b.active} fg={b.active ? C.green : active ? C.text : C.subtext}>{fit(b.name, 30)}</Zen.Text>
                  <Zen.Box flexGrow={1} bg={bg} />
                  <Zen.Text fg={C.dim}>{b.commit}</Zen.Text>
                </Zen.Box>
              );
            }}
          </Zen.For>
        </Zen.Box>
      </Zen.Box>

      <Zen.Box width="50%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={BRANCHES[props.sel]}>
          {(item: () => any) => (
            <>
              <Zen.Text bold fg={C.text}>BRANCH INFO</Zen.Text>
              <Zen.Box height={1} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Name:   </Zen.Text><Zen.Text fg={C.green}>{item().name}</Zen.Text></Zen.Box>
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Remote: </Zen.Text><Zen.Text fg={C.subtext}>{item().remote || "local only"}</Zen.Text></Zen.Box>
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Commit: </Zen.Text><Zen.Text fg={C.blue}>{item().commit}</Zen.Text></Zen.Box>
              <Zen.Box height={1} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Text fg={C.text}>The branch is currently </Zen.Text>
              <Zen.Text bold fg={C.green}>up to date</Zen.Text>
              <Zen.Text fg={C.text}> with its remote upstream.</Zen.Text>
              <Zen.Box height={2} bg={C.bg} />
              <Zen.Text fg={C.dim}>[m]</Zen.Text><Zen.Text fg={C.text}> merge  </Zen.Text><Zen.Text fg={C.dim}>[r]</Zen.Text><Zen.Text fg={C.text}> rebase  </Zen.Text><Zen.Text fg={C.dim}>[d]</Zen.Text><Zen.Text fg={C.text}> delete</Zen.Text>
            </>
          )}
        </Show>
      </Zen.Box>
    </Zen.Box>
  );
}

// ─── STASHES (Tab 3) ───

function StashView(props: { sel: number }) {
  return (
    <Zen.Box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      <Zen.Box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <Zen.Box height={1} width="100%" bg={C.bg} paddingX={1}>
          <Zen.Text fg={C.dim}>  STASH ARCHIVE</Zen.Text>
        </Zen.Box>
        <HDivider />
        <Zen.Box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <Zen.For each={STASHES}>
            {(s: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <Zen.Box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={C.cyan} />
                  <Zen.Text fg={C.dim}>{"stash@{"}</Zen.Text><Zen.Text fg={C.cyan}>{s.id}</Zen.Text><Zen.Text fg={C.dim}>{"} "}</Zen.Text>
                  <Zen.Text bold={active} fg={active ? C.text : C.subtext}>{fit(s.msg, 40)}</Zen.Text>
                  <Zen.Box flexGrow={1} bg={bg} />
                  <Zen.Text fg={C.dim}>{fit(s.time, 10)}</Zen.Text>
                </Zen.Box>
              );
            }}
          </Zen.For>
        </Zen.Box>
      </Zen.Box>

      <Zen.Box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={STASHES[props.sel]}>
          {(item: () => any) => (
            <>
              <Zen.Text bold fg={C.text}>STASH DETAIL</Zen.Text>
              <Zen.Box height={1} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Ref:    </Zen.Text><Zen.Text fg={C.cyan}>stash@{item().id}</Zen.Text></Zen.Box>
              <Zen.Box flexDirection="row" bg={C.bg}><Zen.Text fg={C.dim}>Date:   </Zen.Text><Zen.Text fg={C.subtext}>{item().time}</Zen.Text></Zen.Box>
              <Zen.Box height={1} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Text bold fg={C.text}>{item().msg}</Zen.Text>
              <Zen.Box height={2} bg={C.bg} />
              <HDivider />
              <Zen.Box height={1} bg={C.bg} />
              <Zen.Text fg={C.dim}>[p]</Zen.Text><Zen.Text fg={C.text}> pop  </Zen.Text><Zen.Text fg={C.dim}>[a]</Zen.Text><Zen.Text fg={C.text}> apply  </Zen.Text><Zen.Text fg={C.dim}>[d]</Zen.Text><Zen.Text fg={C.text}> drop</Zen.Text>
            </>
          )}
        </Show>
      </Zen.Box>
    </Zen.Box>
  );
}

// ─── EXPORT ───

export default function StandardView(props: { tab: () => number; sel: () => number }) {
  return (
    <>
      {memo(() => {
        const t = props.tab();
        const s = props.sel();

        if (t === 0) return <CommitLogView sel={s} />;
        if (t === 1) return <FileStatusView sel={s} />;
        if (t === 2) return <BranchesView sel={s} />;
        if (t === 3) return <StashView sel={s} />;
        return null;
      })()}
    </>
  );
}
