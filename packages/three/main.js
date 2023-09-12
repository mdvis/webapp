/**
 * name: main.js
 * author: Deve
 * date: 2023-07-19
 */

window.addEventListener('load',function(){console.log('load')},false)
window.addEventListener('DOMContentLoaded',function() {console.log('dom')},false)

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI()
document.body.appendChild(gui.domElement)

const div = document.getElementById('tag');
const tag = new CSS2DObject(div);
tag.position.set(90,25,-60)

const div2 = document.getElementById('tag2');
const tag2 = new CSS2DObject(div2);
tag2.position.set(160,35,-90)

const css2Renderer = new CSS2DRenderer()

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()

loader.setDRACOLoader(dracoLoader)

loader.load('zs.gltf',function(gltf){
    gltf.scene.traverse(function(child){
        if(child.isMesh){
            //child.geometry.center();
            child.frustumCulled = false;

            child.castShadow=true;

            child.material.emissive = child.material.color;
            child.material.emissiveMap = child.material.map;
        }
    })
    //gltf.scene.scale.set(.1,.1,.1)

    scene.add(gltf.scene)
},
    function ( xhr ) {
        if(xhr.loaded === xhr.total) console.log( 'gltf loaded' )
    },
    function ( error ) {
        console.log( 'An error happened' );
    }
)

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .01, 3000 );
camera.position.set(0,1000,1000)
const renderer = new THREE.WebGLRenderer({
    antialias:true,
    logarithmicDepthBuffer: true
});

renderer.toneMapping = Number(THREE.LinearToneMapping);
renderer.toneMappingExposure = 0.23

const controls = new OrbitControls(camera,renderer.domElement)

//const environment = new RoomEnvironment()
//const pmremGenerator = new THREE.PMREMGenerator(renderer)
//pmremGenerator.compileEquirectangularShader()
//scene.environment = pmremGenerator.fromScene(environment).texture

const m = new THREE.MeshLambertMaterial({
    color:0xffff00,
    side: THREE.DoubleSide,
})
const g = new THREE.BufferGeometry();
const vs = new Float32Array([
    0,0,0,
    80,0,0,
    80,80,0,
    0,80,0,
    0,80,80,
    0,0,80,
    80,0,80,
    80,80,80,
]);
const is = new Uint8Array([
    0,1,2,0,2,3,
    0,3,5,3,4,5,
    4,5,7,5,6,7,
    6,1,2,6,7,2,
    7,2,3,7,4,3,
    5,6,0,0,1,6,
]);
g.attributes.position=new THREE.BufferAttribute(vs,3);
g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array([
0,0,1,
0,0,1,
0,0,1,
0,0,1,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
-1,0,0,
-1,0,0,
-1,0,0,
-1,0,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
]), 3))
g.index = new THREE.BufferAttribute(is,1);
const mm2 = new THREE.Mesh(g,m);
mm2.position.set(-300,0,0)
scene.add(mm2);

const grid = new THREE.GridHelper(500,100,0xffffff,0xffffff)
grid.material.opacity=.5
grid.material.depthWrite=false
grid.material.transparent=true
//scene.add(grid)

const group = new THREE.Group()
group.add(tag)
group.add(tag2)
scene.add(group)

const ambient = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambient);

const direct = new THREE.DirectionalLight(0xffffff,1);
direct.position.set(10,10, 10)
scene.add(direct)

const light = new THREE.PointLight( 0xffffff, 1);
light.position.set(50,50, 50)
scene.add(light)

controls.addEventListener('change', function (...e) {
    renderer.render(scene, camera);
});

css2Renderer.domElement.style.position = 'absolute';
css2Renderer.domElement.style.top = '0px';
css2Renderer.domElement.style.pointerEvents= 'none';

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
css2Renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(css2Renderer.domElement);

const b={ antialias:false }

gui.add(ambient, 'intensity', 0, 200).name('环境')
gui.add(direct, 'intensity', 0, 200).name('平行')
gui.add(b, 'antialias', ).name('锯齿').onChange(v=>{
    renderer.antialias = v
})

const fl = gui.addFolder('点')
fl.add(light, 'intensity', 0, 200).name('点')
fl.add(light, 'intensity', [10,20,40,80,160]).name('点')
fl.add(light, 'intensity', {a:1,b:2}).name('点')

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 100, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
]);
const attribue = new THREE.BufferAttribute(vertices, 3);
geometry.attributes.position = attribue;
const material = new THREE.PointsMaterial({
    color:0xffffff,
    size:10,
})
const mm = new THREE.Points(geometry, material)
//scene.add(mm)

const boxG = new THREE.BoxGeometry(50,50,50);
const boxM = new THREE.MeshLambertMaterial({color:0xffffff, wireframe:true});
const boxC = new THREE.Mesh(boxG, boxM);
boxC.position.set(-100,0,0)
scene.add(boxC)

const ls = [1,1,2,1,2,2]

ls.forEach((c,i)=>{
    if(!((i+1)%2)){
        const a = new THREE.PlaneGeometry(100,50,ls[i-1],ls[i]);
        const b = new THREE.Mesh(a,boxM);
        b.position.set(i*100,0,0)
        scene.add(b)
    }
})

const imgload = new THREE.TextureLoader()
const img = imgload.load('./tx.png')
const boxG2 = new THREE.BoxGeometry(50,50,50);
window.tx = img;
const boxG3 = new THREE.SphereGeometry(15,32,16);
const boxM2 = new THREE.MeshLambertMaterial({
    color:0xffffff,
    map:img
   });
const boxC2 = new THREE.Mesh(boxG2, boxM2);
const boxC3 = new THREE.Mesh(boxG3, boxM2);
window.bx = boxC2;
boxC2.position.set(0,0,-100)
boxC3.position.set(0,0,-200)
scene.add(boxC2)
scene.add(boxC3)

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera)
    css2Renderer.render(scene,camera);
}

animate();

window.renderer=renderer
window.camera=camera
window.scene=scene
window.three=THREE
window.controls=controls
