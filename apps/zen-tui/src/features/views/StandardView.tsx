/**
 * Zen-TUI — Standard Views (Commercial Grade UI)
 * 
 * Provides the main dashboard layout for Git operations. Focused on rich typography
 * with subtle, dim metadata to replicate a modern web application feel.
 */

import { Show, For, memo } from "../../engine/reconciler.ts";
import { C } from "../../app/App.tsx";

// ─── MOCK DATA ───

const LOGS = [
  { hash: "7a2b9c1", msg: "feat: implemented sovereign input dispatcher", author: "picon",   time: "2m ago" },
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
  return s.substring(0, len-3) + "...";
}

export const HDivider = () => (
  <box flexDirection="row" width="100%" height={1} bg={C.border}>
     <box height={1} flexGrow={1} bg={C.border} />
  </box>
);

export const SelDot = (p: { active: boolean, color: string }) => (
  <text fg={p.active ? p.color : C.bg}>▌ </text>
);

// ─── COMMIT LOG (Tab 0) ───

function CommitLogView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      {/* Left List */}
      <box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <box height={1} width="100%" bg={C.bg} paddingX={1}>
          <text fg={C.dim}>  LOG (main)</text>
        </box>
        <HDivider />
        <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <For each={LOGS}>
            {(log: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={C.blue} />
                  <text fg={C.dim}>{log.hash} </text>
                  <text bold={active} fg={active ? C.text : C.subtext}>{fit(log.msg, 40)}</text>
                  <box flexGrow={1} bg={bg} />
                  <text fg={C.dim}>{fit(log.time, 10)}</text>
                </box>
              );
            }}
          </For>
        </box>
      </box>
      
      {/* Right Detail */}
      <box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={LOGS[props.sel]}>
          {(item: () => any) => (
            <>
              <text bold fg={C.text}>COMMIT DETAIL</text>
              <box height={1} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Hash:   </text><text fg={C.blue}>{item().hash}</text></box>
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Author: </text><text fg={C.green}>{item().author}</text></box>
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Date:   </text><text fg={C.subtext}>{item().time}</text></box>
              <box height={1} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <text bold fg={C.text}>{item().msg}</text>
              <box height={2} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <text fg={C.dim} italic>No code changes available in mock mode.</text>
            </>
          )}
        </Show>
      </box>
    </box>
  );
}

// ─── FILE STATUS (Tab 1) ───

function FileStatusView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      <box width="50%" flexDirection="column" height="100%" bg={C.bg}>
        <box height={1} width="100%" bg={C.bg} paddingX={1}>
          <text fg={C.dim}>  UNSTAGED CHANGES</text>
        </box>
        <HDivider />
        <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <For each={FILES}>
            {(file: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={file.status === 'M' ? C.yellow : C.green} />
                  <text fg={file.status === 'M' ? C.yellow : C.green}>{file.status} </text>
                  <text bold={active} fg={active ? C.text : C.subtext}>{fit(file.path, 40)}</text>
                  <box flexGrow={1} bg={bg} />
                  <text fg={C.dim}>{file.lines}</text>
                </box>
              );
            }}
          </For>
        </box>
      </box>

      <box width="50%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={FILES[props.sel]}>
          {(item: () => any) => (
            <>
              <text bold fg={C.text}>DIFF PREVIEW</text>
              <box height={1} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <text fg={C.dim}>--- a/{item().path}</text>
              <text fg={C.dim}>+++ b/{item().path}</text>
              <box height={1} bg={C.bg} />
              <text fg={C.green}>+ // Sovereign displacement logic</text>
              <text fg={C.green}>+ export function dispatch(e: Event) {'{'}</text>
              <text fg={C.green}>+   console.log("REACTIVE DISPATCH", e);</text>
              <text fg={C.green}>+ {'}'}</text>
              <text fg={C.red}>- console.log("STATIC INPUT");</text>
              <box height={2} bg={C.bg} />
              <text fg={C.dim} italic>... more changes ...</text>
            </>
          )}
        </Show>
      </box>
    </box>
  );
}

// ─── BRANCHES (Tab 2) ───

function BranchesView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      <box width="50%" flexDirection="column" height="100%" bg={C.bg}>
        <box height={1} width="100%" bg={C.bg} paddingX={1}>
          <text fg={C.dim}>  BRANCHES</text>
        </box>
        <HDivider />
        <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <For each={BRANCHES}>
            {(b: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={C.green} />
                  <text bold={b.active} fg={b.active ? C.green : active ? C.text : C.subtext}>{fit(b.name, 30)}</text>
                  <box flexGrow={1} bg={bg} />
                  <text fg={C.dim}>{b.commit}</text>
                </box>
              );
            }}
          </For>
        </box>
      </box>

      <box width="50%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={BRANCHES[props.sel]}>
          {(item: () => any) => (
            <>
              <text bold fg={C.text}>BRANCH INFO</text>
              <box height={1} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Name:   </text><text fg={C.green}>{item().name}</text></box>
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Remote: </text><text fg={C.subtext}>{item().remote || "local only"}</text></box>
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Commit: </text><text fg={C.blue}>{item().commit}</text></box>
              <box height={1} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <text fg={C.text}>The branch is currently </text>
              <text bold fg={C.green}>up to date</text>
              <text fg={C.text}> with its remote upstream.</text>
              <box height={2} bg={C.bg} />
              <text fg={C.dim}>[m]</text><text fg={C.text}> merge  </text><text fg={C.dim}>[r]</text><text fg={C.text}> rebase  </text><text fg={C.dim}>[d]</text><text fg={C.text}> delete</text>
            </>
          )}
        </Show>
      </box>
    </box>
  );
}

// ─── STASHES (Tab 3) ───

function StashView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>
      <box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <box height={1} width="100%" bg={C.bg} paddingX={1}>
          <text fg={C.dim}>  STASH ARCHIVE</text>
        </box>
        <HDivider />
        <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <For each={STASHES}>
            {(s: any, i: any) => {
              const active = props.sel === i();
              const bg = active ? C.activeBg : C.bg;
              return (
                <box flexDirection="row" width="100%" height={1} bg={bg} paddingRight={2}>
                  <SelDot active={active} color={C.cyan} />
                  <text fg={C.dim}>{"stash@{"}</text><text fg={C.cyan}>{s.id}</text><text fg={C.dim}>{"} "}</text>
                  <text bold={active} fg={active ? C.text : C.subtext}>{fit(s.msg, 40)}</text>
                  <box flexGrow={1} bg={bg} />
                  <text fg={C.dim}>{fit(s.time, 10)}</text>
                </box>
              );
            }}
          </For>
        </box>
      </box>

      <box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <Show when={STASHES[props.sel]}>
          {(item: () => any) => (
            <>
              <text bold fg={C.text}>STASH DETAIL</text>
              <box height={1} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Ref:    </text><text fg={C.cyan}>stash@{item().id}</text></box>
              <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Date:   </text><text fg={C.subtext}>{item().time}</text></box>
              <box height={1} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <text bold fg={C.text}>{item().msg}</text>
              <box height={2} bg={C.bg} />
              <HDivider />
              <box height={1} bg={C.bg} />
              <text fg={C.dim}>[p]</text><text fg={C.text}> pop  </text><text fg={C.dim}>[a]</text><text fg={C.text}> apply  </text><text fg={C.dim}>[d]</text><text fg={C.text}> drop</text>
            </>
          )}
        </Show>
      </box>
    </box>
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
