/**
 * Zen-TUI: Diff View & Status View Placeholder (Refactored)
 * 
 * Simplified for the "Full Control Edition" build.
 * 
 *  My feedback: same fixes / improvement should apply here as WorkflowOverlay.concept.tsx
 */

import { createSignal, onMount } from "solid-js"
import { getDiff, getStatus } from "../../services/git.js"

export default function DiffView() {
  const [diff, setDiff] = createSignal("")
  onMount(() => setDiff(getDiff()))

  return (
    <Zen.Box flexDirection="column">
      <Zen.Box bg="#1A1A2E" padding={1}><Zen.Text fg="#4ECDC4">◈ DIFF</Zen.Text></Zen.Box>
      <Zen.Box padding={1}><Zen.Text fg="#A6ACCD">{diff() || "No changes."}</Zen.Text></Zen.Box>
    </Zen.Box>
  )
}
