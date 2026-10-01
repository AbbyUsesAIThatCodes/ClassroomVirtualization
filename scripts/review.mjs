import { cp, mkdir, writeFile } from 'node:fs/promises';
import { runBuild } from './build-identity.mjs';
import { exportRoom } from './export.mjs';
import { buildWeb } from './build.mjs';
await runBuild('web-glb-godot-source',async(manifest,path)=>{
 await exportRoom(manifest,path);
 await buildWeb(manifest);
 const dest='review-packages/'+manifest.id;await mkdir(dest,{recursive:true});
 await cp('dist',dest+'/site',{recursive:true});
 await cp('godot',dest+'/godot',{recursive:true,filter:p=>!p.split(/[\\/]/).includes('.godot')});
 await cp('THIRD_PARTY_NOTICES.md',dest+'/THIRD_PARTY_NOTICES.md');
 await writeFile(dest+'/START-HERE.txt',`Our Classroom — ${manifest.codename}\n${manifest.id}\n\nOpen site/Classroom-Walkthrough.html in a browser with WebGL 2. It works offline.\nWASD/arrows to walk; drag to look; Room Overview for cutaway; Scene for options.\nThe site/assets folder holds the regenerated GLB and layout.\nGodot project source is included; see verification report for native runtime results.\nDraft review only; this package has not been deployed.\n`);
});
