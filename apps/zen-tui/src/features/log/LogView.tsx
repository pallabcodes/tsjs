/**
 * Zen-TUI — Right Panel Detail/Diff View
 *
 * Renders context-dependent detail based on the active panel and selection:
 *   Panel 1 (Files):    Unified diff of selected file
 *   Panel 2 (Branches): Branch tracking info + recent commits
 *   Panel 3 (Commits):  Full commit detail (hash, author, date, msg, files)
 *   Panel 4 (Stash):    Stash diff
 *   Panel 0 (Status):   Repo overview
 */

const C = {
  base:     "#1e1e2e",
  surface0: "#313244",
  text:     "#cdd6f4",
  subtext0: "#a6adc8",
  overlay0: "#6c7086",
  red:      "#f38ba8",
  green:    "#a6e3a1",
  yellow:   "#f9e2af",
  blue:     "#89b4fa",
  mauve:    "#cba6f7",
  teal:     "#94e2d5",
  peach:    "#fab387",
};

const FNAMES = ["src/engine/app.ts", "src/app/App.tsx", "src/features/log.tsx", "package.json"];

export default function LogView(props: { selectedIndex: number; activePanel: number }) {

  // ── Panel 0: Status / repo overview ──
  if (props.activePanel === 0) {
    return (
      <box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <box height={1} bg={C.base}><text bold fg={C.mauve}>Repository Overview</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.overlay0}>Branch:   </text><text bold fg={C.green}>main</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>Remote:   </text><text fg={C.text}>origin (git@github.com:user/project.git)</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>Tracking: </text><text fg={C.teal}>origin/main (up to date)</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>Changes:  </text><text fg={C.yellow}>4 unstaged, 0 staged</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>Stash:    </text><text fg={C.text}>2 entries</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.overlay0}>Submodules:</text></box>
        <box height={1} bg={C.base}><text fg={C.teal}>  libs/core </text><text fg={C.green}>(clean, v2.1.0)</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.overlay0}>Available workflows:</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [e] Edit .gitconfig   [o] Open submodule</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [u] Update submodule  [i] Init submodule</text></box>
      </box>
    );
  }

  // ── Panel 1: Diff for selected file ──
  if (props.activePanel === 1) {
    const f = FNAMES[props.selectedIndex] || FNAMES[0];
    return (
      <box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <box height={1} bg={C.base}><text bold fg={C.mauve}>{f}</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>@@ -120,6 +120,10 @@ export class ZenApp</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>   const style = node.props;</text></box>
        <box height={1} bg={C.base}><text fg={C.red}>-  const padding = style.padding || 0;</text></box>
        <box height={1} bg={C.base}><text fg={C.red}>-  this.layout.clear();</text></box>
        <box height={1} bg={C.base}><text fg={C.green}>+  const pTop = style.paddingTop || 0;</text></box>
        <box height={1} bg={C.base}><text fg={C.green}>+  const pLeft = style.paddingLeft || 0;</text></box>
        <box height={1} bg={C.base}><text fg={C.green}>+  const pRight = style.paddingRight || 0;</text></box>
        <box height={1} bg={C.base}><text fg={C.green}>+  this.layout.resize(w, h);</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>   this.renderer.flush();</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.overlay0}>Operations: [s]tage file  [S]tage all  [d]iscard changes</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>            [c]ommit  [a]mend  [A]mend author name</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>            [p]ush  [P]ull  [f]etch from remote</text></box>
      </box>
    );
  }

  // ── Panel 2: Branch info ──
  if (props.activePanel === 2) {
    const bnames = ["main", "feat/sovereign", "fix/clipping"];
    const b = bnames[props.selectedIndex] || bnames[0];
    return (
      <box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <box height={1} bg={C.base}><text bold fg={C.green}>{b}</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>Tracking: origin/{b}</text></box>
        <box height={1} bg={C.base}><text fg={C.teal}>Last: 7c2e1f4 feat: sovereignty (2m ago)</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.overlay0}>Recent commits on {b}:</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  * 7c2e1f4 feat: architectural sovereignty</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  * 4d3b0c2 refactor: zen-transformer</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  * 2e9a8d4 fix: ANSI style bleeding</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.overlay0}>Operations:</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [Enter] Checkout    [n] New branch from here</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [m] Merge into current  [r] Rebase onto this</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [R] Rename branch   [d] Delete branch</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [f] Fetch remote    [u] Set upstream</text></box>
      </box>
    );
  }

  // ── Panel 3: Commit detail ──
  if (props.activePanel === 3) {
    const hashes = ["7c2e1f4", "4d3b0c2", "2e9a8d4", "b5c7d8k", "a1b2c3d"];
    const msgs = ["feat: total architectural sovereignty", "refactor: zen-transformer plugin", "fix: resolve ANSI style bleeding", "chore: finalize hardware renderer", "docs: update industrial plan"];
    const h = hashes[props.selectedIndex] || hashes[0];
    const m = msgs[props.selectedIndex] || msgs[0];
    return (
      <box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
        <box height={1} bg={C.base}><text bold fg={C.yellow}>commit {h}</text></box>
        <box height={1} bg={C.base}><text fg={C.teal}>Author: picon &lt;picon@google.com&gt;</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>Date:   2 minutes ago</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text bold fg={C.text}>    {m}</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.green}>  M src/engine/app.ts  | 12 +++---</text></box>
        <box height={1} bg={C.base}><text fg={C.green}>  A src/features/log   | 52 ++++++</text></box>
        <box height={1} bg={C.base}><text fg={C.overlay0}>  2 files changed, 42(+), 8(-)</text></box>
        <box height={1} bg={C.base} />
        <box height={1} bg={C.base}><text fg={C.overlay0}>Operations:</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [c] Cherry-pick this commit</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [r] Revert this commit</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [g] Reset to here: [s]oft [m]ixed [h]ard</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [R] Rebase: [i]nteractive [o]nto [a]bort [C]ontinue</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [A] Amend author name/email</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [f] Fixup into this commit</text></box>
        <box height={1} bg={C.base}><text fg={C.text}>  [S] Squash with previous</text></box>
      </box>
    );
  }

  // ── Panel 4: Stash detail ──
  return (
    <box flexDirection="column" width="100%" bg={C.base} paddingX={1}>
      <box height={1} bg={C.base}><text bold fg={C.yellow}>stash@{"{" + props.selectedIndex + "}"}</text></box>
      <box height={1} bg={C.base}><text fg={C.overlay0}>WIP on main: 7c2e1f4</text></box>
      <box height={1} bg={C.base} />
      <box height={1} bg={C.base}><text fg={C.green}>+ const pTop = style.paddingTop;</text></box>
      <box height={1} bg={C.base}><text fg={C.red}>- const padding = style.padding;</text></box>
      <box height={1} bg={C.base}><text fg={C.text}>  this.renderer.flush();</text></box>
      <box height={1} bg={C.base} />
      <box height={1} bg={C.base}><text fg={C.overlay0}>Operations:</text></box>
      <box height={1} bg={C.base}><text fg={C.text}>  [Enter] Apply stash (keep in stash list)</text></box>
      <box height={1} bg={C.base}><text fg={C.text}>  [g] Pop stash (apply + drop)</text></box>
      <box height={1} bg={C.base}><text fg={C.text}>  [d] Drop stash (discard)</text></box>
      <box height={1} bg={C.base}><text fg={C.text}>  [n] New stash from current changes</text></box>
      <box height={1} bg={C.base}><text fg={C.text}>  [r] Rename stash entry</text></box>
      <box height={1} bg={C.base}><text fg={C.text}>  [b] Create branch from stash</text></box>
    </box>
  );
}
