import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { browserSession } from '../scripts/browser-session.mjs';
import { circleIntersectsBox } from '../src/collision.js';
import { VIEWS, TABLES, ANCHORS } from '../src/layout.js';
const run=await browserSession({port:4177,dist:process.env.TEST_DIST==='1'});
await mkdir('artifacts',{recursive:true});
try{
 const page=await run.browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(run.url+'/?qa=1');await page.waitForFunction(()=>window.classroomQA?.ready);
 const inventory=await page.evaluate(()=>{
  const qa=window.classroomQA,room=qa.room;
  const named=[];let meshes=0,vertices=0;
  room.traverse(o=>{if(o.name)named.push(o.name);if(o.isMesh){meshes++;vertices+=o.geometry.attributes.position.count;}});
  const bar=room.getObjectByName('ExitPushBar');const ext=room.getObjectByName('FireExtinguisher');
  const posters=[];const colors=new Set();room.traverse(o=>{if(o.name.startsWith('QuotePoster_'))posters.push(o.userData.sourcePage);if(o.material?.name?.startsWith('Fairy_bulb_'))colors.add(o.material.color.getHexString());});
  return {build:qa.build,named,meshes,vertices,posters,bulbColors:[...colors],barChildren:bar.children.length,extChildren:ext.children.length,colliders:qa.getState().colliders};
 });
 assert.deepEqual(inventory.named.filter(n=>/^Desk_Pair_\d_\d$/.test(n)).sort(),TABLES.map(t=>t.id).sort());
 assert.ok(inventory.named.includes('FrontExitDoor'));assert.ok(inventory.named.includes('RearExitDoor'));
 assert.ok(inventory.named.includes('ExitPushBar'));assert.ok(inventory.named.includes('CurvedHose'));
 assert.deepEqual(inventory.posters,[...Array(38)].map((_,i)=>i+1));assert.equal(inventory.bulbColors.length,6);
 assert.ok(!inventory.colliders.some(c=>c.name==='Prep_cabinet'));
 for(const [name,v] of Object.entries(VIEWS))assert.deepEqual(inventory.colliders.filter(b=>circleIntersectsBox(v.position[0],v.position[2],b)).map(b=>b.name),[],name+' spawn clearance');
 for(const pair of [1,2]){const desks=TABLES.filter(t=>t.pair===pair);assert.ok(desks[1].x-desks[0].x-desks[0].width>.02,'visible pair seam');}
 const design=ANCHORS.find(a=>a.name==='GameAnchor_Design');assert.equal(design.position[0],TABLES[2].x);assert.equal(design.position[2],TABLES[2].z);
 await page.click('#dismiss');
 for(const [name,position,target] of [
  ['desks',[-.65,2.05,2.55],[1.05,.85,-1.6]],
  ['exit-door',[-.65,1.65,-5.25],[-2.15,1.3,-6.9]],
  ['extinguisher',[1.9,1.45,1.9],[3.35,1.15,1.55]],
  ['rear-latch',[1.7,1.55,5.6],[2.55,1.15,6.96]],
  ['posters',[-1.1,2.1,-.5],[-3.48,2.4,-1.2]],
  ['rainbow-lights',[.3,2.3,1.1],[-3.45,2.95,1.1]]]){
   await page.evaluate(({position,target})=>window.classroomQA.setPose(position,target),{position,target});
   await page.waitForTimeout(250);await page.screenshot({path:`artifacts/classroom-${name}.png`});
 }
 assert.deepEqual(errors,[]);
 await writeFile('artifacts/geometry-inventory.json',JSON.stringify(inventory,null,2)+'\n');
 console.log(JSON.stringify({meshes:inventory.meshes,vertices:inventory.vertices,colliders:inventory.colliders.length,desks:4,anchors:6,errors},null,2));
}finally{await run.close();}
