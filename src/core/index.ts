export { Mobject, type MobjectStyle, type Vector3Tuple } from './Mobject';
export {
  VMobject,
  type Point,
  CurvesAsSubmobjects,
  curvesAsSubmobjects,
  getNumCurves,
  getNthCurve,
} from './VMobject';
export { Group } from './Group';
export { VGroup } from './VGroup';
export { VDict, VectorizedPoint } from './VDict';
export { Scene, type SceneOptions } from './Scene';
export { Camera2D, Camera3D, type CameraOptions, type Camera3DOptions } from './Camera';
export {
  MovingCamera,
  ThreeDCamera,
  MultiCamera,
  type MovingCameraOptions,
  type ThreeDCameraOptions,
  type CameraAnimationOptions,
  type CameraViewport,
  type CameraEntry,
  type MultiCameraOptions,
} from './CameraExtensions';
export {
  CameraFrame,
  CameraAnimateProxy,
  type CameraFrameOptions,
  type CameraFrameState,
  type CameraAnimationOptions as CameraFrameAnimationOptions,
} from './CameraFrame';
export { Renderer, type RendererOptions } from './Renderer';
export {
  SceneStateManager,
  serializeMobject,
  deserializeMobject,
  saveMobjectState,
  restoreMobjectState,
  stateToJSON,
  stateFromJSON,
  snapshotToJSON,
  snapshotFromJSON,
  type MobjectState,
  type SceneSnapshot,
} from './StateManager';
export { AudioManager, type AudioTrack, type AddSoundOptions } from './AudioManager';
export { InteractiveScene, type InteractiveSceneOptions } from './InteractiveScene';
export {
  Lighting,
  type AmbientLightOptions,
  type DirectionalLightOptions,
  type PointLightOptions,
  type SpotLightOptions,
} from './Lighting';
export { ThreeDScene, type ThreeDSceneOptions } from './ThreeDScene';
export { MovingCameraScene, type MovingCameraSceneOptions } from './MovingCameraScene';
export { ZoomedScene, ZoomDisplayPopOut, type ZoomedSceneOptions } from './ZoomedScene';
export { VectorScene, type VectorSceneOptions } from './VectorScene';
export {
  LinearTransformationScene,
  type LinearTransformationSceneOptions,
  type Matrix2D,
} from './LinearTransformationScene';
