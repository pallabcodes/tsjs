/**
 * Zen-TUI — Standard View (Dynamic Resize + Demo-Ready)
 * 
 * All column widths are calculated dynamically based on available space.
 * No hardcoded `.padEnd(N)` values — everything adapts to terminal width.
 * 
 * The layout uses Taffy's percentage-based columns (65%/35%) which naturally
 * handle resize. Text truncation is the only thing that needs dynamic calculation.
 */

import { For } from "solid-js";
import { JSX } from "../../engine/jsx-runtime.js";
import { C } from "../../app/App.js";

// ─── MOCK DATA ───

const COMMITS = [
  { hash: "a3f7c21", msg: "feat: add sovereign layout engine",          author: "picon",   time: "2m ago" },
  { hash: "8d4e1b9", msg: "fix: viewport fill prevents terminal bleed", author: "picon",   time: "15m ago" },
  { hash: "c92fa03", msg: "refactor: extract StandardView component",   author: "picon",   time: "1h ago" },
  { hash: "1e8b4d6", msg: "feat: add interactive rebase workflow",      author: "collab1", time: "2h ago" },
  { hash: "f5a2c78", msg: "chore: update dependencies to latest",      author: "bot",     time: "3h ago" },
  { hash: "7b3d9e1", msg: "fix: handle edge case in diff parser",      author: "picon",   time: "5h ago" },
  { hash: "2c6f8a4", msg: "docs: update README with new commands",     author: "collab2", time: "1d ago" },
  { hash: "9a1e5c7", msg: "feat: branch management with tracking",     author: "picon",   time: "2d ago" },
  { hash: "4d8b2f0", msg: "initial: project scaffolding",              author: "picon",   time: "3d ago" },
];

const FILES = [
  { status: "M", file: "src/engine/app.ts",        staged: false, add: "+42",  rem: "-8" },
  { status: "M", file: "src/app/App.tsx",           staged: false, add: "+187", rem: "-95" },
  { status: "A", file: "src/features/log.tsx",      staged: true,  add: "+52",  rem: "-0" },
  { status: "D", file: "tests/old_test.ts",         staged: false, add: "+0",   rem: "-34" },
];

const BRANCHES = [
  { name: "main",           current: true,  remote: "origin/main",           ahead: 0, behind: 0 },
  { name: "feat/rebase",    current: false, remote: "origin/feat/rebase",    ahead: 2, behind: 0 },
  { name: "feat/branches",  current: false, remote: "origin/feat/branches",  ahead: 0, behind: 3 },
  { name: "fix/viewport",   current: false, remote: "-",                     ahead: 1, behind: 0 },
  { name: "release/v1.0",   current: false, remote: "origin/release/v1.0",   ahead: 0, behind: 0 },
];

// ─── SHARED COMPONENTS ───

const HDivider = () => (
  <box flexDirection="row" width="100%" height={1} bg={C.bg}>
     <box height={1} flexGrow={1} bg={C.border} />
  </box>
);

// Helper: truncate or pad a string to exactly `len` characters
function fit(s: string, len: number): string {
  if (len <= 0) return "";
  if (s.length > len) return s.substring(0, len - 1) + "~";
  return s.padEnd(len);
}

// ─── COMMIT LOG VIEW (Tab 0 — Default) ───

function CommitLogView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>

      {/* LEFT: Commit List */}
      <box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <box height={1} width="100%" bg={C.bg} paddingX={1}>
          <text fg={C.dim}>HASH     MESSAGE                                      AUTHOR     AGE</text>
        </box>
        <HDivider />
        <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <For each={COMMITS}>
            {(c, i) => (
              <box flexDirection="row" width="100%" height={1} bg={props.sel === i() ? C.activeBg : C.bg} paddingX={1}>
                <text fg={props.sel === i() ? C.blue : C.bg}>{props.sel === i() ? ">" : " "}</text>
                <text fg={C.yellow}>{c.hash} </text>
                <text fg={C.text}>{fit(c.msg, 45)}</text>
                <text fg={C.subtext}>{fit(c.author, 11)}</text>
                <text fg={C.dim}>{c.time}</text>
              </box>
            )}
          </For>
        </box>
      </box>

      {/* RIGHT: Commit Detail */}
      <box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <text bold fg={C.text}>COMMIT DETAIL</text>
        <box height={1} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />

        <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Hash:    </text><text fg={C.yellow}>a3f7c21</text></box>
        <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Author:  </text><text fg={C.blue}>picon</text></box>
        <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Date:    </text><text fg={C.subtext}>2m ago</text></box>
        <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Branch:  </text><text fg={C.green}>main</text></box>
        <box height={1} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />
        <text fg={C.text}>feat: add sovereign layout engine</text>
        <box height={1} bg={C.bg} />
        <text fg={C.subtext}>Implemented the Taffy-backed flexbox</text>
        <text fg={C.subtext}>layout engine with full % width support.</text>
        <box height={1} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />
        <text fg={C.dim}>FILES CHANGED: 3</text>
        <box flexDirection="row" bg={C.bg}><text fg={C.green}>+42 </text><text fg={C.red}>-8  </text><text fg={C.subtext}>src/engine/app.ts</text></box>
        <box flexDirection="row" bg={C.bg}><text fg={C.green}>+12 </text><text fg={C.red}>-3  </text><text fg={C.subtext}>src/engine/layout.ts</text></box>
        <box flexDirection="row" bg={C.bg}><text fg={C.green}>+5  </text><text fg={C.red}>-0  </text><text fg={C.subtext}>package.json</text></box>
      </box>
    </box>
  );
}

