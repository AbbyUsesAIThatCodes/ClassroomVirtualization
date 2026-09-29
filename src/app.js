import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { createClassroom, addClassroomLighting } from './classroom.js';
import { createLeverExample } from './activity-example.js';
import { VIEWS, ROOM, ANCHORS } from './layout.js';
import { moveWithCollisions } from './collision.js';

const $=id=>document.getElementById(id),canvas=$('viewport');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch(error){$('error').hidden=false;throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
const scene=new THREE.Scene();scene.background=new THREE.Color('#d8dfd6');
const camera=new THREE.PerspectiveCamera(67,1,.04,85);camera.rotation.order='YXZ';
const classroom=createClassroom();scene.add(classroom.root);addClassroomLighting(scene);
const {groups,colliders,anchors}=classroom;
const orbit=new OrbitControls(camera,canvas);orbit.enabled=false;orbit.enableDamping=true;orbit.maxDistance=25;orbit.minDistance=6;orbit.maxPolarAngle=Math.PI*.46;orbit.target.set(0,0,0);
let mode='walk',yaw=0,pitch=0,drag=null,activity=null,lastTime=0,showAnchors=false,lastWalk={position:VIEWS.entrance.position,yaw:0,pitch:0};
const keys=new Set();let noticeTimer;
function notice(text){$('message').textContent=text;$('message').classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('message').classList.remove('visible'),2800);}
function clearInput(){keys.clear();drag=null;}
function releaseMouse(){if(document.pointerLockElement===canvas)document.exitPointerLock();clearInput();}
function lookAt(target){camera.lookAt(...target);yaw=camera.rotation.y;pitch=camera.rotation.x;}
function applyVisibility(){groups.Ceiling.visible=mode==='walk'&&$('ceiling').checked;groups.LeftWall.visible=mode==='walk';groups.BackWall.visible=mode==='walk';groups.Decor.visible=$('details').checked;groups.StringLights.visible=$('lights').checked;for(const child of groups.Decor.children)if(['left','back'].includes(child.userData.wall))child.visible=mode==='walk';}
function switchMode(next){
  releaseMouse();
  if(next===mode)return;
  if(next==='overview'){
    lastWalk={position:camera.position.toArray(),yaw,pitch};mode='overview';camera.fov=45;camera.position.set(-10.8,11.7,13.8);orbit.enabled=true;orbit.target.set(0,.2,0);orbit.update();$('view-name').textContent='A room for making things';$('hint').textContent='Drag to orbit · scroll / pinch to zoom';
  }else{mode='walk';camera.fov=67;orbit.enabled=false;camera.position.fromArray(lastWalk.position);yaw=lastWalk.yaw;pitch=lastWalk.pitch;camera.rotation.set(pitch,yaw,0);$('view-name').textContent=VIEWS[$('view-select').value]?.label||'Walking the classroom';$('hint').textContent='WASD / arrows · drag to look · Shift to move faster';}
  camera.updateProjectionMatrix();
  $('app').classList.toggle('mode-overview',mode==='overview');
  $('walk').classList.toggle('selected',mode==='walk');$('overview').classList.toggle('selected',mode==='overview');$('walk').setAttribute('aria-pressed',String(mode==='walk'));$('overview').setAttribute('aria-pressed',String(mode==='overview'));
  $('touch-pad').style.visibility=mode==='walk'?'visible':'hidden';$('ceiling').disabled=mode==='overview';applyVisibility();
}
function goTo(name){switchMode('walk');const view=VIEWS[name];camera.position.fromArray(view.position);lookAt(view.target);$('view-select').value=name;$('view-name').textContent=view.label;clearInput();}
goTo('entrance');
function enter(){ $('welcome').hidden=true;switchMode('walk');canvas.focus();if(!matchMedia('(pointer:coarse)').matches){const result=canvas.requestPointerLock?.();result?.catch?.(()=>notice('Drag the scene to look around.'));}}
$('start').onclick=enter;$('dismiss').onclick=()=>{$('welcome').hidden=true;canvas.focus();};
$('walk').onclick=()=>{switchMode('walk');$('welcome').hidden=true;canvas.focus();};$('overview').onclick=()=>{switchMode('overview');$('welcome').hidden=true;};
$('view-select').onchange=e=>{goTo(e.target.value);$('welcome').hidden=true;};
function setSettings(open){releaseMouse();$('settings').hidden=!open;$('touch-pad').hidden=open;$('settings-toggle').setAttribute('aria-expanded',String(open));}
$('settings-toggle').onclick=()=>setSettings($('settings').hidden);$('close-settings').onclick=()=>setSettings(false);
for(const id of ['ceiling','lights','details'])$(id).onchange=applyVisibility;
$('shadows').onchange=()=>{renderer.shadowMap.enabled=$('shadows').checked;scene.traverse(o=>{if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.needsUpdate=true;}});};
$('map').onchange=()=>{$('map-panel').hidden=!$('map').checked;};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('app').requestFullscreen();}catch{notice('Fullscreen is unavailable here.');}};
$('activity').onclick=()=>{
  if(activity){anchors.GameAnchor_Lever.remove(activity);activity.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});activity=null;$('activity').textContent='Place a lever example';notice('Lever example removed.');return;}
  activity=createLeverExample();anchors.GameAnchor_Lever.add(activity);goTo('workshop');camera.position.set(-.3,1.65,1.28);lookAt([-2.24,1.12,.3]);$('view-name').textContent='A lever in your classroom';$('activity').textContent='Remove lever example';$('welcome').hidden=true;setSettings(false);notice('Example attached to GameAnchor_Lever.');
};
const labels=ANCHORS.filter(a=>a.role==='tabletop'||a.role==='floor').map(a=>{const div=document.createElement('div');div.textContent=a.name.replace('GameAnchor_','')+' activity';div.hidden=true;$('anchor-labels').append(div);return {div,anchor:anchors[a.name]};});
$('anchors').onchange=()=>{showAnchors=$('anchors').checked;};
window.addEventListener('keydown',e=>{
  if(e.code==='Escape'){releaseMouse();setSettings(false);return;}
  if(e.target.closest?.('input,select,button,a'))return;
  if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)){keys.add(e.code);e.preventDefault();}
});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',clearInput);document.addEventListener('visibilitychange',clearInput);
canvas.addEventListener('pointerdown',e=>{if(mode!=='walk')return;canvas.focus();drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{
  if(mode!=='walk')return;
  let dx=0,dy=0;if(document.pointerLockElement===canvas){dx=e.movementX;dy=e.movementY;}else if(drag?.id===e.pointerId){dx=e.clientX-drag.x;dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;}else return;
  yaw-=dx*.0025;pitch=THREE.MathUtils.clamp(pitch-dy*.0025,-1.38,1.38);camera.rotation.set(pitch,yaw,0);
});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=null);
document.addEventListener('pointerlockchange',()=>{$('reticle').hidden=document.pointerLockElement!==canvas;clearInput();});
canvas.addEventListener('dblclick',()=>{if(mode==='walk')enter();});
for(const button of document.querySelectorAll('[data-move]')){
  button.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(button.dataset.move);button.setPointerCapture(e.pointerId);$('welcome').hidden=true;});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.move));
}
const map=$('minimap'),ctx=map.getContext('2d');
function drawMap(){if($('map-panel').hidden)return;const scale=19.6,ox=90,oz=154;
  ctx.clearRect(0,0,180,310);ctx.fillStyle='#34534b';ctx.fillRect(ox-3.5*scale,oz-7*scale,7*scale,14*scale);ctx.strokeStyle='#b2c9aa';ctx.lineWidth=2;ctx.strokeRect(ox-3.5*scale,oz-7*scale,7*scale,14*scale);
  for(const b of colliders){if(b.name.startsWith('Wall')||b.name.startsWith('Prep'))continue;ctx.fillStyle=b.name.startsWith('Workbench')?'#b99b65':b.name.includes('yellow')?'#e5bf4c':b.name.includes('red')?'#c17676':'#7c948b';ctx.fillRect(ox+b.minX*scale,oz+b.minZ*scale,(b.maxX-b.minX)*scale,(b.maxZ-b.minZ)*scale);}
  const p=mode==='walk'?camera.position:{x:lastWalk.position[0],z:lastWalk.position[2]};const a=mode==='walk'?yaw:lastWalk.yaw;ctx.save();ctx.translate(ox+p.x*scale,oz+p.z*scale);ctx.rotate(-a);ctx.fillStyle='#f9f4cc';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(5,5);ctx.lineTo(0,2);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.restore();
}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
function frame(time){const dt=Math.min((time-lastTime)/1000,.05);lastTime=time;
  if(mode==='walk'){
    let side=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft'));
    let forward=Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'));
    const norm=Math.hypot(side,forward)||1;const speed=(keys.has('ShiftLeft')||keys.has('ShiftRight')?3.2:1.8)*dt;side=side/norm*speed;forward=forward/norm*speed;
    if(side||forward){const dx=Math.cos(yaw)*side-Math.sin(yaw)*forward,dz=-Math.sin(yaw)*side-Math.cos(yaw)*forward;const p=moveWithCollisions(camera.position,dx,dz,colliders);camera.position.x=p.x;camera.position.z=p.z;$('welcome').hidden=true;}
  }else orbit.update();
  for(const {div,anchor} of labels){const v=anchor.getWorldPosition(new THREE.Vector3());v.y+=.24;v.project(camera);div.hidden=!showAnchors||v.z< -1||v.z>1||Math.abs(v.x)>1||Math.abs(v.y)>1;if(!div.hidden){div.style.left=(v.x*.5+.5)*innerWidth+'px';div.style.top=(-v.y*.5+.5)*innerHeight+'px';}}
  drawMap();renderer.render(scene,camera);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Export a clean, fully visible environment regardless of preview UI state.
async function exportGLB(){const clean=createClassroom().root;const data=await new GLTFExporter().parseAsync(clean,{binary:true,onlyVisible:true});clean.traverse(o=>{o.geometry?.dispose();});return data;}
async function downloadGLB(){const data=await exportGLB();const url=URL.createObjectURL(new Blob([data],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download='NCH-Classroom-v0.1.0.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
if(location.protocol==='file:'){
  $('download-glb').onclick=async e=>{e.preventDefault();notice('Preparing your classroom scene…');try{await downloadGLB();notice('Classroom scene exported.');}catch{notice('The scene could not be exported on this device.');}};
  $('download-layout').onclick=e=>{e.preventDefault();const data={version:'0.1.0',units:'metres',dimensions:ROOM,scaleConfidence:'Estimated from photographs, not measured',anchors:ANCHORS,views:VIEWS,colliders};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='classroom-layout.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);};
}
// Build and QA hooks are enabled only on loopback with an explicit query flag.
if(['127.0.0.1','localhost'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa')){
  window.classroomQA={ready:true,goTo,switchMode,downloadGLB,getState:()=>({mode,position:camera.position.toArray(),yaw,pitch,colliders,anchors:Object.fromEntries(Object.entries(anchors).map(([k,v])=>[k,v.position.toArray()])),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,ceiling:groups.Ceiling.visible}),setPose:(position,target)=>{camera.position.fromArray(position);lookAt(target);},exportGLB};
}
