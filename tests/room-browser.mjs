import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { browserSession } from '../scripts/browser-session.mjs';
import { circleIntersectsBox } from '../src/collision.js';
import { VIEWS, TABLES, ANCHORS, SOUTH_DOOR, POSTER_LAYOUT } from '../src/layout.js';
const run=await browserSession({port:4177,dist:process.env.TEST_DIST==='1'});
await mkdir('artifacts',{recursive:true});
try{
 const page=await run.browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(run.url+'/?qa=1');await page.waitForFunction(()=>window.classroomQA?.ready);
 const inventory=await page.evaluate(()=>{
  const qa=window.classroomQA,room=qa.room;
  room.updateMatrixWorld(true);
  const named=[];let meshes=0,vertices=0;
  room.traverse(o=>{if(o.name)named.push(o.name);if(o.isMesh){meshes++;vertices+=o.geometry.attributes.position.count;}});
  const bar=room.getObjectByName('ExitPushBar');const ext=room.getObjectByName('FireExtinguisher');
  const posters=[],posterGeometry=[];const colors=new Set();room.traverse(o=>{if(o.name.startsWith('QuotePoster_')){posters.push(o.userData.sourcePage);posterGeometry.push({page:o.userData.sourcePage,cardinal:o.userData.cardinal,position:o.getWorldPosition(o.position.clone()).toArray(),normal:o.position.clone().set(0,0,1).applyQuaternion(o.getWorldQuaternion(o.quaternion.clone())).toArray(),width:o.children[0].geometry.parameters.width});}if(o.material?.name?.startsWith('Fairy_bulb_'))colors.add(o.material.color.getHexString());});
  const southWall=room.getObjectByName('BackWall').children.filter(o=>o.isMesh&&o.name.startsWith('SouthWall')).map(o=>{o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);return {name:o.name,min:b.min.toArray(),max:b.max.toArray()};});
  const doors=Object.fromEntries(['FrontExitDoor','RearExitDoor'].map(name=>{const o=room.getObjectByName(name);return [name,{position:o.position.toArray(),rotation:o.rotation.y}];}));
  return {build:qa.build,named,meshes,vertices,posters,posterGeometry,southWall,doors,bulbColors:[...colors],barChildren:bar.children.length,extChildren:ext.children.length,colliders:qa.getState().colliders};
 });
 assert.deepEqual(inventory.named.filter(n=>/^Desk_Pair_\d_\d$/.test(n)).sort(),TABLES.map(t=>t.id).sort());
 assert.ok(inventory.named.includes('FrontExitDoor'));assert.ok(inventory.named.includes('RearExitDoor'));
 assert.ok(inventory.named.includes('ExitPushBar'));assert.ok(inventory.named.includes('CurvedHose'));
 assert.deepEqual(inventory.posters,[...Array(38)].map((_,i)=>i+1));assert.equal(inventory.bulbColors.length,6);
 assert.equal(inventory.colliders.length,46);
 for(const p of POSTER_LAYOUT){const actual=inventory.posterGeometry.find(a=>a.page===p.page);assert.deepEqual(actual.position,[p.x,p.y,p.z]);assert.equal(actual.cardinal,p.cardinal);assert.equal(actual.width,p.width);assert.ok(-actual.normal[0]*p.x-actual.normal[2]*p.z>3,'actual inward face '+p.page);}
 assert.deepEqual(inventory.doors.FrontExitDoor,{position:[-2.15,0,-6.96],rotation:0});
 assert.deepEqual(inventory.doors.RearExitDoor,{position:[SOUTH_DOOR.x,0,SOUTH_DOOR.z],rotation:Math.PI});
 const contains=(b,p)=>p.every((v,i)=>v>b.min[i]&&v<b.max[i]);
 assert.equal(inventory.southWall.length,3);
 assert.ok(!inventory.southWall.some(b=>contains(b,[SOUTH_DOOR.x,1.2,7.09])),'real southwest wall opening');
 assert.ok(inventory.southWall.some(b=>contains(b,[2.55,1.2,7.09])),'old southeast location is solid wall');
 const closed=inventory.colliders.find(b=>b.name==='RearExitDoor_Closed');assert.equal((closed.minX+closed.maxX)/2,SOUTH_DOOR.x);
 assert.ok(!inventory.colliders.some(b=>circleIntersectsBox(SOUTH_DOOR.x,6.4,b)),'southwest door approach clears furniture');
 assert.ok(!inventory.colliders.some(c=>c.name==='Prep_cabinet'));
 for(const [name,v] of Object.entries(VIEWS))assert.deepEqual(inventory.colliders.filter(b=>circleIntersectsBox(v.position[0],v.position[2],b)).map(b=>b.name),[],name+' spawn clearance');
 for(const pair of [1,2]){const desks=TABLES.filter(t=>t.pair===pair);assert.ok(desks[1].x-desks[0].x-desks[0].width>.02,'visible pair seam');}
 const design=ANCHORS.find(a=>a.name==='GameAnchor_Design');assert.equal(design.position[0],TABLES[2].x);assert.equal(design.position[2],TABLES[2].z);
 await page.click('#dismiss');
 for(const [name,position,target] of [
  ['desks',[-.65,2.05,2.55],[1.05,.85,-1.6]],
  ['exit-door',[-.65,1.65,-5.25],[-2.15,1.3,-6.9]],
  ['extinguisher',[1.9,1.45,1.9],[3.35,1.15,1.55]],
  ['rear-latch',[-1.5,1.55,5.5],[-2.85,1.2,6.96]],
  ['posters',[-.8,1.9,-2.1],[-3.48,2.9,-2.1]],
  ['north-wall',[0,1.95,-3.1],[0,2.4,-6.98]],
  ['east-wall',[.1,2.1,-.5],[3.47,2.8,-.5]],
  ['south-wall',[-.15,1.8,3.75],[0,1.9,6.97]],
  ['west-wall',[.3,2.1,1.0],[-3.47,2.7,1]],
  ['rainbow-lights',[.3,2.3,1.1],[-3.45,2.95,1.1]]]){
   await page.evaluate(({position,target})=>window.classroomQA.setPose(position,target),{position,target});
   await page.waitForTimeout(250);await page.screenshot({path:`artifacts/classroom-${name}.png`});
 }
 // North-up roof-off view. Cardinal labels are QA annotations, not runtime UI.
 await page.evaluate(()=>{document.getElementById('ceiling').checked=false;document.getElementById('ceiling').dispatchEvent(new Event('change'));window.classroomQA.setPose([0,18,.001],[0,0,0]);const label=document.createElement('div');label.textContent='North (Window / −Z) ↑     West (−X) ←     → East (+X)     ↓ South (+Z) · Door In Southwest';label.style.cssText='position:fixed;top:90px;left:12%;right:12%;padding:10px;text-align:center;background:#fff;color:#193436;z-index:20;font:16px sans-serif';document.body.append(label);document.getElementById('view-name').textContent='Top-Down Orientation Check';});
 await page.waitForTimeout(300);await page.screenshot({path:'artifacts/classroom-topdown.png'});
 assert.deepEqual(errors,[]);
 await writeFile('artifacts/geometry-inventory.json',JSON.stringify(inventory,null,2)+'\n');
 console.log(JSON.stringify({meshes:inventory.meshes,vertices:inventory.vertices,colliders:inventory.colliders.length,desks:4,anchors:6,errors},null,2));
}finally{await run.close();}
