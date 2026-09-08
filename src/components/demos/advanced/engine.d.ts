export type AdvancedDemoKind = 'fluid' | 'metaballs' | 'refraction'
export type AdvancedDemoVariant = 'card' | 'detail'
export interface AdvancedDemoOptions {
  kind?: AdvancedDemoKind
  variant?: AdvancedDemoVariant
  /** Lens distortion multiplier, clamped to 0–2. */
  intensity?: number
  /** Lens radius in CSS pixels; clamped to fit its container. */
  radius?: number
  active?: boolean
  /** Enables occasional GPU readback for QA; leave false in production. */
  diagnostics?: boolean
}
export interface AdvancedDemoDiagnostics {
  kind: AdvancedDemoKind
  mode: string
  running: boolean
  disposed: boolean
  frames: number
  inputs: number
  contextLosses: number
  width: number
  height: number
  mobile: boolean
  resources: { textures: number; framebuffers: number; programs: number }
  simulation?: [number, number]
  dye?: [number, number]
  pressureIterations?: number
  divergenceBefore?: number
  divergenceAfter?: number
  dyeEnergy?: number
  blobCount?: number
  maxDeformation?: number
  lens?: { x: number; y: number; radius: number; stretch: number; intensity: number }
  error?: string
}
export interface AdvancedDemoController {
  destroy(): void
  reset(): void
  setActive(active: boolean): void
  inspect(): AdvancedDemoDiagnostics
}
export function mountAdvancedDemo(root: HTMLElement, options?: AdvancedDemoOptions): AdvancedDemoController
