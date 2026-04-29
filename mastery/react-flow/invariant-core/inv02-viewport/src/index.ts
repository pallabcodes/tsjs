/**
 * Invariant 02: Viewport Transformation (Tiny Model)
 * 
 * This implementation captures the mathematical essence of a zoomable canvas:
 * 1. Screen <-> Canvas Coordinate Projection
 * 2. Zoom toward Point (The fundamental math of zoomable UIs)
 */

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Maps screen coordinates (pixels) to canvas coordinates (graph units).
 * Invariant: canvasX = (screenX - viewport.x) / viewport.zoom
 * Integrated DNA: Optional snapping to grid.
 */
export function project(
  point: Point, 
  viewport: Viewport, 
  snapGrid: [number, number] | null = null
): Point {
  const position = {
    x: (point.x - viewport.x) / viewport.zoom,
    y: (point.y - viewport.y) / viewport.zoom,
  };

  if (snapGrid) {
    return {
      x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
      y: snapGrid[1] * Math.round(position.y / snapGrid[1]),
    };
  }

  return position;
}

/**
 * Maps canvas coordinates (graph units) to screen coordinates (pixels).
 * Invariant: screenX = (canvasX * viewport.zoom) + viewport.x
 */
export function unproject(point: Point, viewport: Viewport): Point {
  return {
    x: point.x * viewport.zoom + viewport.x,
    y: point.y * viewport.zoom + viewport.y,
  };
}

/**
 * Calculates a new viewport that zooms toward a specific screen point.
 * This is the "DNA" of the xyflow zoom logic.
 * 
 * @param currentViewport - Current {x, y, zoom}
 * @param zoomFactor - Multiplier (e.g. 1.1 for zoom in, 0.9 for zoom out)
 * @param screenPoint - The point (e.g. mouse position) to zoom toward
 * @returns The new constrained viewport
 */
export function calculateZoomToward(
  currentViewport: Viewport,
  zoomFactor: number,
  screenPoint: Point
): Viewport {
  const newZoom = currentViewport.zoom * zoomFactor;

  // The core invariant: The point under the mouse must stay fixed in canvas space.
  // (screenPoint - x) / zoom = (screenPoint - x') / newZoom
  // x' = screenPoint - (screenPoint - x) * (newZoom / zoom)
  
  const newX = screenPoint.x - (screenPoint.x - currentViewport.x) * (newZoom / currentViewport.zoom);
  const newY = screenPoint.y - (screenPoint.y - currentViewport.y) * (newZoom / currentViewport.zoom);

  return {
    x: newX,
    y: newY,
    zoom: newZoom,
  };
}

/**
 * Simple panning logic.
 */
export function pan(currentViewport: Viewport, delta: Point): Viewport {
  return {
    ...currentViewport,
    x: currentViewport.x + delta.x,
    y: currentViewport.y + delta.y,
  };
}
