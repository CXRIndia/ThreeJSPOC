import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';
import { Vector3 } from 'three';


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

const loader = new GLTFLoader()
let mixer = new THREE.AnimationMixer()
let modelReady = false
const clock = new THREE.Clock()
let bulldog= null
loader.load(
  '/models/bulldognew.glb',
    function (gltf) {

      gltf.scene.scale.set(65,65,65)
      gltf.scene.position.set(25,-20,-20);
      gltf.scene.rotation.y = -0.5;
          
      mixer = new THREE.AnimationMixer(gltf.scene)
      mixer.clipAction(gltf.animations[0]).play();
      bulldog=gltf.scene;
      scene.add(gltf.scene)
      
      modelReady=true
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)


// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);


// Background

const spaceTexture = new THREE.TextureLoader().load('/images/Court.jpg');
scene.background = spaceTexture;

const moonTexture = new THREE.TextureLoader().load('/images/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('/images/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 10;
moon.position.y = 40;
moon.position.setX(-100);

const data = {
  lerpAlpha: 10,
  lerpVectorsAlpha: 1.0,
}

function playScrollAnimations() {
  console.log(scrollPercent)  
  scrollPercent =((document.documentElement.scrollTop || document.body.scrollTop) /
          ((document.documentElement.scrollHeight ||
              document.body.scrollHeight) -
              document.documentElement.clientHeight)) *
      100
  ;

  if (modelReady)
  {   
    if(scrollPercent<10)
    {
      bulldog.scale.set(65,65,65)
      bulldog.position.set(25,-20,-20);
      bulldog.rotation.y = -0.5;  
      bulldog.rotation.x = 0;
      bulldog.rotation.z = 0;  
    }
    //else if(scrollPercent>90)
   // {             
        //bulldog.scale.lerp(new Vector3(65,65,65),scrollPercent*0.001)
       // bulldog.rotation.y = -0.5;   
       // bulldog.rotation.x = 0;
       // bulldog.rotation.z = 0;     
   // }
    else 
    {            
      bulldog.scale.lerp(new Vector3(55,55,55),scrollPercent*0.0005)
      bulldog.position.lerp(new Vector3(32,-20,-15),scrollPercent*0.0005);
      bulldog.rotation.x = -scrollPercent*0.005;     
      //bulldog.rotation.y = scrollPercent*0.06
      bulldog.rotation.y = scrollPercent*0.06
    }
  }

}
// Scroll Animation
let scrollPercent = 0

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;
  
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  playScrollAnimations()
  moon.rotation.x += 0.005;
  if (modelReady) mixer.update(clock.getDelta())
  // controls.update();

  renderer.render(scene, camera);
}

animate();


