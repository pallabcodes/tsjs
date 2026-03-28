/** @jsx h */
import { Box, Text, h } from "../index.js";
import { Sparkline } from "./Sparkline.js";

/**
 * PulseDashboard: High-fidelity system metrics dashboard.
 * Matches high-fidelity mockup with 4 key metrics and sparklines.
 */
interface Metric {
  label: string;
  value: string;
  fg: string;
  data: number[];
}

interface PulseDashboardProps {
  title: string;
  time: string;
  metrics: Metric[];
}

export function PulseDashboard(props: PulseDashboardProps) {
  return (
    <Box flexDirection="row" height={4} padding={{ left: 2, right: 2 }} bg="#020617">
      
      {/* Title & Stats Cluster */}
      <Box width={30} flexDirection="column">
        <Text fg="#94a3b8" bold={true}>{props.title}</Text>
      </Box>

      {/* Dynamic Metrics */}
      {props.metrics.map((m) => (
        <Box width={20} flexDirection="column">
          <Text fg="#94a3b8" dim={true}>{m.label}</Text>
          <Box flexDirection="row">
            <Text fg={m.fg} bold={true}>{m.value}</Text>
            <Box flexGrow={1} />
            <Sparkline data={m.data} color={m.fg} width={8} />
          </Box>
        </Box>
      ))}

      <Box flexGrow={1} />

      {/* Clock Cluster */}
      <Box width={15} flexDirection="row" padding={{ right: 2 }} bg="#020617">
        <Text fg="#cbd5e1" bold={true} value={`TIME: ${props.time}`} />
      </Box>

    </Box>
  );
}
