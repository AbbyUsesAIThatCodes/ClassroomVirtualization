import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
export async function browserSession({port=4173,dist=false}={}) {
  const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port),...(dist?{SERVE_DIST:'1'}:{})},stdio:['ignore','pipe','inherit']});
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error('Server exited '+code)));});
  let browser;
  try{browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});}catch(e){server.kill();throw e;}
  return {browser,url:`http://127.0.0.1:${port}`,close:async()=>{await browser.close();server.kill();}};
}
