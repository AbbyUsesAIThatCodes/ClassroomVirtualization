import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { browserSession } from '../scripts/browser-session.mjs';
const run=await browserSession({port:4175,dist:true});
const errors=[];const results={};
const manifest=JSON.parse(await readFile('dist/build-manifest.json','utf8'));
await mkdir('artifacts',{recursive:true});
try{
 const page=await run.browser.newPage({viewport:{width:1440,height:1000}});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(run.url+'/?qa=1');await page.waitForFunction(()=>window.classroomQA?.ready);
 assert.equal(await page.locator('#build-identity').textContent(),manifest.id);
 await page.screenshot({path:'artifacts/classroom-entrance.png'});
 await page.click('#dismiss');
 const initial=await page.evaluate(()=>window.classroomQA.getState());
 // Movement runs through the actual input/frame/collision pipeline, into a table.
 await page.locator('#viewport').focus();await page.keyboard.down('KeyW');await page.waitForFunction(()=>window.classroomQA.getState().position[2]<3.82,{},{timeout:45000});await page.keyboard.up('KeyW');
 let after=await page.evaluate(()=>window.classroomQA.getState());assert.ok(after.position[2]<initial.position[2]-.4,'walk moves');
 await page.evaluate(()=>window.classroomQA.setPose([1.05,1.65,1.65],[1.05,1.65,-3]));await page.keyboard.down('KeyW');await page.waitForFunction(()=>window.classroomQA.getState().position[2]<1.07,{},{timeout:45000});await page.waitForTimeout(1500);await page.keyboard.up('KeyW');
 // At the slow-frame cap a rejected movement step may leave up to .09 m clearance.
 after=await page.evaluate(()=>window.classroomQA.getState());assert.ok(after.position[2]>=.969&&after.position[2]<1.07,'table stops the controller without penetration');
 await page.evaluate(()=>window.classroomQA.setPose([-2.85,1.65,6.25],[-2.85,1.65,7]));await page.keyboard.down('KeyW');await page.waitForFunction(()=>window.classroomQA.getState().position[2]>6.6,{},{timeout:45000});await page.waitForTimeout(1200);await page.keyboard.up('KeyW');
 const doorStop=await page.evaluate(()=>window.classroomQA.getState());assert.ok(doorStop.position[2]>=6.62&&doorStop.position[2]<=6.7151,'closed southwest leaf stops movement without penetration');results.southDoorStop=doorStop.position;
 await page.evaluate(position=>window.classroomQA.setPose(position,[1.05,1.65,-3]),after.position);
 await page.click('#overview');assert.equal((await page.evaluate(()=>window.classroomQA.getState())).ceiling,false);
 await page.waitForTimeout(350);await page.screenshot({path:'artifacts/classroom-overview.png'});
 await page.click('#walk');const restored=await page.evaluate(()=>window.classroomQA.getState());assert.ok(Math.abs(restored.position[2]-after.position[2])<.02,'return restores walk position');
 await page.selectOption('#view-select','maker');await page.screenshot({path:'artifacts/classroom-maker-corner.png'});
 await page.click('#settings-toggle');await page.click('#activity');assert.equal(await page.locator('#view-name').textContent(),'A lever in your classroom');await page.screenshot({path:'artifacts/classroom-lever-example.png'});
 await page.click('#settings-toggle');await page.check('#anchors');await page.uncheck('#ceiling');assert.equal((await page.evaluate(()=>window.classroomQA.getState())).ceiling,false);
 await page.click('#close-settings');
 // Validate downloadable URL in the built subpath-friendly bundle.
 const asset=await page.request.get(run.url+'/assets/classroom.glb');assert.equal(asset.status(),200);assert.equal((await asset.body()).subarray(0,4).toString(),'glTF');
 await page.setViewportSize({width:1280,height:720});await page.screenshot({path:'artifacts/classroom-laptop.png'});
 results.desktop={calls:initial.calls,triangles:initial.triangles,start:initial.position,stoppedAt:after.position};
 const offline=await run.browser.newPage({viewport:{width:960,height:640}});offline.on('pageerror',e=>errors.push(e.message));
 await offline.goto(pathToFileURL(resolve('dist/Classroom-Walkthrough.html')).href);
 await offline.waitForFunction(()=>typeof document.getElementById('start').onclick==='function');
 assert.equal(await offline.locator('#build-identity').textContent(),manifest.id);
 await offline.click('#dismiss');await offline.click('#settings-toggle');assert.equal(await offline.locator('#settings').isVisible(),true,'offline script runs');
 const localDownload=offline.waitForEvent('download');await offline.click('#download-layout');const downloaded=await localDownload;
 assert.ok(downloaded.suggestedFilename().includes('local-browser-'));await downloaded.saveAs('artifacts/offline-layout-export.json');
 const localLayout=JSON.parse(await readFile('artifacts/offline-layout-export.json','utf8'));assert.equal(localLayout.build.parentBuild,manifest.id);assert.equal(localLayout.colliders.length,46);
 await offline.screenshot({path:'artifacts/classroom-offline.png'});await offline.close();
 const mobile=await run.browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});mobile.on('pageerror',e=>errors.push(e.message));
 await mobile.goto(run.url+'/?qa=1');await mobile.waitForFunction(()=>window.classroomQA?.ready);await mobile.click('#dismiss');
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal overflow');
 assert.equal(await mobile.locator('#build-identity').textContent(),manifest.id);
 const buildBox=await mobile.locator('#build-identity').boundingBox();const dockBox=await mobile.locator('.dock').boundingBox();assert.ok(buildBox.y>=dockBox.y+dockBox.height,'identity does not overlap controls');
 const touch=mobile.locator('[data-move="KeyW"]');assert.equal(await touch.isVisible(),true);
 const beforeTouch=await mobile.evaluate(()=>window.classroomQA.getState());
 const cdp=await mobile.context().newCDPSession(mobile);const touchBox=await touch.boundingBox();
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:touchBox.x+20,y:touchBox.y+20}]});await mobile.waitForTimeout(400);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const afterTouch=await mobile.evaluate(()=>window.classroomQA.getState());assert.ok(afterTouch.position[2]<beforeTouch.position[2],'touch forward works');
 // Touch drag changes view heading independently of movement.
 const yaw=afterTouch.yaw;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:220,y:380}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:270,y:390}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.notEqual((await mobile.evaluate(()=>window.classroomQA.getState())).yaw,yaw);
 await mobile.screenshot({path:'artifacts/classroom-phone.png'});
 await mobile.click('#settings-toggle');const panel=await mobile.locator('#settings').boundingBox();assert.ok(panel.x>=0&&panel.x+panel.width<=390,'settings fit phone');await mobile.screenshot({path:'artifacts/classroom-phone-settings.png'});
 assert.deepEqual(errors,[],'no JavaScript errors');
 results.browserErrors=errors;results.mobile='390×844: movement, touch look, settings, no overflow';
 results.build=manifest.id;
 await writeFile('artifacts/browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await run.close();}
