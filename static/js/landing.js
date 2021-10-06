import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';

const fakepi = 3.1415926535897932
const canvas = document.querySelector('canvas.webgl')
const scene= new THREE.Scene()
const sizes={
	width: window.innerWidth,
    height: window.innerHeight
}
const clock = new THREE.Clock();
console.log(sizes)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 300)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 21
camera.lookAt(0,0,0)
scene.add(camera)
const SWORD = new THREE.Group();
SWORD.rotation.x = fakepi + .4;
SWORD.rotation.y = fakepi + .4;
SWORD.rotation.z = .5;
SWORD.position.x = 17;
SWORD.position.y = -4;
SWORD.position.z = 6;
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
function render(){
		renderer.render(scene, camera);
}
//document.body.appendChild(renderer.domElement);
//var controls = new OrbitControls(camera, document.getElementById("Web-BG"));
var Sword_Dict = {}
const oLoader = new GLTFLoader();
// update this with dict with parts
//Load(sword)
const mat = new THREE.Material(0xff00ff);
mat.transparent = true;
mat.opacity = .0;
let models = [];
function Load(path, model_dict){
	oLoader.load(path, function (gltf){
		models.push(gltf.scene)
		if (models.length > 1)
			changeMaterial(models[models.length-1], mat)
		
		console.log(models[models.length-1].material)
		if (model_dict != "BLAD")
			models[models.length-1].position.y -= 2
		SWORD.add(models[models.length-1])
		Sword_Dict[model_dict] = SWORD.children[models.length-1]
		
		console.log(Sword_Dict[model_dict].position.z);
		//scene.add(models[models.length-1])
	}, function (xhr){
		console.log(xhr.loaded/xhr.total * 100 + '% loaded')
	}, function (error){
		console.log(error)
	})
}
function changeMaterial(mesh, material){
	mesh.traverse( function(child){
		if (child instanceof THREE.Mesh){
			child.material.color = material.color;
			child.material.opacity = material.opacity;
			child.material.transparent = material.transparent;
		}
	});
}
var ltime = 0
function prepanimate(){
	if (ltime  == 3)
		animate();
	else	
		ltime += 1;
}
function animate() {
	const elapsedTime = clock.getElapsedTime()
	if (getScrollPercent() > .25){
		make_opaque(Sword_Dict['CROSS'].children[0], 1/100.0);
	}
	if (getScrollPercent() > .50){
		make_opaque(Sword_Dict['GRIP'].children[0], 1/100.0);//.children[0].material.opacity = 1;
	}
	if (getScrollPercent() > .75){
		make_opaque(Sword_Dict['POMM'].children[0], 1/100.0);//.material.opacity = 1;
	}
	
	render()
	window.requestAnimationFrame(animate)
}
function make_opaque(mesh, interval){
	if (mesh.material.opacity < 1)
		mesh.material.opacity += interval
	if (mesh.position.y < 0 ){
		console.log(mesh.position.z)
		mesh.position.y += interval
	}
}

var parts = []

function  response23D(file, dict_pos) {
	file = JSON.parse(file.responseText)
	Load(file.file, file.part_type);
	scene.add(SWORD);
	prepanimate();
}
response23D( await getxmlhttp('/api/parts/21', 'GET'))// response23D),
response23D(await getxmlhttp('/api/parts/18', 'GET'))// response23D),
response23D(await getxmlhttp('/api/parts/16', 'GET'))// response23D),
response23D(await getxmlhttp('/api/parts/15', 'GET'))// response23D)
//console.log(getxmlhttp('/api/parts/21','GET'));
var sList = [

]
scene.add(SWORD);
async function getxmlhttp(url, method) {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.open(method, url);
		
		xhr.onload = function() {
			if ( this.status >= 200 && this.status < 300) {
				resolve(xhr);
			} else {
				reject({
					status: this.status, 
					status: xhr.statusText
				});
			};
		};
		xhr.onerror = function() {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		};
		xhr.send();
		});
}

const pointLight = new THREE.PointLight(0xffffff, 3)
pointLight.position.set(0,3,3)
scene.add(pointLight)

window.addEventListener('resize', () => {
 sizes.width =  window.innerWidth
 sizes.Height = window.innerHeight
 camera.aspect = sizes.width / sizes.height
 camera.updateProjectionMatrix()
 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

document.addEventListener('scroll', onDocscrollMove)

function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight);// * 100;
}

function onDocscrollMove(){
	// set animation at % progress
	//keyframes:
	//		Only Blade
	//		Blade + CrossGuard
	//		Blade Cross and grips
	//		finished blade
//	console.log('position: ', camera.position  )
	
}
const tick = ()=>{

}


tick()