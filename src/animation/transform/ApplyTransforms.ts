/**
 * Apply-type Transform animations for manimweb.
 * Includes ApplyFunction, ApplyMethod, and ApplyMatrix.
 */

import * as THREE from 'three';
import { VMobject } from '../../core/VMobject';
import { Mobject, Vector3Tuple } from '../../core/Mobject';
import { Animation, AnimationOptions } from '../Animation';
import { Transform } from './Transform';
import { lerpPoint } from '../../utils/math';
import { Arrow, DoubleArrow } from '../../mobjects/geometry/Arrow';

// ============================================================================
// Shared VMobjectLike duck-type (mirrors ApplyPointwiseFunction)
// ============================================================================

export interface VMobjectLike {
  getPoints(): number[][];
  setPoints(pts: number[][]): void;
}

export function isVMobjectLike(m: unknown): m is VMobjectLike {
  const obj = m as Record<string, unknown>;
  return typeof obj.getPoints === 'function' && typeof obj.setPoints === 'function';
}

export interface ChildSnapshot {
  mob: VMobjectLike;
  startPoints: number[][];
  targetPoints: number[][];
}

export function _reconstructArrowTips(mobject: Mobject): void {
  for (const mob of mobject.getFamily()) {
    if (mob instanceof Arrow) mob.reconstructTip();
    else if (mob instanceof DoubleArrow) mob.reconstructTips();
  }
}

// ============================================================================
// ApplyFunction
// ============================================================================

export interface ApplyFunctionOptions extends AnimationOptions {
  /** Function to apply to each point */
  func: (point: number[]) => number[];
}

/**
 * ApplyFunction animation - applies an arbitrary function to mobject points.
 * Supports both VMobject and Group (walks the family tree like ApplyPointwiseFunction).
 */
export class ApplyFunction extends Animation {
  readonly func: (point: number[]) => number[];
  private _snapshots: ChildSnapshot[] = [];

  constructor(mobject: Mobject, options: ApplyFunctionOptions) {
    super(mobject, options);
    this.func = options.func;
  }

  override begin(): void {
    super.begin();

    this._snapshots = [];
    const _v = new THREE.Vector3();

    for (const mob of this.mobject.getFamily()) {
      if (isVMobjectLike(mob)) {
        const startPoints = mob.getPoints();
        if (startPoints.length === 0) continue;

        const threeObj = (mob as Mobject)._threeObject;
        let worldMatrix: THREE.Matrix4 | null = null;
        let inverseWorld: THREE.Matrix4 | null = null;

        if (threeObj) {
          threeObj.updateWorldMatrix(true, false);
          worldMatrix = threeObj.matrixWorld;
          inverseWorld = worldMatrix.clone().invert();
        }

        let targetPoints: number[][];
        if (worldMatrix && inverseWorld) {
          targetPoints = startPoints.map((p) => {
            _v.set(p[0], p[1], p[2]).applyMatrix4(worldMatrix!);
            const worldResult = this.func([_v.x, _v.y, _v.z]);
            _v.set(worldResult[0], worldResult[1], worldResult[2]).applyMatrix4(inverseWorld!);
            return [_v.x, _v.y, _v.z];
          });
        } else {
          targetPoints = startPoints.map((p) => this.func([...p]));
        }

        this._snapshots.push({ mob, startPoints, targetPoints });
      }
    }
  }

  interpolate(alpha: number): void {
    for (const snap of this._snapshots) {
      const interpolated: number[][] = [];
      for (let i = 0; i < snap.startPoints.length; i++) {
        interpolated.push(lerpPoint(snap.startPoints[i], snap.targetPoints[i], alpha));
      }
      snap.mob.setPoints(interpolated);
    }
    _reconstructArrowTips(this.mobject);
    this.mobject._markDirtyUpward();
  }

  override finish(): void {
    for (const snap of this._snapshots) {
      snap.mob.setPoints(snap.targetPoints);
    }
    _reconstructArrowTips(this.mobject);
    this.mobject._markDirtyUpward();
    super.finish();
  }
}

/**
 * Create an ApplyFunction animation.
 * @param mobject The Mobject to transform (VMobject or Group)
 * @param func Function to apply to each point [x, y, z] => [x', y', z']
 * @param options Animation options
 */
export function applyFunction(
  mobject: Mobject,
  func: (point: number[]) => number[],
  options?: Omit<ApplyFunctionOptions, 'func'>,
): ApplyFunction {
  return new ApplyFunction(mobject, { ...options, func });
}

// ============================================================================
// ApplyMethod
// ============================================================================

export interface ApplyMethodOptions extends AnimationOptions {
  /** Method name to call on the mobject */
  methodName: string;
  /** Arguments to pass to the method */
  args?: unknown[];
}

/**
 * ApplyMethod animation - animates calling a method on a mobject.
 * Creates a copy, calls the method on the copy, then transforms to the result.
 */
export class ApplyMethod extends Transform {
  /** Method name */
  readonly methodName: string;

  /** Method arguments */
  readonly args: unknown[];

  constructor(mobject: VMobject, options: ApplyMethodOptions) {
    // Create target by copying and calling method
    const target = mobject.copy() as VMobject;
    const method = (target as unknown as Record<string, (...args: unknown[]) => unknown>)[
      options.methodName
    ];
    if (typeof method === 'function') {
      method.call(target, ...(options.args || []));
    }

    super(mobject, target, options);
    this.methodName = options.methodName;
    this.args = options.args || [];
  }
}

