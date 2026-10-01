import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { reserveOrdinal } from '../scripts/build-identity.mjs';
test('concurrent reservations are unique, durable, per scope, and retain failed attempts',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'classroom-identity-'));
 try{
  const values=await Promise.all(Array.from({length:8},()=>reserveOrdinal(dir,'pr-3')));
  assert.deepEqual(values.sort((a,b)=>a-b),[1,2,3,4,5,6,7,8]);
  assert.equal(await reserveOrdinal(dir,'pr-4'),1);
  assert.equal(await reserveOrdinal(dir,'pr-3',{status:'failed'}),9);
  assert.equal(await reserveOrdinal(dir,'pr-3'),10);
  const ledger=JSON.parse(await readFile(join(dir,'ledger.json'),'utf8'));
  assert.equal(ledger.attempts.length,11);assert.equal(ledger.attempts.filter(x=>x.status==='failed').length,1);
 }finally{await rm(dir,{recursive:true,force:true});}
});
