import { Point } from '../../inv02-viewport/src/index.ts';

/**
 * Invariant 10: Collision & Proximity (Tiny Model)
 * 
 * This implementation captures the essence of xyflow's interaction dynamics:
 * 1. Auto-Panning Velocity (Linear Gradient).
 * 2. Proximity-based attraction.
 */

export interface AutoPanOptions {
  speed: number;
  threshold: number;
}

/**
 * The "Velocity Gradient" DNA.
 * Calculates how fast to pan based on proximity to the container edge.
 */
function getVelocity(value: number, min: number, max: number): number {
  if (value < min) {
    // Closer to 0 = faster negative velocity
    return (value - min) / min;
  } else if (value > max) {
    // Further from max = faster positive velocity
    return (value - max) / min;
  }
  return 0;
}

/**
 * Calculates the [dx, dy] movement for auto-panning.
 */
export function calculateAutoPan(
  mousePos: Point,
  containerSize: { width: number; height: number },
  options: AutoPanOptions = { speed: 15, threshold: 40 }
): Point {
  const vx = getVelocity(mousePos.x, options.threshold, containerSize.width - options.threshold);
  const vy = getVelocity(mousePos.y, options.threshold, containerSize.height - options.threshold);

  return {
    x: vx * options.speed,
    y: vy * options.speed
  };
}

/**
 * The "Magnetic Proximity" DNA.
 * Simple distance check for snap-to-handle logic.
 */
export function isWithinRange(
  pointA: Point,
  pointB: Point,
  radius: number
): boolean {
  const distance = Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
  return distance <= radius;
}