/**
 * Create an ApplyMethod animation.
 * @param mobject The VMobject to transform
 * @param methodName Name of the method to call
 * @param args Arguments to pass to the method
 * @param options Animation options
 */
export function applyMethod(
  mobject: VMobject,
  methodName: string,
  args?: unknown[],
  options?: AnimationOptions,
): ApplyMethod {
  return new ApplyMethod(mobject, { ...options, methodName, args });
}

// ============================================================================
// ApplyMatrix
// ============================================================================

export interface ApplyMatrixOptions extends AnimationOptions {
  /** 3x3 or 4x4 transformation matrix (row-major) */
  matrix: number[][];
  /** Point to apply transformation about, defaults to origin */
  aboutPoint?: Vector3Tuple;
}

/**
 * ApplyMatrix animation - applies a matrix transformation to mobject points.
 * Supports both VMobject and Group (walks the family tree like ApplyPointwiseFunction).
 */
export class ApplyMatrix extends Animation {
  readonly matrix: number[][];
  readonly aboutPoint: Vector3Tuple;
  private _snapshots: ChildSnapshot[] = [];

  constructor(mobject: Mobject, options: ApplyMatrixOptions) {
    super(mobject, options);
    this.matrix = options.matrix;
    this.aboutPoint = options.aboutPoint ?? [0, 0, 0];
  }

  override begin(): void {
    super.begin();

    this._snapshots = [];
    const _v = new THREE.Vector3();

    for (const mob of this.mobject.getFamily()) {
      if (isVMobjectLike(mob)) {
        const startPoints = mob.getPoints();
        if (startPoints.length === 0) continue;

        const threeObj = (mob as Mobject)._threeObject;
        let worldMatrix: THREE.Matrix4 | null = null;
        let inverseWorld: THREE.Matrix4 | null = null;

        if (threeObj) {
          threeObj.updateWorldMatrix(true, false);
          worldMatrix = threeObj.matrixWorld;
          inverseWorld = worldMatrix.clone().invert();
        }

        let targetPoints: number[][];
        if (worldMatrix && inverseWorld) {
          targetPoints = startPoints.map((p) => {
            _v.set(p[0], p[1], p[2]).applyMatrix4(worldMatrix!);
            const worldResult = this._transformPoint([_v.x, _v.y, _v.z]);
            _v.set(worldResult[0], worldResult[1], worldResult[2]).applyMatrix4(inverseWorld!);
            return [_v.x, _v.y, _v.z];
          });
        } else {
          targetPoints = startPoints.map((p) => this._transformPoint(p));
        }

        this._snapshots.push({ mob, startPoints, targetPoints });
      }
    }
  }

  private _transformPoint(point: number[]): number[] {
    const x = point[0] - this.aboutPoint[0];
    const y = point[1] - this.aboutPoint[1];
    const z = point[2] - this.aboutPoint[2];

    let newX: number, newY: number, newZ: number;

    if (this.matrix.length === 3 && this.matrix[0].length === 3) {
      newX = this.matrix[0][0] * x + this.matrix[0][1] * y + this.matrix[0][2] * z;
      newY = this.matrix[1][0] * x + this.matrix[1][1] * y + this.matrix[1][2] * z;
      newZ = this.matrix[2][0] * x + this.matrix[2][1] * y + this.matrix[2][2] * z;
    } else if (this.matrix.length === 4 && this.matrix[0].length === 4) {
      const w =
        this.matrix[3][0] * x + this.matrix[3][1] * y + this.matrix[3][2] * z + this.matrix[3][3];
      newX =
        (this.matrix[0][0] * x +
          this.matrix[0][1] * y +
          this.matrix[0][2] * z +
          this.matrix[0][3]) /
        w;
      newY =
        (this.matrix[1][0] * x +
          this.matrix[1][1] * y +
          this.matrix[1][2] * z +
          this.matrix[1][3]) /
        w;
      newZ =
        (this.matrix[2][0] * x +
          this.matrix[2][1] * y +
          this.matrix[2][2] * z +
          this.matrix[2][3]) /
        w;
    } else {
      return point;
    }

    return [newX + this.aboutPoint[0], newY + this.aboutPoint[1], newZ + this.aboutPoint[2]];
  }

  interpolate(alpha: number): void {
    for (const snap of this._snapshots) {
      const interpolated: number[][] = [];
      for (let i = 0; i < snap.startPoints.length; i++) {
        interpolated.push(lerpPoint(snap.startPoints[i], snap.targetPoints[i], alpha));
      }
      snap.mob.setPoints(interpolated);
    }
    _reconstructArrowTips(this.mobject);
    this.mobject._markDirtyUpward();
  }

  override finish(): void {
    for (const snap of this._snapshots) {
      snap.mob.setPoints(snap.targetPoints);
    }
    _reconstructArrowTips(this.mobject);
    this.mobject._markDirtyUpward();
    super.finish();
  }
}

/**
 * Create an ApplyMatrix animation.
 * @param mobject The Mobject to transform (VMobject or Group)
 * @param matrix 3x3 or 4x4 transformation matrix
 * @param options Animation options including aboutPoint
 */
export function applyMatrix(
  mobject: Mobject,
  matrix: number[][],
  options?: Omit<ApplyMatrixOptions, 'matrix'>,
): ApplyMatrix {
  return new ApplyMatrix(mobject, { ...options, matrix });
}
