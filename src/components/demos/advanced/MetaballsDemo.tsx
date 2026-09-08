import { AdvancedDemoSurface, type AdvancedDemoProps } from './AdvancedDemoSurface'
import './metaballs.css'
export type MetaballsDemoProps = Pick<AdvancedDemoProps, 'variant' | 'active' | 'className' | 'diagnostics'>
export function MetaballsDemo(props: MetaballsDemoProps) { return <AdvancedDemoSurface {...props} kind="metaballs" /> }
export default MetaballsDemo
