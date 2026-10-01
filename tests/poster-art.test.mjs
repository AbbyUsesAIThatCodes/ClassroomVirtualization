import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
test('poster atlas embeds the same bytes and maps finished pages once within bounds',async()=>{
 const meta=JSON.parse(await readFile('src/assets/quote-posters.json','utf8'));
 const atlas=await readFile('src/assets/quote-posters-atlas.jpg');
 const module=await readFile('src/assets/quote-posters-data.js','utf8');
 const embedded=Buffer.from(module.match(/base64,([^']+)/)[1],'base64');
 assert.deepEqual(embedded,atlas);assert.equal(createHash('sha256').update(atlas).digest('hex'),meta.atlasSha256);
 assert.deepEqual(meta.entries.map(e=>e.page),Array.from({length:38},(_,i)=>i+1));
 for(const e of meta.entries){assert.ok(e.x>=4&&e.y>=4);assert.ok(e.x+e.width<meta.atlasWidth);assert.ok(e.y+e.height<meta.atlasHeight);assert.ok(Math.abs(e.width/e.height-792/612)<.005);}
 assert.deepEqual(meta.excludedPages,[39]);
});
