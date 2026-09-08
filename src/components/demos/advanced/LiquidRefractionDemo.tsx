import { AdvancedDemoSurface, type AdvancedDemoProps } from './AdvancedDemoSurface'
import './liquidRefraction.css'
export type LiquidRefractionDemoProps = AdvancedDemoProps
export function LiquidRefractionDemo(props: LiquidRefractionDemoProps) { return <AdvancedDemoSurface {...props} kind="refraction" /> }
export default LiquidRefractionDemo
