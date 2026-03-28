/** @jsx h */
import { Box, Text, h } from "../index.js";

/**
 * Sparkline: Lightweight micro-visualization for high-density metrics.
 * 
 * Provides both a RUC Component and a raw string utility for 
 * absolute layout stability.
 */
interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
}

export function getSparklineString(data: number[], width: number): string {
  const bars = [" ", " ", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
  const max = Math.max(...data, 1);
  const w = width || 10;
  
  // Resample data to fit width if necessary
  const displayData = data.slice(-w);
  return displayData.map((val) => {
    const idx = Math.min(Math.floor((val / max) * (bars.length - 1)), bars.length - 1);
    return bars[idx];
  }).join('');
}

export function Sparkline(props: SparklineProps) {
  const str = getSparklineString(props.data, props.width || 10);
  return <Text fg={props.color || "#ffffff"} value={str} />;
}
