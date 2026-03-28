/** @jsx h */
import { Box, Text, h } from "../index.js";

/**
 * Sparkline: Lightweight micro-visualization for high-density metrics.
 * 
 * Performance: Utilizes simple character-based bars for sub-millisecond 
 * rasterization within the TUI engine.
 */
interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
}

export function Sparkline(props: SparklineProps) {
  const bars = [" ", " ", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  const max = Math.max(...props.data, 1);
  const w = props.width || 10;
  
  // Resample data to fit width if necessary
  const displayData = props.data.slice(-w);

  return (
    <Box flexDirection="row" gap={0}>
      {displayData.map((val) => {
        const idx = Math.min(Math.floor((val / max) * (bars.length - 1)), bars.length - 1);
        return <Box><Text fg={props.color || "#ffffff"}>{bars[idx]}</Text></Box>;
      })}
    </Box>
  );
}
