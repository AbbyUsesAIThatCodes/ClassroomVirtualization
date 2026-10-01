import { build } from 'esbuild';
import { mkdir, cp, copyFile, readFile, writeFile } from 'node:fs/promises';
import { runBuild } from './build-identity.mjs';
export async function buildWeb(manifest){
await mkdir('dist',{recursive:true});
await build({entryPoints:['src/app.js'],bundle:true,format:'esm',outfile:'dist/app.js',minify:true,sourcemap:true,target:'es2022',define:{__BUILD_MANIFEST__:JSON.stringify(manifest)}});
for(const file of ['index.html','style.css'])await copyFile(file,'dist/'+file);
await cp('public','dist',{recursive:true});
const html=await readFile('index.html','utf8'),css=await readFile('style.css','utf8'),js=await readFile('dist/app.js','utf8');
// Function replacements preserve literal dollar expressions inside the JS bundle.
const standalone=html.replace('<link rel="stylesheet" href="./style.css">',()=>'<style>'+css+'</style>').replace('<script type="module" src="./app.js"></script>',()=>'<script type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script>');
await writeFile('dist/Classroom-Walkthrough.html',standalone);
await writeFile('dist/build-manifest.json',JSON.stringify(manifest,null,2)+'\n');
await writeFile('dist/BUILD-REPORT.txt',`Build: ${manifest.id}\nSource: ${manifest.revision}\nDirty Inputs: ${manifest.dirty}\nInput SHA256: ${manifest.sourceFingerprint}\nUTC: ${manifest.utc}\n`);
}
if(process.argv[1]?.endsWith('build.mjs')){
  await runBuild('web',async manifest=>{
    await buildWeb(manifest);
    await cp('dist','review-packages/'+manifest.id+'/site',{recursive:true});
  });
}
