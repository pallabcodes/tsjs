import { createSignal, createComponent, Show, createEffect } from "solid-js";
import { Zen, useInput } from "@zen-tui/solid";
import fs from "fs";
import { exec, execSync } from "child_process";

const accurateHeight = (() => {
  try {
    const size = execSync('stty size', { stdio: [0, 'pipe', 'pipe'] }).toString().trim();
    return parseInt(size.split(' ')[0], 10) || 24;
  } catch {
    return process.stdout.rows || 24;
  }
})();

export default function App() {
  const [activePanel, setActivePanel] = createSignal("sidebar");
  const [selectedFile, setSelectedFile] = createSignal(0);
  const [selectedCommit, setSelectedCommit] = createSignal(0);
  const [currentBranch, setCurrentBranch] = createSignal("main");
  const [showModal, setShowModal] = createSignal(false);

  const [scrollOffset, setScrollOffset] = createSignal(0);
  const VIEWPORT_SIZE = 10; 
  
  const [filePreview, setFilePreview] = createSignal<string[]>([
    "  Select a file or commit and press [Enter] to view diff."
  ]);

  const [commits, setCommits] = createSignal<Array<{ hash: string, msg: string, graph: string }>>([]);
  const [files, setFiles] = createSignal<Array<{ name: string, icon: string }>>([]);
  const [debugError, setDebugError] = createSignal<string>("");

  const REPO_ROOT = '/Users/picon/Learning/knowledge/tsjs';

  createEffect(() => {
     try {
        const branchOut = execSync('git rev-parse --abbrev-ref HEAD', { cwd: REPO_ROOT }).toString();
        setCurrentBranch(branchOut.trim());

        // 💡 1. REPLACED | WITH ::: TO PREVENT SHELL PIPE EXPANSIONS CRASH!
        const logOut = execSync('git log -n 40 --graph --pretty=format:"%h :::: %s"', { cwd: REPO_ROOT }).toString();
        const parsedCommits = logOut.split('\n').filter(Boolean).map(line => {
           const firstPipe = line.indexOf('::::');
           if (firstPipe === -1) return { hash: '', msg: line, graph: line };
           const graphAndHash = line.substring(0, firstPipe).trim();
           const msg = line.substring(firstPipe + 4); // index past 4 length
           const parts = graphAndHash.split(' ');
           const hash = parts.pop() || '';
           const graph = parts.join(' ');
           return { hash: hash, msg: msg, graph: graph || '*' };
        });
        setCommits(parsedCommits);

        // 💡 2. Fetch files
        const filesOut = execSync('git ls-files', { cwd: REPO_ROOT }).toString();
        const parsedFiles = filesOut.split('\n').filter(Boolean).slice(0, 20).map(f => ({
           name: f,
           icon: "" 
        }));
        setFiles(parsedFiles);

     } catch (err: any) {
        setDebugError(`CATCH: ${err.message || err}`);
     }
  });

  const fetchCommitDiff = (hash: string) => {
     exec(`git show ${hash} --stat`, { cwd: REPO_ROOT }, (err, stdout) => {
        if (!err) setFilePreview(stdout.split('\n'));
     });
  };

  const handleInput = (e: any) => {
    if (e.name === "q") process.exit(0);

    if (showModal()) {
      if (e.name === "escape") setShowModal(false);
      return; 
    }
    
    if (e.name === "tab") setActivePanel(s => (s === "sidebar" ? "commits" : "sidebar"));

    if (activePanel() === "sidebar") {
      const fl = files();
      if (e.name === "down") setSelectedFile(s => Math.min(s + 1, fl.length - 1));
      if (e.name === "up") setSelectedFile(s => Math.max(s - 1, 0));
      if (e.name === "return") {
         const f = fl[selectedFile()];
         if (f) {
           setFilePreview([`Fetching details for ${f.name}...`]);
           exec(`git log -n 5 --oneline -- ${f.name}`, { cwd: REPO_ROOT }, (err, stdout) => { if (!err) setFilePreview(stdout.split('\n')); });
         }
      }
    }

    if (activePanel() === "commits") {
      const cls = commits();
      if (e.name === "down") {
         if (selectedCommit() < cls.length - 1) {
            const next = selectedCommit() + 1;
            setSelectedCommit(next);
            if (next >= scrollOffset() + VIEWPORT_SIZE) setScrollOffset(s => s + 1);
            const c = cls[next]; if (c && c.hash) fetchCommitDiff(c.hash);
         }
      }
      if (e.name === "up") {
         if (selectedCommit() > 0) {
            const next = selectedCommit() - 1;
            setSelectedCommit(next);
            if (next < scrollOffset()) setScrollOffset(s => s - 1);
            const c = cls[next]; if (c && c.hash) fetchCommitDiff(c.hash);
         }
      }
    }
  };

  useInput(handleInput);

  const visibleCommits = () => commits().slice(scrollOffset(), scrollOffset() + VIEWPORT_SIZE);

  // 💡 Compute Dynamic Widths to fill right space
  const termWidth = Math.max(process.stdout.columns || 80, 150); // 💡 High capacity static scaling
  const termHeight = accurateHeight; // 💡 Accurate Absolute Heights
  const contentHeight = termHeight - 3; // 💡 Shift up by 1 leaving absolute bottom free
  const topPanelHeight = Math.floor(contentHeight * 0.6);
  const bottomPanelHeight = contentHeight - topPanelHeight;
  const listWidth = termWidth - 25; 
  const stretchWidth = Math.max(termWidth, 200); // 💡 Safe stretch max for backgrounds

  return Zen.Box({
    // 💡 FORCED ROOT HEIGHT TO PREVENT INVISIBLE CANVAS CLIPPING BOUNDS
    fixedPosition: { x: 0, y: 0, w: stretchWidth, h: termHeight }, bg: "#09090b",
    children: [
      // 🟢 Header Row
      Zen.Box({
        fixedPosition: { x: 0, y: 0, w: stretchWidth, h: 1 }, bg: "#111827",
        children: [
           Zen.Text({ fg: "#60a5fa", children: `  ZEN TUI  [ ${currentBranch()}]                                              󰊢 Connected`.padEnd(200, ' ') })
        ]
      }),

      // 🟢 Workspace Sidebar
      Zen.Box({
        fixedPosition: { x: 0, y: 1, w: 25, h: contentHeight }, flexDirection: "column", paddingX: 1, paddingY: 1, border: true, 
        borderColor: () => activePanel() === "sidebar" ? "#60a5fa" : "#27272a",
        children: [
          Zen.Text({ bold: true, fg: () => activePanel() === "sidebar" ? "#60a5fa" : "#e4e4e7", children: "WORKSPACE" }),
          Zen.Box({ height: 1 }),
          Zen.For({
             each: files,
             children: (f: any, i: () => number) => Zen.Box({
                bg: () => i() === selectedFile() && activePanel() === "sidebar" ? "#27272a" : "transparent",
                children: Zen.Text({ 
                  fg: () => i() === selectedFile() && activePanel() === "sidebar" ? "#ffffff" : "#a1a1aa", 
                  children: `  ${f.name.split('/').pop()}` 
                })
             })
          })
        ]
      }),

      // 🟢 Commit Logs
      Zen.Box({
        fixedPosition: { x: 25, y: 1, w: listWidth, h: topPanelHeight }, flexDirection: "column", paddingX: 1, paddingY: 1, border: true, 
        borderColor: () => activePanel() === "commits" ? "#60a5fa" : "#27272a",
        children: [
          Zen.Text({ bold: true, fg: () => activePanel() === "commits" ? "#60a5fa" : "#e4e4e7", children: "COMMIT LOGS" }),
          
          Zen.Show({
             when: () => !!debugError(),
             children: Zen.Text({ fg: "#ef4444", children: debugError() }) // 💡 Fixed function wrapper crash mapping triggers
          }),

          Zen.Show({
             when: () => commits().length === 0 && !debugError(),
             children: Zen.Text({ fg: "#71717a", children: "  No commits found." })
          }),

          Zen.For({
             each: visibleCommits,
             children: (c: any, i: () => number) => {
                const absoluteIndex = () => scrollOffset() + i();
                return Zen.Box({
                  bg: () => absoluteIndex() === selectedCommit() && activePanel() === "commits" ? "#27272a" : "transparent",
                  flexDirection: "row", gap: 1,
                  children: [
                     Zen.Text({ fg: "#10b981", children: `${c.graph}` }), 
                     Zen.Text({ fg: "#60a5fa", children: `${c.hash}` }),
                     Zen.Text({ 
                        fg: () => absoluteIndex() === selectedCommit() && activePanel() === "commits" ? "#ffffff" : "#e4e4e7", 
                        children: `| ${c.msg.substring(0, 24)}` 
                     })
                  ]
                });
             }
          })
        ]
      }),

      // 🟢 File Preview
      Zen.Box({
        fixedPosition: { x: 25, y: 1 + topPanelHeight, w: listWidth, h: bottomPanelHeight }, flexDirection: "column", paddingX: 1, border: true, borderColor: "#27272a",
        children: [
           Zen.For({
              each: () => filePreview().slice(0, 6),
              children: (line: string) => Zen.Text({ 
                 fg: line.startsWith("+") || line.startsWith(" +") ? "#10b981" : line.startsWith("-") || line.startsWith(" -") ? "#ef4444" : "#a1a1aa", 
                 children: line.substring(0, 50) 
              })
           })
        ]
      }),

      // 🟢 Footer
      Zen.Box({
        fixedPosition: { x: 0, y: termHeight - 2, w: stretchWidth, h: 1 }, bg: "#111827", paddingX: 2, flexDirection: "row",
        children: [
          Zen.Text({ fg: "#60a5fa", bg: "#111827", children: "  Tab: Focus    q: Exit".padEnd(200, ' ') })
        ]
      })
    ]
  });
}
