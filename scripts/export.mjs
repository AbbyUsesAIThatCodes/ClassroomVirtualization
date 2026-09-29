import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { browserSession } from './browser-session.mjs';
import { ROOM, ANCHORS, VIEWS } from '../src/layout.js';
const run=await browserSession({port:4174});
try{
  const page=await run.browser.newPage();
  await page.goto(run.url+'/?qa=1');await page.waitForFunction(()=>window.classroomQA?.ready);
  await mkdir('public/assets',{recursive:true});await mkdir('godot/classroom',{recursive:true});
  const download=page.waitForEvent('download');await page.evaluate(()=>window.classroomQA.downloadGLB());
  await (await download).saveAs('public/assets/classroom.glb');
  const {colliders}=await page.evaluate(()=>window.classroomQA.getState());
  const manifest={version:'0.1.0',units:'metres',axis:'Y up; window wall -Z',dimensions:ROOM,scaleConfidence:'Estimated from photographs, not measured',anchors:ANCHORS,views:VIEWS,colliders};
  await writeFile('public/assets/classroom-layout.json',JSON.stringify(manifest,null,2)+'\n');
  await copyFile('public/assets/classroom.glb','godot/classroom/classroom.glb');
  await copyFile('public/assets/classroom-layout.json','godot/classroom/classroom-layout.json');
  console.log('Exported GLB, layout manifest and Godot scene assets.');
}finally{await run.close();}
