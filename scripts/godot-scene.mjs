import { readFile, writeFile } from 'node:fs/promises';
export async function generateGodotScene(){
const manifest=JSON.parse(await readFile('public/assets/classroom-layout.json','utf8'));
const boxes=[{name:'Floor',minX:-3.6,maxX:4.7,minZ:-7.2,maxZ:7.2,minY:-.2,maxY:0},...manifest.colliders];
const vec=values=>'Vector3('+values.map(x=>Number(x.toFixed(5))).join(', ')+')';
let text=`[gd_scene load_steps=${boxes.length+2} format=3]\n\n[ext_resource type="PackedScene" path="res://classroom/classroom.glb" id="1"]\n\n`;
boxes.forEach((b,i)=>{text+=`[sub_resource type="BoxShape3D" id="Box_${i}"]\nsize = ${vec([b.maxX-b.minX,b.maxY-b.minY,b.maxZ-b.minZ])}\n\n`;});
text+='[node name="Classroom" type="Node3D"]\n\n[node name="Model" parent="." instance=ExtResource("1")]\n\n[node name="Collisions" type="StaticBody3D" parent="."]\n\n';
boxes.forEach((b,i)=>{text+=`[node name="${b.name}_${i}" type="CollisionShape3D" parent="Collisions"]\nposition = ${vec([(b.minX+b.maxX)/2,(b.minY+b.maxY)/2,(b.minZ+b.maxZ)/2])}\nshape = SubResource("Box_${i}")\n\n`;});
text+='[node name="Anchors" type="Node3D" parent="."]\n\n';
manifest.anchors.forEach(a=>{text+=`[node name="${a.name}" type="Marker3D" parent="Anchors"]\nposition = ${vec(a.position)}\n\n`;});
await writeFile('godot/classroom/classroom.tscn',text);
console.log('Generated native Godot scene with '+boxes.length+' box colliders and '+manifest.anchors.length+' anchors.');
}
if(process.argv[1]?.endsWith('godot-scene.mjs'))throw new Error('Use npm run export so the Godot scene shares its export manifest.');
