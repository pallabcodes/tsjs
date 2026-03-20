/**
 * Zen-TUI: Diff View & Status View Placeholder (Refactored)
 * 
 * Simplified for the "Full Control Edition" build.
 */

import { createSignal, onMount } from "solid-js"
import { getDiff, getStatus } from "../../services/git.js"

export default function DiffView() {
  const [diff, setDiff] = createSignal("")
  onMount(() => setDiff(getDiff()))

  return (
    <box flexDirection="column">
      <box bg="#1A1A2E" padding={1}><text fg="#4ECDC4">◈ DIFF</text></box>
      <box padding={1}><text fg="#A6ACCD">{diff() || "No changes."}</text></box>
    </box>
  )
}
