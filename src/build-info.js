import release from '../release.json';
export const BUILD = typeof __BUILD_MANIFEST__ === 'undefined'
  ? {...release,id:'Live Development — Unpackaged',target:'live-development'}
  : __BUILD_MANIFEST__;
// A user-triggered offline export is a new local artifact, not a PR build rerun.
export function localExportIdentity(target){
  const utc=new Date().toISOString(),scope='local-browser-'+crypto.randomUUID();
  const stamp=utc.replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const revision=BUILD.revision||null;
  const id=`${BUILD.version}_${BUILD.codenameSlug}_${scope}_build-001_${stamp}_g${revision?.slice(0,12)||'unknown-source'}_${target}`;
  return {...BUILD,id,scope,pr:null,ordinal:1,utc,revision,target,parentBuild:BUILD.id};
}
