import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { build } from 'esbuild';
const root=resolve(process.env.SERVE_DIST?'dist':'.');
const manifest=process.env.BUILD_MANIFEST_PATH?JSON.parse(await readFile(process.env.BUILD_MANIFEST_PATH,'utf8')):null;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
  try{
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(path==='/app.js'&&!process.env.SERVE_DIST){const result=await build({entryPoints:['src/app.js'],bundle:true,format:'esm',write:false,sourcemap:'inline',define:manifest?{__BUILD_MANIFEST__:JSON.stringify(manifest)}:{}});res.writeHead(200,{'Content-Type':'text/javascript'});res.end(result.outputFiles[0].contents);return;}
    const local=path.startsWith('/assets/')&&!process.env.SERVE_DIST?'/public'+path:path;
    let file=resolve(root,'.'+local);if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403);res.end();return;}
    if((await stat(file)).isDirectory())file=resolve(file,'index.html');
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log((manifest?.id||(process.env.SERVE_DIST?'Existing Build — Identity In build-manifest.json':'Live Development — Unpackaged'))+'\nClassroom: http://127.0.0.1:'+(process.env.PORT||4173)));
