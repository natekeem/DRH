const fs = require('fs');
let c = fs.readFileSync('src/data/references.ts', 'utf8');
const newDemos = `
  mk({ id:'progressive-blur', name:'Progressive Blur', category:'Effects', subcategory:'Blur', demo:'progressive-blur', description:'A blur effect that smoothly increases in strength towards an edge.', tags:['blur','gradient','mask'], useCases:['hero','footer','overlay'] }),
  mk({ id:'morphing-dialog', name:'Morphing Dialog', category:'Motion', subcategory:'Modal', demo:'morphing-dialog', description:'A trigger element expands continuously into a dialog surface.', tags:['modal','morph','shared-layout'], useCases:['creation form','detail view','menu'] }),
  mk({ id:'dock-magnification', name:'Dock Magnification', category:'Motion', subcategory:'Navigation', demo:'dock-magnification', description:'Items scale up based on proximity to the pointer with smooth falloff.', tags:['dock','scale','proximity'], useCases:['navigation','toolbar','launcher'] }),
  mk({ id:'split-flap', name:'Split Flap', category:'Text', subcategory:'Display', demo:'split-flap', description:'Characters flip like an analog arrivals board with top and bottom panels.', tags:['text','flip','analog'], useCases:['countdown','live stats','hero text'] }),
`;
c = c.replace('export const references: ReferenceItem[] = [', 'export const references: ReferenceItem[] = [\n' + newDemos);
fs.writeFileSync('src/data/references.ts', c);
