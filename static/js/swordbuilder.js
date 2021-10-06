//imports 
//variables
//functions
////Event Listeners
////helpers


//import '../css/swordbuilder.css'
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';
//
const apiaddress = 'http://127.0.0.1:8000/api/'
const partapi = 'parts/'
const productapi = 'products/'
const jsonformatter = '/?format=json'
var cart = {}
var partViews = []
for (let i = 0; i < 4; i++)
	partViews.push(document.getElementById('part'+i))
var selectedView = document.querySelector("part-selected")
var nextArrow = document.getElementById("next-arrow")
var prevArrow = document.getElementById("prevArrow")
var SelectionDoc = document.getElementsByClassName("selectable")
var swordmap = {0:'BLAD',1:'CROSS',2:'GRIP',3:'POMM'}
const xmlhttp = new XMLHttpRequest();
let filepath, part_type, productId, id, currplace
var part_list = []
var built_sword = {}
let price_key = {}


//******* 3js stuff **********//
const clock = new THREE.Clock()
/** * Sizes * **/
const sizes = {
    width: document.getElementById("Viewport").offsetWidth,
    height: document.getElementById("Viewport").offsetHeight
}
// Canvas
const canvas = document.querySelector('canvas.webgl')
/** // * Renderer * // */
const renderer = new THREE.WebGLRenderer({
 canvas: canvas,
 alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// Scene
const scene = new THREE.Scene()
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)
// Materials
const material = new THREE.MeshStandardMaterial()
//light
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
const pointLight2 = new THREE.PointLight(0xff0000, 10)
pointLight2.position.set(-3,2.3,-3)
scene.add(pointLight2)
const pointLight3 = new THREE.PointLight(0xff0000,9.1)
pointLight3.position.set(1,-1,0)
pointLight3.color.set(0x4aff)
scene.add(pointLight3)
//mouse
 let mouseX = 0;
 let mouseY = 0;
 let targetX = 0;
 let targetY = 0;
 const windowHalfX = window.innerWidth / 2;
 const windowHalfY = window.innerHeight / 2;
//controls
var controls = new OrbitControls(camera, renderer.domElement);
//Loaders 
let model = {};
const oLoader = new GLTFLoader();

//******************************************************************************************//
/********************************** * Functions * *******************************************/
//******************************************************************************************//

/////////////////////////////////     listeners
for (let iter = 0; iter < SelectionDoc.length; iter++){
	
	SelectionDoc[iter].addEventListener("click", function(){
		getPartView(swordmap[iter])
		currplace = swordmap[iter]
		})
	//console.log(iter)
	
	}

for (let xter = 0; xter < partViews.length; xter++){
	
partViews[xter].addEventListener("click", function(){getModel(partViews[xter])})
	
	}

document.addEventListener('mousemove', onDocumentMouseMove)

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = document.getElementById("Viewport").offsetWidth
    sizes.height = document.getElementById("Viewport").offsetHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
///************************************************************************************************//
//////////////////////////////////////////////functions//////////////////////////////////////////////
///************************************************************************************************//

function updatePrice(){
	// updates the prices within the cart
	
	var el = document.getElementById('Map')
	var stringer = ''
	var sum = 0.0
	for (let i in built_sword){
			stringer += '<li>' + built_sword[i].name + ' $' + price_key[built_sword[i].pk] + '</li>'
			sum += parseFloat(price_key[built_sword[i].pk]);
	}
	el.innerHTML = '<ul class="sword-cart">Cart' + stringer + '<li>Total: $' + sum.toFixed(2) + '</li></ul>'
}

function changeImages(iter = 0){
	//changes the images within the footer
	
	for (let i = iter; i < partViews.length || i < part_list.length; i++){
		var div = document.getElementById('part'+i);
		div.src = part_list[i].imageURL
		div.alt = part_list[i].part
	}
}

function getModel(doc){
	// forms api request to get the 3dmodel
	var arg = doc.alt
	var getter = apiaddress + partapi + arg + jsonformatter
	xmlhttp.open('GET', getter)
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("x=")
}

function getPartView(arg){
	//fetch items based on selected part
	var getter = apiaddress + productapi + arg + jsonformatter
	xmlhttp.open('GET', getter)
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("x=")
}

function render() {
	//renders 3d
	renderer.render(scene, camera);
}

function LoadModel(path, position){
	//loads model and places in scene
	console.log('attempt')
	if (model[position] != null)
		scene.remove(model[position])
	oLoader.load( path, function (gltf) {
		model[position] = gltf.scene
		scene.add(model[position])
		console.log("sucess!")
	}, function (xhr){
		console.log( (xhr.loaded/xhr.total * 100) + '% loaded');
	}, function (error){
		console.log('an error occured')
	});
	//console.log(model)
}

 function onDocumentMouseMove(event){
	 //gets mouse movement *** Deprecated ***
	 mouseX = (event.clientX - windowHalfX)
	 mouseY = (event.clientY - windowHalfY)
 }


const tick = () =>
{
	// handles 3d rendering with changing parts
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
var available
xmlhttp.onload = function(){
	//loads xml response and parses into usable code
	var myObj = JSON.parse(this.responseText);
	id = myObj.pk
	name = myObj.name
	part_list = []
	if (myObj.part_type != null){
		Object.keys(built_sword).forEach(key => built_sword[key] === 'undefined' && delete built_sword[key])
		built_sword[myObj.part_type] = myObj
		//console.log('Built Sword:', built_sword)
		LoadModel(myObj.file,myObj.part_type)
		console.log('part pk', myObj.pk)
		updatePrice()
	} else {
		
		for (let obj in myObj){
			part_list.push(myObj[obj])
			price_key[myObj[obj].part] = myObj[obj].price
			//console.log('part key', myObj[obj].part, 'part price', price_key[myObj[obj].part])
		}
		changeImages()
	}
}

// go button for rendering
tick()