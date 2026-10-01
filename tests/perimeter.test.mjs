import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { POSTER_LAYOUT, SOUTH_DOOR, ROOM } from '../src/layout.js';
const art=JSON.parse(await readFile(new URL('../src/assets/quote-posters.json',import.meta.url)));
const rect=p=>{const e=art.entries[p.page-1];return {a:(['north','south'].includes(p.cardinal)?p.x:p.z)-p.width/2,b:(['north','south'].includes(p.cardinal)?p.x:p.z)+p.width/2,lo:p.y-p.width*e.height/e.width/2,hi:p.y+p.width*e.height/e.width/2};};
const overlaps=(a,b)=>a.a<b.b&&a.b>b.a&&a.lo<b.hi&&a.hi>b.lo;
test('all 38 original pages wrap clockwise around all four walls, facing inward',()=>{
 assert.deepEqual(POSTER_LAYOUT.map(p=>p.page),Array.from({length:38},(_,i)=>i+1));
 assert.deepEqual(Object.fromEntries(['north','east','south','west'].map(c=>[c,POSTER_LAYOUT.filter(p=>p.cardinal===c).length])),{north:5,east:12,south:8,west:13});
 for(const p of POSTER_LAYOUT){
  const r=rect(p),end=['north','south'].includes(p.cardinal)?3.5:7;
  assert.ok(r.a>-end&&r.b<end,`page ${p.page} stays inside corner`);
  assert.ok(p.width>=.58,`page ${p.page} is at least the previous readable width`);
  assert.ok(-Math.sin(p.rotation)*p.x-Math.cos(p.rotation)*p.z>3,`page ${p.page} faces room centre`);
  assert.ok(r.hi<(p.z>ROOM.nookStart?ROOM.nookHeight:ROOM.height),`page ${p.page} clears ceiling`);
  const peers=POSTER_LAYOUT.filter(q=>q.cardinal===p.cardinal&&q.page!==p.page);
  assert.ok(!peers.some(q=>overlaps(r,rect(q))),`page ${p.page} has no overlapping poster`);
 }
 // Every successive page alternates its upper/lower position in its local ceiling band.
 const upper=p=>p.y>(p.z>ROOM.nookStart?2.15:3.1);
 for(let i=0;i<38;i++)assert.notEqual(upper(POSTER_LAYOUT[i]),upper(POSTER_LAYOUT[(i+1)%38]),`zig-zag at page ${i+1}`);
 const runs=['north','east','south','west'].map(c=>POSTER_LAYOUT.filter(p=>p.cardinal===c));
 for(const [i,run] of runs.entries())for(let n=1;n<run.length;n++)assert.ok((i<2?1:-1)*((i%2?run[n].z:run[n].x)-(i%2?run[n-1].z:run[n-1].x))>0,'clockwise order');
});
test('poster rectangles clear door frames, window, teaching displays and nook storage',()=>{
 const obstacles={north:[{a:-2.74,b:-1.56,lo:0,hi:2.52},{a:-.55,b:.67,lo:.72,hi:3.23}],
 south:[{a:SOUTH_DOOR.x-.59,b:SOUTH_DOOR.x+.59,lo:0,hi:2.52},{a:1.895,b:2.705,lo:0,hi:2.1},{a:-1.098,b:.498,lo:1.377,hi:1.703}],
 east:[{a:-1.66,b:-1.34,lo:2.54,hi:2.75},{a:.78,b:1.12,lo:2.35,hi:2.69},{a:4.155,b:5.605,lo:0,hi:2.414},{a:2.07,b:3.01,lo:0,hi:2.313},{a:-4.085,b:.845,lo:.825,hi:2.295}],
 west:[{a:3.695,b:5.145,lo:0,hi:2.414}]};
 for(const p of POSTER_LAYOUT)for(const obstacle of obstacles[p.cardinal])assert.ok(!overlaps(rect(p),obstacle),`page ${p.page} clears ${p.cardinal} obstruction`);
 assert.ok(SOUTH_DOOR.x<0&&SOUTH_DOOR.z>0,'southwest opening');
 assert.ok(SOUTH_DOOR.x+SOUTH_DOOR.width/2< -2.25,'opening clears unchanged printer counter');
});
