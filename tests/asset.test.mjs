import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateBytes } from 'gltf-validator';
import { ANCHORS } from '../src/layout.js';
test('GLB validates, embeds resources, preserves anchors, and matches Godot copy',async()=>{
  const data=await readFile('public/assets/classroom.glb');
  const report=await validateBytes(new Uint8Array(data),{uri:'classroom.glb',maxIssues:20});
  assert.equal(report.issues.numErrors,0,JSON.stringify(report.issues));
  const json=JSON.parse(data.subarray(20,20+data.readUInt32LE(12)).toString());
  for(const anchor of ANCHORS)assert.ok(json.nodes.some(n=>n.name===anchor.name),'missing '+anchor.name);
  assert.ok(json.images.every(i=>i.bufferView!==undefined),'all textures must be embedded');
  assert.ok(json.buffers.every(b=>!b.uri),'no external buffer');
  assert.ok(!json.nodes.some(n=>n.name==='ExampleLeverActivity'),'game example must not leak into asset');
  assert.deepEqual(data,await readFile('godot/classroom/classroom.glb'));
  console.log(`GLB: ${report.issues.numErrors} errors, ${report.issues.numWarnings} warnings; ${data.length} bytes`);
});