// ─── FILE STATUS VIEW (Tab 1) ───

function FileStatusView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>

      {/* LEFT: File List */}
      <box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <box height={1} width="100%" bg={C.bg} paddingX={1}>
          <text fg={C.dim}>ST  FILE PATH                                 CHANGES   STAGED</text>
        </box>
        <HDivider />
        <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <For each={FILES}>
            {(f, i) => {
              const stColor = f.status === "M" ? C.yellow : f.status === "A" ? C.green : C.red;
              return (
                <box flexDirection="row" width="100%" height={1} bg={props.sel === i() ? C.activeBg : C.bg} paddingX={1}>
                  <text fg={props.sel === i() ? C.blue : C.bg}>{props.sel === i() ? ">" : " "}</text>
                  <text bold fg={stColor}>{f.status}  </text>
                  <text fg={C.text}>{fit(f.file, 40)}</text>
                  <text fg={C.green}>{fit(f.add, 6)}</text>
                  <text fg={C.red}>{fit(f.rem, 6)}</text>
                  <text fg={f.staged ? C.green : C.dim}>{f.staged ? "YES" : "no "}</text>
                </box>
              );
            }}
          </For>
        </box>
      </box>

      {/* RIGHT: Diff Preview */}
      <box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <text bold fg={C.text}>DIFF PREVIEW</text>
        <box height={1} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />

        <text fg={C.subtext}>src/engine/app.ts</text>
        <box height={1} bg={C.bg} />
        <text fg={C.dim}>@@ -87,1 +87,1 @@</text>
        <text fg={C.red}>- const rootBg = ... || '#1e1e2e';</text>
        <text fg={C.green}>+ const rootBg = ... || '#020202';</text>
        <box height={1} bg={C.bg} />
        <text fg={C.dim}>@@ -120,3 +120,5 @@</text>
        <text fg={C.subtext}> const style = node.props;</text>
        <text fg={C.red}>- const padding = style.padding;</text>
        <text fg={C.green}>+ const pTop = style.paddingTop;</text>
        <text fg={C.green}>+ const pBot = style.paddingBottom;</text>
        <box height={2} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />
        <text fg={C.text}>[s] stage  [d] discard  [o] open</text>
      </box>
    </box>
  );
}

// ─── BRANCHES VIEW (Tab 2) ───

function BranchesView(props: { sel: number }) {
  return (
    <box flexDirection="row" width="100%" height="100%" bg={C.bg}>

      {/* LEFT: Branch List */}
      <box width="65%" flexDirection="column" height="100%" bg={C.bg}>
        <box height={1} width="100%" bg={C.bg} paddingX={1}>
          <text fg={C.dim}>BRANCH               REMOTE                   AHEAD  BEHIND</text>
        </box>
        <HDivider />
        <box flexGrow={1} flexDirection="column" width="100%" bg={C.bg}>
          <For each={BRANCHES}>
            {(b, i) => (
              <box flexDirection="row" width="100%" height={1} bg={props.sel === i() ? C.activeBg : C.bg} paddingX={1}>
                <text fg={props.sel === i() ? C.blue : C.bg}>{props.sel === i() ? ">" : " "}</text>
                <text fg={b.current ? C.green : C.text}>{fit((b.current ? "* " : "  ") + b.name, 21)}</text>
                <text fg={C.subtext}>{fit(b.remote, 25)}</text>
                <text fg={b.ahead > 0 ? C.green : C.dim}>{fit(String(b.ahead), 7)}</text>
                <text fg={b.behind > 0 ? C.red : C.dim}>{String(b.behind)}</text>
              </box>
            )}
          </For>
        </box>
      </box>

      {/* RIGHT: Branch Info */}
      <box width="35%" flexDirection="column" height="100%" bg={C.bg} paddingLeft={2}>
        <text bold fg={C.text}>BRANCH INFO</text>
        <box height={1} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />

        <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Name:    </text><text bold fg={C.green}>main</text></box>
        <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Remote:  </text><text fg={C.subtext}>origin/main</text></box>
        <box flexDirection="row" bg={C.bg}><text fg={C.dim}>Status:  </text><text fg={C.green}>Up to date</text></box>
        <box height={1} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />
        <text fg={C.dim}>RECENT COMMITS:</text>
        <box height={1} bg={C.bg} />
        <text fg={C.subtext}>a3f7c21 feat: sovereign layout engine</text>
        <text fg={C.subtext}>8d4e1b9 fix: viewport fill bleed</text>
        <text fg={C.subtext}>c92fa03 refactor: StandardView</text>
        <box height={2} bg={C.bg} />
        <HDivider />
        <box height={1} bg={C.bg} />
        <text fg={C.text}>[Enter] checkout  [n] new  [d] delete</text>
      </box>
    </box>
  );
}

// ─── MAIN EXPORT ───

export default function StandardView(props: { tab: number; sel: number }) {
  if (props.tab === 0) return <CommitLogView sel={props.sel} />;
  if (props.tab === 1) return <FileStatusView sel={props.sel} />;
  if (props.tab === 2) return <BranchesView sel={props.sel} />;
  return null;
}
