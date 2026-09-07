export type OfficialShaderPreset = {
  id: string
  title: string
  ink: 'light' | 'dark'
  fallback: string
  props: Record<string, unknown>
}

// Values are ported from ruucm/shadergradient's MIT-licensed presets.ts.
// Keep this file source-attributed; do not silently replace these with made-up lookalikes.
export const shaderPresets: OfficialShaderPreset[] = [
  {
    id: 'halo', title: 'Halo', ink: 'light',
    fallback: 'linear-gradient(135deg,#ff5005 0%,#dbba95 50%,#d0bce1 100%)',
    props: { type:'plane', uAmplitude:1, uDensity:1.3, uSpeed:.4, uStrength:4, uTime:0, uFrequency:5.5, brightness:1.2, cAzimuthAngle:180, cDistance:3.6, cPolarAngle:90, cameraZoom:1, color1:'#ff5005', color2:'#dbba95', color3:'#d0bce1', envPreset:'city', grain:'on', lightType:'3d', positionX:-1.4, positionY:0, positionZ:0, reflection:.1, rotationX:0, rotationY:10, rotationZ:50, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'pensive', title: 'Pensive', ink: 'light',
    fallback: 'linear-gradient(135deg,#809bd6 0%,#910aff 48%,#af38ff 100%)',
    props: { type:'sphere', uAmplitude:7, uDensity:.8, uSpeed:.3, uStrength:.4, uTime:0, uFrequency:5.5, brightness:1.5, cAzimuthAngle:250, cDistance:1.5, cPolarAngle:140, cameraZoom:12.5, color1:'#809bd6', color2:'#910aff', color3:'#af38ff', envPreset:'city', grain:'on', lightType:'3d', positionX:0, positionY:0, positionZ:0, reflection:.5, rotationX:0, rotationY:0, rotationZ:140, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'mint', title: 'Mint', ink: 'dark',
    fallback: 'linear-gradient(135deg,#94ffd1 0%,#6bf5ff 48%,#ffffff 100%)',
    props: { type:'waterPlane', uAmplitude:0, uDensity:1.2, uSpeed:.2, uStrength:3.4, uTime:0, uFrequency:0, brightness:1.2, cAzimuthAngle:170, cDistance:4.4, cPolarAngle:70, cameraZoom:1, color1:'#94ffd1', color2:'#6bf5ff', color3:'#ffffff', envPreset:'city', grain:'off', lightType:'3d', positionX:0, positionY:.9, positionZ:-.3, reflection:.1, rotationX:45, rotationY:0, rotationZ:0, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'interstella', title: 'Interstella', ink: 'light',
    fallback: 'linear-gradient(135deg,#73bfc4 0%,#ff810a 48%,#8da0ce 100%)',
    props: { type:'sphere', uAmplitude:3.2, uDensity:.8, uSpeed:.3, uStrength:.3, uTime:0, uFrequency:5.5, brightness:.8, cAzimuthAngle:270, cDistance:.5, cPolarAngle:180, cameraZoom:15.1, color1:'#73bfc4', color2:'#ff810a', color3:'#8da0ce', envPreset:'city', grain:'on', lightType:'env', positionX:-.1, positionY:0, positionZ:0, reflection:.4, rotationX:0, rotationY:130, rotationZ:70, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'nighty-night', title: 'Nighty night', ink: 'light',
    fallback: 'linear-gradient(135deg,#606080 0%,#8d7dca 48%,#212121 100%)',
    props: { type:'waterPlane', uAmplitude:0, uDensity:1.5, uSpeed:.3, uStrength:1.5, uTime:8, uFrequency:0, brightness:1, cAzimuthAngle:180, cDistance:2.8, cPolarAngle:80, cameraZoom:9.1, color1:'#606080', color2:'#8d7dca', color3:'#212121', envPreset:'city', grain:'on', lightType:'3d', positionX:0, positionY:0, positionZ:0, reflection:.1, rotationX:50, rotationY:0, rotationZ:-60, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'viola', title: 'Viola', ink: 'light',
    fallback: 'linear-gradient(135deg,#ffffff 0%,#ffbb00 48%,#0700ff 100%)',
    props: { type:'sphere', uAmplitude:1.4, uDensity:1.1, uSpeed:.1, uStrength:1, uTime:0, uFrequency:5.5, brightness:1.1, cAzimuthAngle:0, cDistance:7.1, cPolarAngle:140, cameraZoom:17.3, color1:'#ffffff', color2:'#ffbb00', color3:'#0700ff', envPreset:'city', grain:'off', lightType:'3d', positionX:0, positionY:0, positionZ:0, reflection:.1, rotationX:0, rotationY:0, rotationZ:0, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'universe', title: 'Universe', ink: 'light',
    fallback: 'linear-gradient(135deg,#5606ff 0%,#fe8989 48%,#000000 100%)',
    props: { type:'waterPlane', uAmplitude:0, uDensity:1.1, uSpeed:.1, uStrength:2.4, uTime:.2, uFrequency:5.5, brightness:1.1, cAzimuthAngle:180, cDistance:3.9, cPolarAngle:115, cameraZoom:1, color1:'#5606ff', color2:'#fe8989', color3:'#000000', envPreset:'city', grain:'off', lightType:'3d', positionX:-.5, positionY:.1, positionZ:0, reflection:.1, rotationX:0, rotationY:0, rotationZ:235, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'sunset', title: 'Sunset', ink: 'light',
    fallback: 'linear-gradient(135deg,#ff7a33 0%,#33a0ff 48%,#ffc53d 100%)',
    props: { type:'sphere', uAmplitude:1.4, uDensity:1.1, uSpeed:.1, uStrength:.4, uTime:0, uFrequency:5.5, brightness:1.5, cAzimuthAngle:60, cDistance:7.1, cPolarAngle:90, cameraZoom:15.3, color1:'#ff7a33', color2:'#33a0ff', color3:'#ffc53d', envPreset:'dawn', grain:'off', lightType:'3d', positionX:0, positionY:-.15, positionZ:0, reflection:.1, rotationX:0, rotationY:0, rotationZ:0, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'mandarin', title: 'Mandarin', ink: 'light',
    fallback: 'linear-gradient(135deg,#ff6a1a 0%,#c73c00 48%,#fd4912 100%)',
    props: { type:'waterPlane', uAmplitude:0, uDensity:1.8, uSpeed:.2, uStrength:3, uTime:.2, uFrequency:5.5, brightness:1.2, cAzimuthAngle:180, cDistance:2.4, cPolarAngle:95, cameraZoom:1, color1:'#ff6a1a', color2:'#c73c00', color3:'#FD4912', envPreset:'city', grain:'off', lightType:'3d', positionX:0, positionY:-2.1, positionZ:0, reflection:.1, rotationX:0, rotationY:0, rotationZ:225, shader:'defaults', animate:'on', wireframe:false },
  },
  {
    id: 'cotton-candy', title: 'Cotton Candy', ink: 'dark',
    fallback: 'linear-gradient(135deg,#ebedff 0%,#f3f2f8 48%,#dbf8ff 100%)',
    props: { type:'waterPlane', uAmplitude:0, uDensity:1, uSpeed:.3, uStrength:3, uTime:.2, uFrequency:5.5, brightness:1.2, cAzimuthAngle:180, cDistance:2.9, cPolarAngle:120, cameraZoom:1, color1:'#ebedff', color2:'#f3f2f8', color3:'#dbf8ff', envPreset:'city', grain:'off', lightType:'3d', positionX:0, positionY:1.8, positionZ:0, reflection:.1, rotationX:0, rotationY:0, rotationZ:-90, shader:'defaults', animate:'on', wireframe:false },
  },
]

export const shaderPresetById = Object.fromEntries(shaderPresets.map((preset) => [preset.id, preset])) as Record<string, OfficialShaderPreset>
