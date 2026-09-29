import * as THREE from 'three';
/** A visual attachment example, deliberately independent of the environment. */
export function createLeverExample() {
  const g=new THREE.Group();g.name='ExampleLeverActivity';
  const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.5});
  const wood=mat('#ca9a5a'),dark=mat('#264b48'),gold=mat('#dca747'),pink=mat('#c57883');
  const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
  add(new THREE.BoxGeometry(.7,.025,.32),dark,0,.013,0);
  const triangle=new THREE.Shape();triangle.moveTo(-.13,0);triangle.lineTo(.13,0);triangle.lineTo(0,.185);triangle.closePath();
  add(new THREE.ExtrudeGeometry(triangle,{depth:.2,bevelEnabled:false}),gold,0,.025,-.1);
  add(new THREE.BoxGeometry(1.32,.037,.15),wood,0,.227,0);
  for(const x of [-.47,.47]){add(new THREE.CylinderGeometry(.063,.063,.15,20),x<0?dark:pink,x,.317,0);}
  for(let x=-.6;x<=.61;x+=.1)add(new THREE.BoxGeometry(.009,.003,.035),dark,x,.248,.057);
  return g;
}
