import type { Mobject } from './Mobject';

/**
 * Vector3 type as a tuple for external API
 */
export type Vector3Tuple = [number, number, number];

// Direction constants (matching Manim's coordinate system)
export const UP: Vector3Tuple = [0, 1, 0];
export const DOWN: Vector3Tuple = [0, -1, 0];
export const LEFT: Vector3Tuple = [-1, 0, 0];
export const RIGHT: Vector3Tuple = [1, 0, 0];
export const OUT: Vector3Tuple = [0, 0, 1];
export const IN: Vector3Tuple = [0, 0, -1];
export const ORIGIN: Vector3Tuple = [0, 0, 0];

// Diagonal direction constants
export const UL: Vector3Tuple = [-1, 1, 0]; // UP + LEFT
export const UR: Vector3Tuple = [1, 1, 0]; // UP + RIGHT
export const DL: Vector3Tuple = [-1, -1, 0]; // DOWN + LEFT
export const DR: Vector3Tuple = [1, -1, 0]; // DOWN + RIGHT

/**
 * Updater function type that runs every frame
 * @param mobject - The mobject being updated
 * @param dt - Delta time in seconds since last frame
 */
export type UpdaterFunction = (mobject: Mobject, dt: number) => void;

/**
 * Style properties for mobjects
 */
export interface MobjectStyle {
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
}

/**
 * Interface for duck-typing VMobject properties from Mobject base class.
 * Avoids circular import of VMobject while maintaining type safety.
 */
export interface VMobjectLike {
  _points3D: number[][];
  _visiblePointCount: number | null;
  _geometryDirty: boolean;
  setPoints(points: number[][] | { x: number; y: number }[]): void;
  getPoints(): number[][];
}

/**
 * Type guard to check if a Mobject has VMobject-like point data.
 */
export function isVMobjectLike(m: Mobject): m is Mobject & VMobjectLike {
  return '_points3D' in m;
}
