
import { AmbientLight, Clock, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

import './style.css'


const webGLCanvas: any = document.querySelector('canvas.webgl')
let camera: any;
let light: any;
let gui = new GUI()
let scene = new Scene();
let textureLoader = new TextureLoader();
let controls: OrbitControls;
let renderer: WebGLRenderer;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const clock = new Clock();

//Light
const ambientLight = new AmbientLight('#ffffff', 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)


//Camera
camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

controls = new OrbitControls(camera, webGLCanvas)
controls.enableDamping = true

const sphere = new Mesh(
  new SphereGeometry(1, 32, 32),
  new MeshStandardMaterial({ roughness: 0.7 })
)
sphere.position.y = 1
scene.add(sphere)


// Directional light
const moonLight = new DirectionalLight('#ffffff', 0.5)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


// Floor
const floor = new Mesh(
  new PlaneGeometry(20, 20),
  new MeshStandardMaterial({ color: '#a9c388' })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)
//Renderer
renderer = new WebGLRenderer({
  canvas: webGLCanvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

tick()
