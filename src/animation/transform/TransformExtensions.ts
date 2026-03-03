/**
 * Re-export barrel for backward compatibility.
 * The implementations have been split into separate files:
 * - ApplyTransforms.ts: ApplyFunction, ApplyMethod, ApplyMatrix
 * - FadeTransforms.ts: FadeTransform, FadeTransformPieces, TransformFromCopy
 * - MovementTransforms.ts: ClockwiseTransform, CounterclockwiseTransform, Swap, CyclicReplace
 * - SpecialTransforms.ts: ScaleInPlace, ShrinkToCenter, Restore, FadeToColor, TransformAnimations
 */

// ApplyTransforms
export {
  ApplyFunction,
  applyFunction,
  type ApplyFunctionOptions,
  ApplyMethod,
  applyMethod,
  type ApplyMethodOptions,
  ApplyMatrix,
  applyMatrix,
  type ApplyMatrixOptions,
} from './ApplyTransforms';

// FadeTransforms
export {
  FadeTransform,
  fadeTransform,
  type FadeTransformOptions,
  FadeTransformPieces,
  fadeTransformPieces,
  type FadeTransformPiecesOptions,
  TransformFromCopy,
  transformFromCopy,
  type TransformFromCopyOptions,
} from './FadeTransforms';

// MovementTransforms
export {
  ClockwiseTransform,
  clockwiseTransform,
  type ClockwiseTransformOptions,
  CounterclockwiseTransform,
  counterclockwiseTransform,
  type CounterclockwiseTransformOptions,
  Swap,
  swap,
  type SwapOptions,
  CyclicReplace,
  cyclicReplace,
  type CyclicReplaceOptions,
} from './MovementTransforms';

// SpecialTransforms
export {
  ScaleInPlace,
  scaleInPlace,
  type ScaleInPlaceOptions,
  ShrinkToCenter,
  shrinkToCenter,
  type ShrinkToCenterOptions,
  Restore,
  restore,
  type MobjectWithSavedState,
  type RestoreOptions,
  FadeToColor,
  fadeToColor,
  type FadeToColorOptions,
  TransformAnimations,
  transformAnimations,
  type TransformAnimationsOptions,
} from './SpecialTransforms';
