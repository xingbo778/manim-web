/**
 * Curve utility types and pure helper functions for VMobject.
 *
 * This module contains only items that do NOT need to construct VMobject
 * instances, avoiding circular dependency issues.
 *
 * Functions that create new VMobject instances (getNthCurve, curvesAsSubmobjects)
 * live in VMobject.ts and are re-exported from there.
 */

/**
 * 2D Point interface for backward compatibility
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Get the number of curve segments from a Bezier point array.
 * Each cubic Bezier segment uses 4 points (anchor, handle, handle, anchor),
 * with consecutive segments sharing anchors.
 * @param points - The 3D control points array
 * @returns Number of curve segments
 */
export function getNumCurvesFromPoints(points: number[][]): number {
  if (points.length < 4) return 0;
  return Math.floor((points.length - 1) / 3);
}
