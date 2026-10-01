import { readFile, writeFile, mkdir, open, rm, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
export async function reserveOrdinal(directory,scope,record={}) {
  await mkdir(directory,{recursive:true});
  const lock=resolve(directory,'allocator.lock');let handle;
  for(let i=0;i<200;i++){
    try{handle=await open(lock,'wx');break;}catch(e){if(e.code!=='EEXIST')throw e;await new Promise(r=>setTimeout(r,25));}
  }
  if(!handle)throw new Error('Build allocator is locked; establish the owning process has stopped before recovery.');
  try{
    const path=resolve(directory,'ledger.json');let ledger={attempts:[]};
    try{ledger=JSON.parse(await readFile(path,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
    const ordinal=1+Math.max(0,...ledger.attempts.filter(x=>x.scope===scope).map(x=>x.ordinal));
    ledger.attempts.push({scope,ordinal,...record});
    await writeFile(path,JSON.stringify(ledger,null,2)+'\n');
    return ordinal;
  }finally{await handle.close();await rm(lock);}
}
export async function sourceFingerprint(){
  const paths=[];
  async function walk(dir){for(const ent of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+ent.name;if(ent.isDirectory())await walk(path);else paths.push(path);}}
  for(const dir of ['src','scripts','tests'])await walk(dir);
  paths.push('index.html','style.css','package.json','package-lock.json','release.json','godot/demo/player.gd','godot/demo/build_identity.gd','godot/demo/verify_scene.gd','godot/demo/walkthrough.tscn','godot/project.godot');
  const hash=createHash('sha256');for(const path of paths.sort()){hash.update(path+'\0');hash.update(await readFile(path));hash.update('\0');}
  return {sha256:hash.digest('hex'),paths};
}
export async function newManifest(target){
  const release=JSON.parse(await readFile('release.json','utf8'));
  const scope=process.env.BUILD_SCOPE||(process.env.GITHUB_RUN_ID?`local-ci-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`:'local-review');
  if(!/^(pr-\d+|local-[\w-]+|main|release)$/.test(scope))throw new Error('Invalid explicit build scope');
  const revision=git('rev-parse','HEAD');const fingerprint=await sourceFingerprint();
  const dirty=Boolean(git('status','--porcelain','--',...fingerprint.paths));
  const common=resolve(git('rev-parse','--git-common-dir'),'..');
  // One durable allocator per primary checkout; commit/push every reservation.
  const ordinal=await reserveOrdinal(resolve(common,'build'),scope,{revision,target,status:'reserved'});
  const utc=new Date().toISOString();
  const stamp=utc.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const id=`${release.version}_${release.codenameSlug}_${scope}_build-${String(ordinal).padStart(3,'0')}_${stamp}_g${revision.slice(0,12)}${dirty?'-dirty-'+fingerprint.sha256.slice(0,8):''}_${target}`;
  let prHead=null;if(process.env.GITHUB_EVENT_PATH){const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));prHead=event.pull_request?.head?.sha||null;}
  return Object.freeze({...release,id,scope,pr:scope.startsWith('pr-')?Number(scope.slice(3)):null,ordinal,utc,revision,prHead,dirty,sourceFingerprint:fingerprint.sha256,target});
}
export async function runBuild(target,action){
  const manifest=await newManifest(target);
  const dir=resolve('artifacts/builds',manifest.id);await mkdir(dir,{recursive:true});
  const path=resolve(dir,'build-manifest.json');await writeFile(path,JSON.stringify(manifest,null,2)+'\n');
  console.log('BUILD START '+manifest.id);
  const report=`Build: ${manifest.id}\nRelease: ${manifest.version} ${manifest.codename} (${manifest.status})\nSource: ${manifest.revision}\nDirty Inputs: ${manifest.dirty}\nInput SHA256: ${manifest.sourceFingerprint}\nUTC: ${manifest.utc}\nTarget: ${manifest.target}\n`;
  try{await action(manifest,path);await writeFile(resolve(dir,'BUILD-REPORT.txt'),report+'Result: success\n');console.log('BUILD SUCCESS '+manifest.id);}
  catch(e){await writeFile(resolve(dir,'BUILD-REPORT.txt'),report+'Result: failed\n'+e.stack+'\n');console.error('BUILD FAILED '+manifest.id);throw e;}
  if(process.env.GITHUB_STEP_SUMMARY)await writeFile(process.env.GITHUB_STEP_SUMMARY,report,{flag:'a'});
  return {manifest,dir,report};
}
