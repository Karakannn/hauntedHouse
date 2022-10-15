
import { AmbientLight, BoxGeometry, Clock, ConeGeometry, DirectionalLight, Float32BufferAttribute, Fog, Group, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PointLight, RepeatWrapping, Scene, SphereGeometry, TextureLoader, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

import './style.css'


const webGLCanvas: any = document.querySelector('canvas.webgl')
const gui = new GUI()
const scene = new Scene();
const textureLoader = new TextureLoader();

let controls: OrbitControls;
let renderer: WebGLRenderer;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const clock = new Clock();

//Textures#

//Door
const doorColorTexture = textureLoader.load('../textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('../textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('../textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('../textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('../textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('../textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('../textures/door/roughness.jpg')


//Bricks
const bricksColorTexture = textureLoader.load('../textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('../textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('../textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('../textures/bricks/roughness.jpg')

//Grass
const grassColorTexture = textureLoader.load('../textures/grass/color.jpg')
const grassAmbientOccluesionTexture = textureLoader.load('../textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('../textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('../textures/grass/roughness.jpg')


grassColorTexture.repeat.set(8, 8)
grassAmbientOccluesionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)


grassColorTexture.wrapS = RepeatWrapping
grassAmbientOccluesionTexture.wrapS = RepeatWrapping
grassNormalTexture.wrapS = RepeatWrapping
grassRoughnessTexture.wrapS = RepeatWrapping

grassColorTexture.wrapT = RepeatWrapping
grassAmbientOccluesionTexture.wrapT = RepeatWrapping
grassNormalTexture.wrapT = RepeatWrapping
grassRoughnessTexture.wrapT = RepeatWrapping

//Fog
const fog = new Fog('#262737', 1, 15)
scene.fog = fog


//Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

controls = new OrbitControls(camera, webGLCanvas)
controls.enableDamping = true

//House

//Group
const house = new Group();
scene.add(house);

//Walls

const walls = new Mesh(
  new BoxGeometry(4, 2.5, 4),
  new MeshStandardMaterial({
    map: bricksColorTexture,
    transparent: true,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
    aoMap: bricksAmbientOcclusionTexture
  })
)

walls.geometry.setAttribute('uv2',
  new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

walls.position.y = 1.25;
house.add(walls)

//Roof
const roof = new Mesh(
  new ConeGeometry(3.5, 1, 4),
  new MeshStandardMaterial({ color: 'red' })
)

roof.position.y = 3;
roof.rotateY(Math.PI / 4)
house.add(roof)


//Door
const door = new Mesh(
  new PlaneGeometry(2, 2),
  new MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture
  })
)

door.geometry.setAttribute(
  'uv2',
  new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1;
door.position.z = 2 + 0.01
house.add(door)


//Bushes
const bushGeometry = new SphereGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({ color: '#89c854' })

const bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.5, 0.5, 0.5)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)

const bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
house.add(bush1, bush2, bush3, bush4)


//Graves

const graves = new Group();
scene.add(graves)

const graveGeometry = new BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new MeshStandardMaterial({ color: '#b2b6b1' })

//Creatting Graves

for (let index = 0; index < 50; index++) {

  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6

  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  const grave = new Mesh(graveGeometry, graveMaterial)
  grave.position.set(x, 0.3, z)
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  grave.castShadow = true
  graves.add(grave)

}


//Light
const ambientLight = new AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


//Door Light
const doorLight = new PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)


// Floor
const floor = new Mesh(
  new PlaneGeometry(20, 20),
  new MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    transparent: true,
    aoMap: grassAmbientOccluesionTexture,
    roughnessMap: grassRoughnessTexture
  })
)

//Ghosts

const ghost1 = new PointLight('#ff00ff', 2, 3)
scene.add(ghost1);

const ghost2 = new PointLight('#00ffff', 2, 3)
scene.add(ghost2);

const ghost3 = new PointLight('#ffff00', 2, 3)
scene.add(ghost3);

floor.geometry.setAttribute('uv2',
  new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
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
renderer.setClearColor('#262737')


//Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true;

ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

//ShadowMap Optimization
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7




const tick = () => {

  const elapsedTime = clock.getElapsedTime()

  //Updating Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4) * Math.sin(elapsedTime * 2.5)

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(elapsedTime * 5) * Math.sin(elapsedTime * 2)

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
