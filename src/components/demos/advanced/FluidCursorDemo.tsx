import { AdvancedDemoSurface, type AdvancedDemoProps } from './AdvancedDemoSurface'
import './fluidCursor.css'
export type FluidCursorDemoProps = Pick<AdvancedDemoProps, 'variant' | 'active' | 'className' | 'diagnostics'>
export function FluidCursorDemo(props: FluidCursorDemoProps) { return <AdvancedDemoSurface {...props} kind="fluid" /> }
export default FluidCursorDemo
